import { Document } from "mongoose";

export interface Event {
  id: number;
  title: string;
  date: Date;
  description: string;
}

export interface EventInput {
  title: string;
  date: Date;
  description: string;
}

export interface IEvent extends Document {
  title: string;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Add other shared types here...
