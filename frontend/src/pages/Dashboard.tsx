import { useState, useEffect } from "react";
import { useUserInfo } from "../util/useUserInfo";
import apiClient from "../api/api"; // Import the apiClient instance
import { InviteType } from "../types/invite";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import InviteList from "../components/inviteList/InviteList";

// Define an interface for the Invite data

export function Dashboard() {
  const { isAdmin, userId } = useUserInfo();
  const [invites, setInvites] = useState<InviteType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const token = await getToken();
        setLoading(true);
        setError(null);
        // Use apiClient.get to fetch invites from the '/invites' endpoint
        const fetchedInvites = await apiClient.get<InviteType[]>(
          "invites",
          token!
        );
        setInvites(fetchedInvites); // apiClient.get returns the data directly
      } catch (err) {
        console.error("Error fetching invites:", err);
        // Check if err is an instance of Error before accessing message
        const message =
          err instanceof Error ? err.message : "Failed to load invites.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();
  }, []); // Empty dependency array means this runs once on mount

  console.log(isAdmin);

  if (loading) {
    return <div>Loading invites...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <SignedIn>
        <div>
          <h1>Dashboard</h1>
          <p>Is Admin: {isAdmin ? "Yes" : "No"}</p>
          <p>User Id: {userId}</p>
          <h2>Invites</h2>
          {invites.length === 0 ? (
            <p>No invites found.</p>
          ) : (
            <div className="p-2">
              <InviteList invites={invites} />
            </div>
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" />
      </SignedOut>
    </>
  );
}
