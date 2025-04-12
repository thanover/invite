import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import eventRoutes from "./routes/event.routes"; // Assuming you have this router

const app = express();
const port = process.env.PORT || 6600;
const databaseUrl = process.env.MONGODB_URI;

// Middleware
app.use(express.json()); // To parse JSON request bodies

// CORS setup to allow requests from the frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:6680",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Connect to MongoDB
if (!databaseUrl) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1); // Exit if the database URL is not provided
}

mongoose
  .connect(databaseUrl)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit on connection failure
  });

// Routes
app.use("/api/events", eventRoutes); // Mount event routes

// Basic route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app; // Optional: export for testing
