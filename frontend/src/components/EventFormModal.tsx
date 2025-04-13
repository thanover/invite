import React, { useState } from "react";
import apiClient from "../api/api"; // Adjust path as needed

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void; // Callback to refresh the list
}

// Basic interface for the data needed to create an event
interface NewEventData {
  title: string;
  date: string; // Keep as string for input type="datetime-local"
  description?: string;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setError(null);
    setIsSaving(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!title || !date) {
      setError("Title and Date are required.");
      setIsSaving(false);
      return;
    }

    const newEventData: NewEventData = {
      title,
      date, // Send date string directly, backend should parse it
      description,
    };

    try {
      await apiClient.post("events", newEventData); // Assuming 'events' is the resource path
      onEventCreated(); // Notify parent to refresh
      handleClose(); // Close modal on success
    } catch (err) {
      console.error("Failed to create event:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  // Basic Modal Styling (replace with your preferred modal library or CSS)
  const modalStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "2rem",
    zIndex: 1000,
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    minWidth: "300px",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  return (
    <>
      <div style={overlayStyle} onClick={handleClose} />
      <div style={modalStyle}>
        <h2>Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="title"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="date"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Date and Time:
            </label>
            <input
              type="datetime-local" // Use datetime-local for date and time input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="description"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Description (Optional):
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button type="button" onClick={handleClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EventFormModal;
