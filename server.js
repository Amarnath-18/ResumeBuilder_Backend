import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRouter from './src/routes/authRoutes.js'
import resumeRouter from './src/routes/resumeRoutes.js'
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Enhanced CORS configuration for production
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:3000", // Alternative local port
  "https://resume-builder-frontend-git-main-amarnaths-projects-7f27c4db.vercel.app", // Production frontend URL (no trailing slash)
  process.env.CLIENT_URL, // Production frontend URL from env
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie']
}));

// Handle preflight requests
app.options('*', cors());

app.get("/api", (req, res) => {
  res.json({ message: "Resume Builder API is running!" });
});

app.use("/api/auth" ,authRouter );
app.use("/api/resume" , resumeRouter);

// Connect to Database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});