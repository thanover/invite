import { Request, Response } from "express";
import Invite from "../models/invites.model"; // Import the Mongoose model
import { IInvite } from "../types";
import { Series } from "../models/series.model"; // Import Series model for validation
import { getAuth } from "@clerk/express";

// Get all Invites
export const getAllInvites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = getAuth(req);
    console.log("Fetching all invites");
    console.log("User:", user);
    // console.log(JSON.stringify(req));
    // Optionally populate series details if needed
    const invites: IInvite[] = await Invite.find().populate("seriesId");
    res.status(200).json(invites);
  } catch (error) {
    console.log("Error fetching invites:", error);
    res.status(500).json({ message: "Error fetching Invites", error });
  }
};

// Get a single Invite by ID
export const getInviteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Populate series details if the invite belongs to one
    const invite: IInvite | null = await Invite.findById(
      req.params.id
    ).populate("seriesId");
    if (!invite) {
      // Corrected variable name here
      res.status(404).json({ message: "Invite not found" });
      return;
    }
    res.status(200).json(invite); // Corrected variable name here
  } catch (error) {
    res.status(500).json({ message: "Error fetching Invite", error });
  }
};

// Create a new Invite
export const createInvite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Basic validation example (consider using a validation library like Joi or Zod)
    const { title, date, description, seriesId } = req.body; // Include seriesId
    if (!title || !date || !seriesId) {
      res.status(400).json({
        message: "Missing required fields: title, date and/or seriesId",
      });
      return;
    }

    // Optional: Validate if the provided seriesId actually exists
    if (seriesId) {
      const seriesExists = await Series.findById(seriesId);
      if (!seriesExists) {
        res
          .status(400)
          .json({ message: `Series with ID ${seriesId} not found.` });
        return;
      }
    }

    const newInvite = new Invite({
      title,
      date,
      description,
      seriesId, // Add seriesId here (will be undefined if not provided)
    });
    const savedInvite: IInvite = await newInvite.save();
    // Optionally populate series details in the response
    await savedInvite.populate("seriesId");
    if (savedInvite.seriesId) {
      await Series.findByIdAndUpdate(savedInvite.seriesId, {
        $push: { invites: savedInvite._id },
      });
    }
    res.status(201).json(savedInvite);
  } catch (error) {
    // Handle potential validation errors from Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation Error", errors: (error as any).errors });
    } else {
      res.status(500).json({ message: "Error creating Invite", error });
    }
  }
};

// Update an Invite by ID
export const updateInvite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { seriesId } = req.body;

    // Optional: Validate if the provided seriesId actually exists before updating
    if (seriesId !== undefined) {
      // Check if seriesId is explicitly provided for update
      if (seriesId === null) {
        // Allow unsetting the seriesId
        // No validation needed if unsetting
      } else {
        const seriesExists = await Series.findById(seriesId);
        if (!seriesExists) {
          res
            .status(400)
            .json({ message: `Series with ID ${seriesId} not found.` });
          return;
        }
      }
    }

    const updatedInvite: IInvite | null = await Invite.findByIdAndUpdate(
      req.params.id,
      req.body, // req.body will contain title, date, description, and optionally seriesId
      { new: true, runValidators: true } // Return the updated document and run schema validators
    ).populate("seriesId"); // Populate series details in the response
    if (!updatedInvite) {
      res.status(404).json({ message: "Invite not found" });
      return;
    }
    res.status(200).json(updatedInvite);
  } catch (error) {
    // Handle potential validation errors from Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation Error", errors: (error as any).errors });
    } else {
      res.status(500).json({ message: "Error updating Invite", error });
    }
  }
};

// Delete an Invite by ID
export const deleteInvite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedInvite: IInvite | null = await Invite.findByIdAndDelete(
      req.params.id
    );
    if (!deletedInvite) {
      res.status(404).json({ message: "Invite not found" });
      return;
    }
    // Send No Content status or a confirmation message
    res.status(204).send();
    // Or: res.status(200).json({ message: 'Invite deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Invite", error });
  }
};
