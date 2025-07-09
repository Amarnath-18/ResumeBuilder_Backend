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
  "https://resume-builder-frontend-git-main-amarnaths-projects-7f27c4db.vercel.app",
 " https://resume-builder-frontend-seven-neon.vercel.app/",
  process.env.CLIENT_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization" , "Access-Control-Allow-Origin"],
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
