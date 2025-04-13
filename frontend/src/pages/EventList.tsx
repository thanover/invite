import React, { useState, useCallback } from "react";
import EventList from "../components/EventList"; // Your component that displays the list
import EventFormModal from "../components/EventFormModal"; // Import the modal

const EventListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listKey, setListKey] = useState(Date.now());
  const [isHovering, setIsHovering] = useState(false); // State for hover effect

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEventCreated = useCallback(() => {
    setListKey(Date.now());
  }, []);

  // Define button styles
  const baseButtonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "white",
    backgroundColor: "#007bff", // Blue background
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease", // Smooth transition
  };

  const hoverButtonStyle: React.CSSProperties = {
    backgroundColor: "#0056b3", // Darker blue on hover
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1>My Events</h1>
        <button
          onClick={handleOpenModal}
          style={{
            ...baseButtonStyle, // Apply base styles
            ...(isHovering ? hoverButtonStyle : {}), // Apply hover styles conditionally
          }}
          onMouseEnter={() => setIsHovering(true)} // Set hover state to true
          onMouseLeave={() => setIsHovering(false)} // Set hover state to false
        >
          + Event
        </button>
      </div>

      {/* Pass the key to EventList to trigger re-fetch when it changes */}
      <EventList key={listKey} />

      <EventFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default EventListPage;
