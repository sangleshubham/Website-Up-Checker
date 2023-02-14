import got from "got";
import tunnel from "tunnel";
import { getConnection } from "../schema/dbConnection.js";

export async function isSiteUp(req, res) {
  getConnection().then(async (connection) => {
    connection
      .db("nodeexpressproject")
      .collection("proxyList")
      .find({ country: req.body.location })
      .project({ _id: 0 })
      .toArray()
      .then(async (dataArray) => {
        for (let proxy of dataArray) {
          try {
            await got(req.body.site, {
              agent: {
                https: tunnel.httpsOverHttp({
                  proxy: { host: proxy.ip, port: proxy.port },
                }),
              },
            });
            console.log("ip is getting scanned " + proxy.ip);
            res.send({ status: "Success" });
            break;
          } catch (e) {
            if ((e.code = "ENOTFOUND")) {
              console.log("Connection error " , e.message);
              res.send({ status: "Failed" });
              break;
            } else {
              getConnection().then((connection) => {
                connection
                  .db("nodeexpressproject")
                  .collection("proxyList")
                  .deleteOne({ query: proxy.query }); // removes record from db
              });
            }
          }
          console.log("API Failed " + proxy.ip);
        }
        console.log("Request Fullfilled");

        if (res.headerSent) res.send({ status: "No-VPN-Available" });
      });
  });
}

export async function enumerateCountry(req, res) {
  let countries = new Set();
  getConnection().then((con) => {
    con
      .db("nodeexpressproject")
      .collection("proxyList")
      .find({})
      .project({ _id: 0, country: 1 })
      .toArray()
      .then((array) => {
        for (let country of array) {
          if (country?.country) countries.add(country.country);
        }
        res.send(Array.from(countries));
      });
  });
}
