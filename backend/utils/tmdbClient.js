const axios = require("axios");
const https = require("https");
const dns = require("dns");
require("dotenv").config();

// Known, verified TMDB CloudFront IPs
// Bypasses Indian ISP DNS sinkholes (49.44.79.236 / dead IPv6) which drop packets
const TMDB_IPS = [
  "13.224.245.92",
  "13.224.245.44",
  "99.84.152.32",
  "99.84.152.8",
  "13.224.245.63",
  "13.224.245.47",
];

let ipIdx = 0;
let cachedIps = [...TMDB_IPS];

// Asynchronously refresh IPs via Google DNS-over-HTTPS
const refreshTmdbIps = () => {
  const req = https.get(
    "https://dns.google/resolve?name=api.themoviedb.org&type=A",
    { timeout: 4000 },
    (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const ips = (json.Answer || [])
            .filter((a) => a.type === 1)
            .map((a) => a.data);
          if (ips.length > 0) {
            cachedIps = ips;
          }
        } catch (_) {}
      });
    }
  );
  req.on("error", () => {});
  req.on("timeout", () => req.destroy());
};

refreshTmdbIps();
// Periodically refresh every 15 minutes
setInterval(refreshTmdbIps, 15 * 60 * 1000).unref();

const getNextIp = () => {
  const ips = cachedIps.length > 0 ? cachedIps : TMDB_IPS;
  const ip = ips[ipIdx % ips.length];
  ipIdx = (ipIdx + 1) % ips.length;
  return ip;
};

// Custom lookup function compatible with Node's https.Agent
const customLookup = (hostname, options, callback) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }

  if (hostname === "api.themoviedb.org") {
    const ips = cachedIps.length > 0 ? cachedIps : TMDB_IPS;
    if (options && options.all) {
      return callback(
        null,
        ips.map((ip) => ({ address: ip, family: 4 }))
      );
    }
    return callback(null, getNextIp(), 4);
  }

  return dns.lookup(hostname, options, callback);
};

const agent = new https.Agent({
  keepAlive: false,
  lookup: customLookup,
  timeout: 10000,
});

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 12000,
  httpsAgent: agent,
  headers: {
    "User-Agent": "Eventify-App/1.0",
    Accept: "application/json",
  },
});

// Automatically inject API key on every request
tmdbClient.interceptors.request.use((config) => {
  config.params = {
    api_key: process.env.TMDB_API_KEY,
    ...config.params,
  };
  return config;
});

// Automatic retry on transient network resets/timeouts
tmdbClient.interceptors.response.use(undefined, async (err) => {
  const config = err.config;
  if (!config || (config.__retryCount || 0) >= 2) {
    return Promise.reject(err);
  }
  if (
    ["ECONNRESET", "ETIMEDOUT", "ECONNABORTED"].includes(err.code) ||
    !err.response
  ) {
    config.__retryCount = (config.__retryCount || 0) + 1;
    return tmdbClient(config);
  }
  return Promise.reject(err);
});

module.exports = tmdbClient;