import { Request, Response } from "express";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation
import { Series } from "../models/series.model"; // Import the Mongoose model
import User from "../models/users.model"; // Import the User model
import { ISeries } from "../types";
import { getAuth } from "@clerk/express"; // Removed clerkClient import as we use local DB

// Get all series that the user is a member of
export const getAllSeriesByMember = async (
  req: Request, // Use extended Request type
  res: Response
): Promise<void> => {
  try {
    // Get Clerk ID from authenticated request
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Find the local user by Clerk ID
    const localUser = await User.findOne({ clerkId: clerkId });
    if (!localUser) {
      // This shouldn't happen if syncUserWithDb middleware is working
      res.status(404).json({ message: "Local user record not found" });
      return;
    }

    // Find series where the local user's ObjectId is in the members array
    // Populate owner and members fields
    const seriesList: ISeries[] = await Series.find({ members: localUser._id })
      .populate("owner") // Populate owner
      .populate("members") // Populate members
      .populate("invites"); // Populate invites if needed

    res.status(200).json(seriesList);
  } catch (error) {
    console.error("Error fetching series by member:", error);
    res.status(500).json({
      message: "Error fetching series",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Get a single series by ID
export const getSeriesById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const seriesId = req.params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(seriesId)) {
      res.status(400).json({ message: "Invalid Series ID format" });
    }

    // Find by ID and populate owner/members
    const series: ISeries | null = await Series.findById(seriesId)
      .populate("owner")
      .populate("members");

    if (!series) {
      res.status(404).json({ message: "Series not found" });
      return;
    }
    res.status(200).json(series);
  } catch (error) {
    console.error("Error fetching series by ID:", error);
    res.status(500).json({
      message: "Error fetching series",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// Create a new series
export const createSeries = async (
  req: Request, // Use extended Request type
  res: Response
): Promise<void> => {
  try {
    // Get Clerk ID from authenticated request
    const clerkId = req.auth?.userId;
    if (!clerkId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Find the corresponding local user using Clerk ID
    const localUser = await User.findOne({ clerkId: clerkId });
    if (!localUser) {
      // Should be handled by sync middleware, but good to check
      res.status(404).json({
        message: "Local user record not found. Cannot create series.",
      });
      return;
    }

    // Create the new series using the local user's ObjectId
    const newSeriesData = {
      ...req.body, // Spread other data from request body (like title, description)
      owner: localUser._id, // Use the local user's ObjectId
      members: [localUser._id], // Add the owner as the initial member using ObjectId
    };

    // Validate required fields manually if needed before creating
    if (!newSeriesData.title) {
      res.status(400).json({ message: "Series title is required" });
    }

    const newSeries: ISeries = new Series(newSeriesData);
    const savedSeries: ISeries = await newSeries.save();

    // Optionally populate before sending response
    const populatedSeries = await Series.findById(savedSeries._id)
      .populate("owner")
      .populate("members");

    res.status(201).json(populatedSeries);
  } catch (error) {
    console.error("Error creating series:", error);
    // Handle potential validation errors from Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(400)
        .json({ message: "Validation Error", errors: (error as any).errors });
    } else {
      res.status(500).json({
        message: "Error creating Series",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
};

//Update a series by ID
export const updateSeries = async (
  req: Request, // Keep as Request unless auth needed for update logic itself
  res: Response
): Promise<void> => {
  try {
    const seriesId = req.params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(seriesId)) {
      res.status(400).json({ message: "Invalid Series ID format" });
    }

    // TODO: Add authorization check - does the current user own this series?
    // const clerkId = req.auth?.userId; // Get current user
    // const seriesToUpdate = await Series.findById(seriesId);
    // if (!seriesToUpdate) return res.status(404)...
    // const owner = await User.findById(seriesToUpdate.owner);
    // if (owner?.clerkId !== clerkId) return res.status(403)...

    // Prevent owner field from being updated directly via req.body
    const updateData = { ...req.body };
    delete updateData.owner;
    // Handle members update carefully - consider separate endpoints for adding/removing members

    const updatedSeries: ISeries | null = await Series.findByIdAndUpdate(
      seriesId,
      { $set: updateData }, // Use $set for safer updates
      { new: true, runValidators: true } // Return the updated document and run validators
    )
      .populate("owner")
      .populate("members");

    if (!updatedSeries) {
      res.status(404).json({ message: "Series not found" });
      return;
    }
    res.status(200).json(updatedSeries);
  } catch (error) {
    console.error("Error updating series:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      res
        .status(400)
        .json({ message: "Validation Error", errors: (error as any).errors });
    } else {
      res.status(500).json({
        message: "Error updating Series",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
};

// Delete an series by ID
export const deleteSeries = async (
  req: Request, // Keep as Request unless auth needed for delete logic itself
  res: Response
): Promise<void> => {
  try {
    const seriesId = req.params.id;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(seriesId)) {
      res.status(400).json({ message: "Invalid Series ID format" });
    }

    // TODO: Add authorization check - does the current user own this series?

    const deletedSeries: ISeries | null = await Series.findByIdAndDelete(
      seriesId
    );
    if (!deletedSeries) {
      res.status(404).json({ message: "Series not found" });
      return;
    }
    // Also consider deleting associated invites here or handle via middleware/model hooks
    res.status(200).json({ message: "Series deleted successfully" });
  } catch (error) {
    console.error("Error deleting series:", error);
    res.status(500).json({
      message: "Error deleting Series",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
