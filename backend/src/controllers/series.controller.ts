import { Request, Response } from "express";
import { Series } from "../models/series.model"; // Import the Mongoose model
import { ISeries } from "../types";
import { getAuth, clerkClient } from "@clerk/express";

// Get all series that the user is a member of
export const getAllSeriesByMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const member = req.body.member; // Assuming the member ID is sent in the request body
    if (!member) {
      res.status(400).json({ message: "Member ID is required" });
      return;
    }
    const series: ISeries[] = await Series.find({ members: member });
    res.status(200).json(series);
  } catch (error) {
    res.status(500).json({ message: "Error fetching series", error });
  }
};

// Get a single series by ID
export const getSeriesById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const series: ISeries | null = await Series.findById(req.params.id);
    if (!series) {
      res.status(404).json({ message: "Series not found" });
      return;
    }
    res.status(200).json(series);
  } catch (error) {
    res.status(500).json({ message: "Error fetching series", error });
  }
};

// Create a new series
export const createSeries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw Error("User not authenticated");
    const user = await clerkClient.users.getUser(userId);
    const userEmail = user.emailAddresses[0].emailAddress;
    const newSeries: ISeries = new Series({
      ...req.body,
      owner: userEmail,
      members: [userEmail],
    });
    const savedSeries: ISeries = await newSeries.save();
    res.status(201).json(savedSeries);
  } catch (error) {
    // Handle potential validation errors from Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation Error", errors: (error as any).errors });
    } else {
      res.status(500).json({ message: "Error creating Series", error });
    }
  }
};
//Update a series by ID
export const updateSeries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedSeries: ISeries | null = await Series.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedSeries) {
      res.status(404).json({ message: "Series not found" });
      return;
    }
    res.status(200).json(updatedSeries);
  } catch (error) {
    res.status(500).json({ message: "Error updating Series", error });
  }
};

// Delete an series by ID
export const deleteSeries = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedSeries: ISeries | null = await Series.findByIdAndDelete(
      req.params.id
    );
    if (!deletedSeries) {
      res.status(404).json({ message: "Series not found" });
      return;
    }
    res.status(200).json({ message: "Series deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Series", error });
  }
};
