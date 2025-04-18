import mongoose, { Schema, Document } from "mongoose";
import { IInvite } from "../types";

// Mongoose Schema for Invite
const InviteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Invite title is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Invite date is required"],
    },
    description: {
      type: String,
      required: false, // Assuming description is optional
      trim: true,
    },
    seriesId: {
      // Add the optional series reference
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series", // Reference the 'Series' model
      required: false, // Make it optional
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the Mongoose model
// Mongoose will create a collection named 'invites' (pluralized and lowercased)
const Invite = mongoose.model<IInvite>("Invite", InviteSchema);

export default Invite;
