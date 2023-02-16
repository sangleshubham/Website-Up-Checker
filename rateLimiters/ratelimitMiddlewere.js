import Redis from "ioredis";

// how to create redis middleware using nodeJS
let redis = new Redis();

export async function rateLimit(req, res, next) {
  let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const requstCount = await redis.incr(ip);

  //apply cooldown

  if (requstCount == 1) {
    redis.expire(ip, 60);
  } else {
    console.log("time to live : ", await redis.ttl(ip));
  }

  // cooldown emits ttl which is time to live ... how much time we have fot this

  if (requstCount > 20) {
    res.send("Rate limiting").status(429);
  } else {
    console.log(`Request Made so far ${requstCount}`);
    next();
    // res.send("Success")
  }
}
