import React from "react";
import apiClient from "../../api/api"; // Import the apiClient instance
import { useAuth } from "@clerk/clerk-react";

interface DeleteInviteButtonProps {
  id: string;
}

export const DeleteInviteButton: React.FC<DeleteInviteButtonProps> = ({
  id,
}) => {
  const { getToken } = useAuth();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invite?")) {
      return;
    }

    try {
      const token = await getToken();
      console.log(`Attempting to delete invite with ID: ${id}`);
      // Use the apiClient to send a DELETE request to the 'invites' resource with the specific id
      await apiClient.delete("invites", token!, id);
      console.log(`Successfully deleted invite with ID: ${id}`);
    } catch (error) {
      console.error(`Error deleting invite with ID: ${id}`, error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-[var(--color-rose)] rounded-full w-6 h-6 flex items-center justify-center text-xs text-[var(--color-night)] hover:bg-[var(--color-pink)] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
      aria-label={`Delete invite ${id}`} // Add aria-label for accessibility
      title="Delete Invite" // Add title for tooltip
    >
      -
    </button>
  );
};
