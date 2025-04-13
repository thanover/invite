import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import apiClient from "../api/api"; // Import your API client

// Define an interface for the structure of a single event
interface Event {
  _id: string;
  title: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Add other fields as needed
}

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the event ID from the URL parameter
  const navigate = useNavigate(); // Hook for navigation
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // State for delete operation

  useEffect(() => {
    if (!id) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Ensure id is passed correctly to apiClient.get
        const data = await apiClient.get<Event>(`events`, id);
        console.log("Fetched Event Data:", data); // Log fetched data
        if (data) {
          setEvent(data);
        } else {
          setError("Event not found."); // Handle case where data is null/undefined
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to fetch event details: ${err.message}`);
        } else {
          setError("An unknown error occurred while fetching event details.");
        }
        console.error("Fetch event error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]); // Re-run effect if the ID changes

  const handleDelete = async () => {
    if (!id) {
      setError("Cannot delete: Event ID is missing.");
      return;
    }

    // Confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the event "${event?.title}"? This action cannot be undone.`
    );

    if (confirmDelete) {
      setIsDeleting(true);
      setError(null); // Clear previous errors
      try {
        await apiClient.delete("events", id);
        // On successful deletion, navigate back to the event list page
        navigate("/event"); // Adjust the path if your list page is different
      } catch (err) {
        if (err instanceof Error) {
          setError(`Failed to delete event: ${err.message}`);
        } else {
          setError("An unknown error occurred while deleting the event.");
        }
        console.error("Delete event error:", err);
        setIsDeleting(false); // Reset deleting state on error
      }
      // No finally block needed here as navigation happens on success
    }
  };

  if (loading) {
    return <div>Loading event details...</div>;
  }

  // Display fetch error first if it occurred
  if (error && !event) {
    // Show fetch error only if event couldn't be loaded
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!event) {
    // This handles the case where loading finished but event is still null (e.g., not found)
    return <div>Event not found.</div>;
  }

  // Basic button styling
  const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: "#dc3545", // Red color for delete
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "1.5rem",
    opacity: isDeleting ? 0.6 : 1, // Dim button when deleting
  };

  return (
    <div>
      <h1>Event Details</h1>
      <h2>{event.title}</h2>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      {event.description && (
        <p>
          <strong>Description:</strong> {event.description}
        </p>
      )}
      <p>
        <em>ID: {event._id}</em>
      </p>

      {/* Display deletion error if it occurs */}
      {error && (
        <div style={{ color: "red", marginTop: "1rem" }}>Error: {error}</div>
      )}

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        style={deleteButtonStyle}
      >
        {isDeleting ? "Deleting..." : "Delete Event"}
      </button>

      {/* Add more event details as needed */}
    </div>
  );
};

export default EventDetailPage;
