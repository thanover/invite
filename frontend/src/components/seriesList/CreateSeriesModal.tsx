import React, { useState, useEffect } from "react";
import apiClient from "../../api/api"; // Adjust path as needed
import { useAuth } from "@clerk/clerk-react"; // Import useAuth to get token

interface CreateSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSeriesCreated: () => void; // Callback to refresh the list or perform other actions
}

// Basic interface for the data needed to create a series
interface NewSeriesData {
  title: string;
  description?: string;
}

const CreateSeriesModal: React.FC<CreateSeriesModalProps> = ({
  isOpen,
  onClose,
  onSeriesCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth(); // Get the getToken function from Clerk

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setError(null);
    setIsSaving(false);
  };

  // Reset form when modal is opened/closed externally
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    // Don't reset form here, useEffect handles it based on isOpen prop
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      setIsSaving(false);
      return;
    }

    const token = await getToken(); // Get the auth token
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setIsSaving(false);
      return;
    }

    const newSeriesData: NewSeriesData = {
      title: title.trim(),
      description: description.trim() || undefined, // Send undefined if empty
    };

    try {
      // Call the API client's post method
      await apiClient.post("series", token, newSeriesData);
      onSeriesCreated(); // Notify parent component
      handleClose(); // Close modal on success
    } catch (err) {
      console.error("Failed to create series:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSaving(false); // Ensure saving state is reset
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
    backgroundColor: "#3a3f47", // Darker background for modal body
    color: "white", // White text for contrast
    padding: "2rem",
    zIndex: 1000,
    border: "1px solid #555", // Slightly lighter border
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
    minWidth: "350px",
    maxWidth: "500px",
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay
    zIndex: 999,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    backgroundColor: "#282c34", // Match page background
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
    boxSizing: "border-box", // Include padding and border in element's total width and height
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "var(--color-blue, #007bff)", // Use CSS variable or fallback
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };

  const cancelButtonSyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#6c757d", // Grey for cancel
  };

  return (
    <>
      <div style={overlayStyle} onClick={handleClose} />
      <div style={modalStyle}>
        <h2
          style={{ marginTop: 0, marginBottom: "1.5rem", textAlign: "center" }}
        >
          Create New Series
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="series-title" style={labelStyle}>
              Title:
            </label>
            <input
              type="text"
              id="series-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={inputStyle}
              placeholder="Enter series title"
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="series-description" style={labelStyle}>
              Description (Optional):
            </label>
            <textarea
              id="series-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={inputStyle}
              placeholder="Enter a short description"
            />
          </div>
          {error && (
            <p
              style={{
                color: "#dc3545",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              Error: {error}
            </p>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              style={cancelButtonSyle}
            >
              Cancel
            </button>
            <button type="submit" disabled={isSaving} style={buttonStyle}>
              {isSaving ? "Saving..." : "Create Series"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateSeriesModal;
