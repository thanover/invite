import express from "express";
// Import updateUser along with existing functions
import {
  getUser,
  createUser,
  updateUser,
} from "../controllers/users.controller"; // Adjust path as needed
// Optional: Add middleware for authentication/authorization if needed
// import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// --- Define User Routes ---

// GET /api/users/:id - Get a specific user by ID
// Example: /api/users/60d0fe4f5311236168a109ca
// Add authentication middleware if only logged-in users can view profiles
router.get("/:id", /* authenticateToken, */ getUser);

// POST /api/users - Create a new user
// Request body should contain user data (e.g., name)
router.post("/", createUser);

// PUT /api/users/:id - Update a specific user by ID
// Request body should contain fields to update (e.g., name)
// Add authentication/authorization middleware as needed
router.put("/:id", /* authenticateToken, */ updateUser);

export default router;
