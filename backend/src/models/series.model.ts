import mongoose, { Schema } from "mongoose";
import { ISeries } from "../types";

// Mongoose Schema for Series
const SeriesSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Series title is required"],
      trim: true,
    },
    owner: {
      type: String,
      required: [true, "Series owner is required"],
    },
    description: {
      type: String,
      required: false, // Assuming description is optional
      trim: true,
    },
    members: {
      type: [String], // Array of strings (email addresses)
      required: false,
      default: [], // Default to an empty array
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Mongoose model
// Mongoose will create a collection named 'series' (pluralized and lowercased)
export const Series = mongoose.model<ISeries>("Series", SeriesSchema);
