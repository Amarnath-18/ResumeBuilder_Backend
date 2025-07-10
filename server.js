import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRouter from './src/routes/authRoutes.js'
import resumeRouter from './src/routes/resumeRoutes.js'

dotenv.config();

const app = express();

// Connect to Database first
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Setup
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://amarnath-resume-builder.vercel.app",
  process.env.CLIENT_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"]
}));

// Routes
app.get("/api", (req, res) => {
  res.json({ message: "Resume Builder API is running!" });
});

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
