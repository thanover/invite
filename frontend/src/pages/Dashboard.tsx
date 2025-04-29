import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import SeriesList from "../components/seriesList/SeriesList";

// Define an interface for the Invite data

export function Dashboard() {
  return (
    <>
      <SignedIn>
        <div>
          <SeriesList />
        </div>
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" />
      </SignedOut>
    </>
  );
}
