// require("dotenv").config({ path: __dirname + "/.env" });
require("dotenv").config();
const express = require('express');
const cookieParser = require("cookie-parser");

require("./cron/bookingExpiry");
const { Server } = require("socket.io");

const db = require("./config/db");

const app = express();



db.connect();

const cors = require("cors");


app.use(
  cors({
    origin: "http://localhost:5173", // ✅ your frontend
    credentials: true,               // ✅ must match frontend
  })
);


console.log("ENV CHECK:", process.env.RAZORPAY_KEY);


const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, ()=>{
    console.log(`Server running or ${PORT}`);
});



const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinShow", (showId) => {
    socket.join(showId);
    console.log(`Socket ${socket.id} joined show ${showId}`);
  });

  socket.on("leaveShow", (showId) => {
    socket.leave(showId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});






app.use(express.json());

app.get("/",(req,res) =>{
    res.send("server is running ");
cd 
})


app.use(cookieParser());



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
const eventRoutes = require("./routes/eventRoutes")
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/city", cityRoutes);
app.use("/api/v1/venue", venueRoutes);
app.use("/api/v1/screen", screenRoutes);
app.use("/api/v1/content",contentRoutes);
app.use("/api/v1/shows", showRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/ticket", ticketRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1", homeRoutes);
app.use("/api/v1/events", eventRoutes);



// app.listen(PORT,() =>{
//     console.log(`serevr is runnning on ${PORT}`)
// })






