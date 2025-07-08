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
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));


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