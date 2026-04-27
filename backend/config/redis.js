const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
    console.log("Redis error", err);
});

(async () => {
    await redisClient.connect();
    console.log("Redis Connected");
})();

module.exports = redisClient;