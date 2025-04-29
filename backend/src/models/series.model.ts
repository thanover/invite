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
      type: mongoose.Schema.Types.ObjectId, // Changed type to ObjectId
      ref: "User", // Reference the 'User' model
      required: [true, "Series owner is required"],
    },
    description: {
      type: String,
      required: false, // Assuming description is optional
      trim: true,
    },
    members: [
      {
        // Changed to array of ObjectIds
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference the 'User' model
        required: false,
      },
    ], // Default is implicitly an empty array
    invites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invite", // Reference the 'Invite' model
        required: false,
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Mongoose model
// Mongoose will create a collection named 'series' (pluralized and lowercased)
export const Series = mongoose.model<ISeries>("Series", SeriesSchema);
