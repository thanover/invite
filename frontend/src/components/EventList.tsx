import React, { useState, useEffect } from "react";
import apiClient from "../api/api"; // Import the apiClient instance

// Define an interface for the structure of an event object
interface Event {
  _id: string; // Assuming MongoDB ObjectId as string
  title: string;
  date: string; // Dates are often strings in JSON responses
  description?: string; // Optional description
  createdAt: string;
  updatedAt: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use the apiClient to fetch events
        const data = await apiClient.get<Event[]>("events");
        setEvents(data);
      } catch (err) {
        // apiClient already logs the detailed error, set a user-friendly message
        if (err instanceof Error) {
          setError(`Failed to fetch events: ${err.message}`);
        } else {
          setError("An unknown error occurred while fetching events.");
        }
        // No need to log here again, apiClient does it
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              {event.description && <p>Description: {event.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
