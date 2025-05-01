import React, { useState, useMemo } from "react";
import { SeriesType } from "../../types/series";
import InviteList from "../inviteList/InviteList";
import ApiClient from "../../api/api";
import { useAuth } from "@clerk/clerk-react";
import { InviteType } from "../../types/invite";

export type SeriesListItemProps = {
  series: SeriesType;
  // This callback should be implemented in the parent component (e.g., SeriesList)
  // to trigger a refetch of the series data when an invite is created.
  onInviteCreated?: (newInvite: InviteType) => void;
};

const SeriesListItem: React.FC<SeriesListItemProps> = ({
  series,
  onInviteCreated, // This prop is crucial for triggering the refresh in the parent
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>("");
  const [inviteDate, setInviteDate] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();

  const apiClient = useMemo(() => {
    if (!getToken) {
      console.warn(
        "Clerk getToken function not yet available in SeriesListItem."
      );
      return null;
    }
    return new ApiClient(getToken);
  }, [getToken]);

  const ExpandButton = () => {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transform transition-transform duration-300 ${
          isOpen ? "rotate-90" : ""
        } p-2`}
      >
        <span className="">{">"}</span>
      </button>
    );
  };

  const resetModalState = () => {
    setInviteName("");
    setInviteDate("");
    setError(null);
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!apiClient) {
      setError("API client not ready.");
      alert("API client not ready. Please try again shortly.");
      return;
    }

    if (!inviteName.trim()) {
      setError("Invite name cannot be empty.");
      return;
    }

    if (!inviteDate) {
      setError("Invite date cannot be empty.");
      return;
    }

    setIsCreating(true);

    const inviteData = {
      title: inviteName.trim(),
      date: inviteDate,
      seriesId: series._id,
    };

    try {
      const newInvite = await apiClient.post<InviteType, typeof inviteData>(
        "invites",
        inviteData
      );
      console.log("New invite created:", newInvite);

      // *** Call the callback passed from the parent ***
      // This is where the parent component will be notified.
      // The parent component's implementation of this function
      // should trigger the data refresh (e.g., refetch the series list).
      if (onInviteCreated) {
        onInviteCreated(newInvite);
      }

      resetModalState();
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create invite:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="border-b border-[#7AA2F7] flex flex-col">
      {/* Top part displaying series info */}
      <div className="flex flex-row items-center justify-center">
        <div className="w-4 flex items-center justify-center">
          {/* Conditionally render expand button based on invites */}
          {series.invites && series.invites.length > 0 && <ExpandButton />}
        </div>
        <div className="p-6 flex flex-col">
          <div>{series.title}</div>
          <div className="text-[var(--color-turquoise)] text-xs">
            {series.description}
          </div>
        </div>
        <div className="ml-auto flex items-center justify-center p-4">
          {/* Display invite count */}
          {series.invites?.length === 0
            ? "no"
            : series.invites?.length ?? 0}{" "}
          invites
        </div>
      </div>

      {/* Collapsible section for invites */}
      {isOpen && (
        <div>
          <div>
            {/* Render InviteList - ensure it receives updated invites if parent refreshes */}
            <InviteList invites={series.invites || []} />
            <button
              onClick={() => {
                resetModalState();
                setShowModal(true);
              }}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={!apiClient}
            >
              Create Invite
            </button>

            {/* Create Invite Modal */}
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-lg w-96 text-black">
                  <h2 className="text-lg font-bold mb-4">Create New Invite</h2>
                  <form onSubmit={handleCreateInvite}>
                    {/* Invite Name Input */}
                    <div className="mb-4">
                      <label
                        htmlFor={`inviteName-${series._id}`}
                        className="block text-sm font-medium mb-2"
                      >
                        Invite Name
                      </label>
                      <input
                        id={`inviteName-${series._id}`}
                        type="text"
                        value={inviteName}
                        onChange={(e) => setInviteName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                        required
                        disabled={isCreating}
                      />
                    </div>

                    {/* Invite Date Input */}
                    <div className="mb-4">
                      <label
                        htmlFor={`inviteDate-${series._id}`}
                        className="block text-sm font-medium mb-2"
                      >
                        Invite Date
                      </label>
                      <input
                        id={`inviteDate-${series._id}`}
                        type="date"
                        value={inviteDate}
                        onChange={(e) => setInviteDate(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-black"
                        required
                        disabled={isCreating}
                      />
                    </div>

                    {/* Error Display */}
                    {error && (
                      <p className="text-red-500 text-sm mb-3">{error}</p>
                    )}

                    {/* Modal Buttons */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="mr-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 disabled:opacity-50"
                        disabled={isCreating}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                        disabled={isCreating || !apiClient}
                      >
                        {isCreating ? "Creating..." : "Create"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesListItem;
