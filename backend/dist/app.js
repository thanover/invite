"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const event_routes_1 = __importDefault(require("./routes/event.routes")); // Assuming you have this router
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL;
// Middleware
app.use(express_1.default.json()); // To parse JSON request bodies
// CORS setup to allow requests from the frontend
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Connect to MongoDB
if (!databaseUrl) {
    console.error("Error: DATABASE_URL environment variable is not set.");
    process.exit(1); // Exit if the database URL is not provided
}
mongoose_1.default
    .connect(databaseUrl)
    .then(() => console.log("MongoDB connected successfully."))
    .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit on connection failure
});
// Routes
app.use("/api/events", event_routes_1.default); // Mount event routes
// Basic route
app.get("/", (req, res) => {
    res.send("API is running");
});
// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
exports.default = app; // Optional: export for testing
