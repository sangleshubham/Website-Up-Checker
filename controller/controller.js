import got from "got";
import tunnel from "tunnel";
import { getConnection } from "../schema/dbConnection.js";

export async function isSiteUp(req, res) {

  
  getConnection().then(async (connection) => {
    connection
    .db("nodeexpressproject")
    .collection("proxyList")
    .find({ country: req.body.location }).project({_id:0})
    .toArray()
    .then(async (dataArray) => {
      console.log(dataArray)
      for (let proxy of dataArray) {
        try {
          console.log("Inside try " + proxy.port)
          await got(req.body.site, {
            agent: {
              https: tunnel.httpsOverHttp({
                proxy: { host: proxy.ip, port: proxy.port},
              }),
            },
          });
          console.log("ip is getting scanned " + proxy.ip);
          res.send({ status: "Success" });
          break;
        } catch (e) {
          console.log(e.message)
          console.log("API Failed " + proxy.ip)
          getConnection().then((connection) => {
              // connection
              //   .db("nodeexpressproject")
              //   .collection("proxyList")
              //   .deleteOne({ query: proxy.query }); // removes record from db
            });
          }
        }
        if (res.headerSent) res.send({ status: "Failed" });
      });
  });
}
