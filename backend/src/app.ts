import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import invitesRoutes from "./routes/invites.routes"; // Assuming you have this router
import seriesRoutes from "./routes/series.routes"; // Assuming you have this router
import userRoutes from "./routes/users.routes"; // Assuming you have this router
import { clerkMiddleware } from "@clerk/express";
import { syncUserWithDb } from "./middleware/syncUser.middleware"; // Import the new middleware

const app = express();
const port = process.env.PORT || 6600;
const databaseUrl = process.env.MONGODB_URI;

// Middleware
// CORS should usually come before auth/sync if requests need pre-flight checks
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:6680",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json()); // To parse JSON request bodies
app.use(clerkMiddleware()); // Clerk auth middleware runs first
app.use(syncUserWithDb); // Sync user immediately after Clerk authentication

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

// Routes - These will now run *after* clerkMiddleware and syncUserWithDb
app.use("/api/invites", invitesRoutes); // Mount invite routes
app.use("/api/series", seriesRoutes); // Mount series routes
app.use("/api/users", userRoutes); // Mount user routes

// Basic route
app.get("/", (req, res) => {
  // req.auth should be populated here if authenticated
  res.send("API is running");
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app; // Optional: export for testing
