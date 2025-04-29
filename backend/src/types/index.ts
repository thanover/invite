import mongoose, { Document } from "mongoose";
// Optional: Import Clerk types if you need the full User object elsewhere,
// but for storing the ID, string is sufficient.
// import { User } from "@clerk/clerk-sdk-node";

export interface Invite {
  id: number;
  title: string;
  date: Date;
  description: string;
}

export interface InviteInput {
  title: string;
  date: Date;
  description: string;
}

export interface IInvite extends Document {
  title: string;
  date: Date;
  description: string;
  // Add seriesId if it's part of the Mongoose document
  seriesId?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Series {
  id: number;
  title: string;
  description: string;
  owner: string; // Clerk User ID
  members: string[];
  invites: Invite[]; // List of invites associated with the series
}

export interface SeriesInput {
  title: string;
  description: string;
  owner: string; // This string represents the Clerk User ID
  members?: string[]; // Optional members on creation
}

export interface ISeries extends Document {
  title: string;
  description: string;
  owner: string; // Clerk User ID
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Add other shared types here...
