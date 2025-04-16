import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export function Dashboard() {
  return (
    <>
      <SignedIn>
        <>Dashboard</>
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" />
      </SignedOut>
    </>
  );
}
