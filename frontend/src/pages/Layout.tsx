import React from "react";
import { Outlet, Link } from "react-router-dom";

// Placeholder for user data - replace with actual auth context/state later
const currentUser = { name: "Guest User" }; // Example

const Layout: React.FC = () => {
  return (
    <div
      className="app-container"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#282c34", // Header background
          color: "white",
          borderBottom: "1px solid #444",
        }}
      >
        {/* App Name on the left */}
        <div className="app-title">
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              fontSize: "1.5rem",
            }}
          >
            Invites
          </Link>
        </div>

        {/* User Name on the right */}
        <div className="user-info">
          <span>{currentUser.name}</span>
          {/* Add Logout button or other user actions here later */}
        </div>
      </header>

      {/* Main content area where child routes will render */}
      <main
        style={{
          flexGrow: 1,
          padding: "2rem",
          backgroundColor: "#282c34", // Apply background color here
          color: "white", // Set default text color for contrast
        }}
      >
        <Outlet /> {/* Renders the matched child route component */}
      </main>

      {/* Optional Footer */}
      <footer
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#282c34", // Footer background (can be changed if desired)
          color: "white", // Footer text color
          textAlign: "center",
          borderTop: "1px solid #ddd",
        }}
      >
        <p>&copy; {new Date().getFullYear()} Tom Hanover</p>
      </footer>
    </div>
  );
};

export default Layout;
