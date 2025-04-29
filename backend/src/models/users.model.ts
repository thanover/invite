import mongoose, { Schema, Document } from "mongoose";

// Interface defining the structure of a User document (optional but good practice)
export interface IUser extends Document {
  clerkId: string; // Added Clerk ID field
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  // Add any other fields your user might have (e.g., profile picture URL, roles, etc.)
}

// Define the Mongoose schema
const UserSchema: Schema = new Schema(
  {
    clerkId: {
      // Added Clerk ID field definition
      type: String,
      required: [true, "Clerk ID is required"],
      unique: true, // Ensure clerk IDs are unique
      index: true, // Index for faster lookups by Clerk ID
    },
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true, // Ensure email addresses are unique
      lowercase: true, // Store emails in lowercase
      trim: true,
      // Basic email format validation (consider a more robust library like 'validator' if needed)
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    // Add other fields here:
    // profileImageUrl: { type: String },
    // role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Create and export the Mongoose model
// The first argument 'User' is the singular name of the collection your model is for.
// Mongoose automatically looks for the plural, lowercased version of your model name (e.g., 'users')
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
