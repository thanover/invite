import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

// Define the structure of the event prop
interface Event {
  _id: string;
  title: string;
  date: string; // Assuming date is a string initially
  description?: string;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Card Styling
  const cardStyle: React.CSSProperties = {
    backgroundColor: "#f8f9fa", // Light background for contrast against dark page
    color: "#333", // Dark text color for readability
    border: "1px solid #dee2e6", // Subtle border
    borderRadius: "8px", // Rounded corners
    padding: "1.5rem", // Internal spacing
    marginBottom: "1rem", // Space below the card
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow
    transition: "transform 0.2s ease-in-out", // Add transition for hover effect
    textDecoration: "none", // Remove underline from Link
    display: "block", // Make the Link behave like a block element
  };

  // Optional: Add hover effect styles (can be done with state or CSS classes too)
  // For simplicity, we'll rely on the transition and maybe a slight transform in CSS if preferred.
  // Or add state like in the button example if complex hover styles are needed.

  // Format the date for better readability
  const formattedDate = new Date(event.date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    // Wrap the card content in a Link to make the whole card clickable
    <Link to={`/event/${event._id}`} style={cardStyle}>
      <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#007bff" }}>
        {event.title}
      </h3>
      <p style={{ marginBottom: "0.5rem" }}>
        <strong>Date:</strong> {formattedDate}
      </p>
      {event.description && (
        <p style={{ marginBottom: 0, fontSize: "0.9rem", color: "#6c757d" }}>
          {/* Truncate long descriptions if necessary */}
          {event.description.length > 100
            ? `${event.description.substring(0, 100)}...`
            : event.description}
        </p>
      )}
    </Link>
  );
};

export default EventCard;
