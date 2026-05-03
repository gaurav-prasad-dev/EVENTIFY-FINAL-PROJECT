require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");

require("./cron/bookingExpiry");

const db = require("./config/db");
const redisClient = require("./config/redis");

const app = express();

// ==============================
// DB CONNECT
// ==============================
db.connect();

// ==============================
// CORS
// ==============================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

console.log("ENV CHECK:", process.env.RAZORPAY_KEY);

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// ==============================
// SOCKET SETUP
// ==============================
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

global.io = io;

// ==============================
// 🔥 HELPER: RELEASE USER SEATS
// ==============================
const releaseUserSeats = async (userId) => {
  try {
    const pattern = `user:${userId}:locks:*`;

    const keys = await redisClient.keys(pattern);

    for (const key of keys) {
      const seats = await redisClient.sMembers(key);

      const showId = key.split(":")[3];

      for (const seat of seats) {
        await redisClient.del(`show:${showId}:seat:${seat}`);
      }

      await redisClient.del(key);

      io.to(showId).emit("seat_unlocked", {
        seats,
        userId,
      });
    }
  } catch (err) {
    console.log("RELEASE ERROR:", err);
  }
};

// ==============================
// SOCKET EVENTS
// ==============================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake?.auth?.userId;

  // join show room
  socket.on("joinShow", (showId) => {
    socket.join(showId);
    console.log(`Socket joined show ${showId}`);
  });

  // leave show room
  socket.on("leaveShow", (showId) => {
    socket.leave(showId);
  });

  // disconnect cleanup
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    if (!userId) return;

    await releaseUserSeats(String(userId));
  });
});

// ==============================
// ROUTES
// ==============================
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const cityRoutes = require("./routes/city");
const venueRoutes = require("./routes/venue");
const screenRoutes = require("./routes/screen");
const contentRoutes = require("./routes/content");
const showRoutes = require("./routes/show");
const bookingRoutes = require("./routes/booking");
const ticketRoutes = require("./routes/ticketRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const movieRoutes = require("./routes/movie");
const homeRoutes = require("./routes/home");

const adminRoutes = require("./routes/admin");
const organizerRoutes = require("./routes/organizerRoutes")

app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/organizer", organizerRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/city", cityRoutes);
app.use("/api/v1/venues", venueRoutes);
app.use("/api/v1/screen", screenRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/shows", showRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/ticket", ticketRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1", homeRoutes);


// ============================== 
// HEALTH CHECK ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("server is running");
});