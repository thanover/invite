import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/users.model"; // Adjust path as needed

// --- Get User by ID ---
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Get ID from URL parameters

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Find the user by ID in the database
    const user = await User.findById(userId);

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Server error fetching user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// --- Create New User ---
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body; // Get data from request body

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" }); // 409 Conflict
    }

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      // Add any other fields required by your User model
    });

    // Save the new user to the database
    await newUser.save();

    // Return success response (consider returning only non-sensitive data)
    res.status(201).json({
      // 201 Created
      message: "User created successfully",
      userId: newUser._id, // Return the ID of the newly created user
      // Optionally return some user data: { name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle potential Mongoose validation errors specifically if needed
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    }
    res.status(500).json({
      message: "Server error creating user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// --- Update User ---
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Get ID from URL parameters
    const updateData = req.body; // Get update data from request body

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Optional: Prevent changing email to one that already exists for another user
    if (updateData.email) {
      const existingUserWithEmail = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId }, // Check for users other than the current one
      });
      if (existingUserWithEmail) {
        return res
          .status(409)
          .json({ message: "Email is already in use by another account." });
      }
    }

    // Find the user by ID and update it
    // { new: true } returns the updated document
    // { runValidators: true } ensures schema validations are run on update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData }, // Use $set to apply updates
      { new: true, runValidators: true }
    );

    // If user not found, return 404
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    // Handle potential Mongoose validation errors specifically if needed
    if (error instanceof mongoose.Error.ValidationError) {
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    }
    res.status(500).json({
      message: "Server error updating user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
