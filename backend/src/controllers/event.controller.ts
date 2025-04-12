import { Request, Response } from "express";
import Event from "../models/event.model"; // Import the Mongoose model
import { IEvent } from "../types";

// Get all events
export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const events: IEvent[] = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// Get a single event by ID
export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event: IEvent | null = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
};

// Create a new event
export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Basic validation example (consider using a validation library like Joi or Zod)
    const { title, date, description } = req.body;
    if (!title || !date) {
      res
        .status(400)
        .json({ message: "Missing required fields: title and date" });
      return;
    }

    const newEvent = new Event({
      title,
      date,
      description,
    });
    const savedEvent: IEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    // Handle potential validation errors from Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation Error", errors: (error as any).errors });
    } else {
      res.status(500).json({ message: "Error creating event", error });
    }
  }
};

// Update an event by ID
export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedEvent: IEvent | null = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );
    if (!updatedEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    // Handle potential validation errors from Mongoose
    if (error instanceof Error && error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation Error", errors: (error as any).errors });
    } else {
      res.status(500).json({ message: "Error updating event", error });
    }
  }
};

// Delete an event by ID
export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedEvent: IEvent | null = await Event.findByIdAndDelete(
      req.params.id
    );
    if (!deletedEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    // Send No Content status or a confirmation message
    res.status(204).send();
    // Or: res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};
