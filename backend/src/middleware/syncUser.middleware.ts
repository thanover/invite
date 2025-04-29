import { Request, Response, NextFunction } from "express";
import User from "../models/users.model"; // Adjust path if needed
import { clerkClient } from "@clerk/express"; // Use Clerk Node SDK

export const syncUserWithDb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ensure user is authenticated by Clerk middleware
  if (!req.auth?.userId) {
    // This middleware should run after clerkMiddleware, so userId should exist.
    // If not, it indicates an issue or unauthenticated request.
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated by Clerk." });
  }

  const clerkId = req.auth.userId;

  try {
    // Check if user exists in local DB using Clerk ID
    let user = await User.findOne({ clerkId: clerkId });

    // If user does not exist locally, create them
    if (!user) {
      console.log(
        `User with Clerk ID ${clerkId} not found locally. Fetching from Clerk and creating...`
      );

      // Fetch full user details from Clerk API using the SDK
      const clerkUser = await clerkClient.users.getUser(clerkId);

      if (!clerkUser) {
        console.error(`Could not fetch details for Clerk user ${clerkId}`);
        // Decide how to handle - maybe let request proceed or return error
        return res
          .status(404)
          .json({ message: `User details not found for Clerk ID ${clerkId}` });
      }

      // Extract primary email address
      const email = clerkUser.emailAddresses.find(
        (e) => e.id === clerkUser.primaryEmailAddressId
      )?.emailAddress;

      // Construct name (handle cases where parts might be null)
      const name =
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        clerkUser.username ||
        "Unnamed User";

      // Ensure email exists (required by our local model)
      if (!email) {
        console.error(
          `Clerk user ${clerkId} does not have a primary email address.`
        );
        // You might allow users without emails depending on your app logic
        return res.status(400).json({
          message: `User ${clerkId} must have a verified primary email address.`,
        });
      }

      // Create new user in local DB
      user = new User({
        clerkId: clerkId,
        email: email,
        name: name,
        // Set any other default fields required by your User model
      });
      await user.save();
      console.log(
        `User ${user.email} (Clerk ID: ${clerkId}) created locally with DB ID ${user._id}`
      );
    }

    // Optional: Attach local user info to request if needed downstream
    // (req as any).localUser = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error syncing user with DB:", error);
    // Pass error to the Express default error handler
    next(error);
  }
};
