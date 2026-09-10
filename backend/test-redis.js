/**
 * Redis Cloud Connection Test Script
 * Run: node test-redis.js
 */
require("dotenv").config();
const { createClient } = require("redis");

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

// Mask sensitive password for display
const maskedUrl = redisUrl.replace(/:([^:@]+)@/, ":****@");
console.log(`Connecting to Redis at: ${maskedUrl}...`);

const client = createClient({
  url: redisUrl,
  socket: {
    connectTimeout: 8000,
    reconnectStrategy: (retries) => {
      if (retries > 3) return new Error("Connection failed after 3 attempts");
      return 1000;
    },
  },
});

client.on("error", (err) => {
  console.error("Redis error event:", err.message);
});

(async () => {
  try {
    const startTime = Date.now();
    await client.connect();
    const pingTime = Date.now() - startTime;
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Connected to Redis in ${pingTime}ms!`);

    // Test ping
    const pingRes = await client.ping();
    console.log(`\x1b[32m[SUCCESS]\x1b[0m PING test: ${pingRes}`);

    // Test write & read
    const testKey = "eventify:test:connection";
    const testVal = `ok_${Date.now()}`;
    await client.set(testKey, testVal, { EX: 10 });
    const readVal = await client.get(testKey);

    if (readVal === testVal) {
      console.log("\x1b[32m[SUCCESS]\x1b[0m Read/Write test passed! Redis is working properly.");
    } else {
      console.warn("\x1b[33m[WARNING]\x1b[0m Read value mismatch:", readVal);
    }

    await client.del(testKey);
    console.log("\x1b[32m[SUCCESS]\x1b[0m Cleaned up test keys.");

    await client.quit();
    console.log("\x1b[32m[DONE]\x1b[0m Ready for production deployment!");
    process.exit(0);
  } catch (err) {
    console.error("\x1b[31m[ERROR]\x1b[0m Failed to connect to Redis:", err.message);
    console.log("\n--- Troubleshooting Tips for Redis Cloud ---");
    console.log("1. Verify your REDIS_URL in .env matches the format: redis://default:<password>@<host>:<port>");
    console.log("2. If SSL/TLS is enabled in Redis Cloud, use 'rediss://' (with two s's) instead of 'redis://'.");
    console.log("3. In Redis Cloud console, check 'Security / IP Whitelist' and ensure your server or 0.0.0.0/0 is allowed.");
    console.log("4. Check if password has special characters that might need URL encoding.");
    try {
      await client.disconnect();
    } catch {}
    process.exit(1);
  }
})();
