const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.use(express.json());


app.use(morgan("dev"));



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Rayeva AI Backend Running"
  });
});

app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/proposal", require("./routes/proposalRoutes"));



app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});



app.use((err, req, res, next) => {

  console.error("🔥 Global Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message
  });
});

module.exports = app;