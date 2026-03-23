require("dotenv").config({ path: __dirname + "/.env" });

const express = require('express');

require("./cron/bookingExpiry");
const { Server } = require("socket.io");

const db = require("./config/db");

const app = express();

db.connect();

console.log("ENV CHECK:", process.env.RAZORPAY_KEY);


const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, ()=>{
    console.log(`Server running or ${PORT}`);
});


const io = new Server(server, {
    cors:{
        origin: "*"
    }
});

global.io = io;

io.on("connection",(socket) => {

    console.log("User Connected");

    socket.on("joinShow", (showId) => {
        socket.join(showId);
    })
})


// ⭐ Razorpay webhook must use RAW body
app.use(
  "/api/v1/payment/razorpay-webhook",
  express.raw({ type: "application/json" })
);

app.use(express.json());

app.get("/",(req,res) =>{
    res.send("server is running ");

})

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



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/city", cityRoutes);
app.use("/api/v1/venue", venueRoutes);
app.use("/api/v1/screen", screenRoutes);
app.use("/api/v1/content",contentRoutes);
app.use("/api/v1/show", showRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/ticket", ticketRoutes);
app.use("/api/v1/payment", paymentRoutes);





// app.listen(PORT,() =>{
//     console.log(`serevr is runnning on ${PORT}`)
// })






