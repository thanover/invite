import mongoose, { Schema, Document } from "mongoose";
import { IEvent } from "../types";

// Mongoose Schema for Event
const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    description: {
      type: String,
      required: false, // Assuming description is optional
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Mongoose model
// Mongoose will create a collection named 'events' (pluralized and lowercased)
const Event = mongoose.model<IEvent>("Event", EventSchema);

export default Event;
