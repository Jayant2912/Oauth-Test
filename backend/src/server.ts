import express from "express";
import session from "express-session";
import authRoutes from "./routes/authRoutes";
import { connectDB } from "./database/mongoConnection";
import dotenv from "dotenv";
import open from "open";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Missing CLIENT_ID or CLIENT_SECRET environment variable.");
}

// Set up session middleware
app.use(
  session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
connectDB();

// Routes
app.use(authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
