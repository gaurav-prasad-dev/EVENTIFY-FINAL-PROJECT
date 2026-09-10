const { createClient } = require("redis");

// Support both full REDIS_URL string and discrete credentials
const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL.trim();
  }

  if (process.env.REDIS_HOST) {
    const protocol = process.env.REDIS_TLS === "true" ? "rediss" : "redis";
    const username = encodeURIComponent(process.env.REDIS_USERNAME || "default");
    const password = encodeURIComponent(process.env.REDIS_PASSWORD || "");
    const host = process.env.REDIS_HOST.trim();
    const port = process.env.REDIS_PORT || 6379;
    return `${protocol}://${username}:${password}@${host}:${port}`;
  }

  return "redis://127.0.0.1:6379";
};

const redisUrl = getRedisUrl();

const redisClient = createClient({
  url: redisUrl,
  // Send PING every 30s to keep connection alive in cloud environments (Redis Cloud / AWS / Heroku / Render)
  pingInterval: 30000,
  socket: {
    connectTimeout: 10000,
    reconnectStrategy: (retries) => {
      if (retries > 20) {
        console.error("Redis max reconnection attempts reached. Halting reconnect attempts.");
        return new Error("Redis retry limit exceeded");
      }
      // Reconnect with backoff up to 3 seconds
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("connect", () => {
  console.log("Redis Client: Connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis Client: Connected & Ready");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

redisClient.on("reconnecting", () => {
  console.log("Redis Client: Reconnecting...");
});

redisClient.on("end", () => {
  console.log("Redis Client: Connection Closed");
});

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("Redis Initial Connection Error:", err.message);
  }
})();

module.exports = redisClient;