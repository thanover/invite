import { useState, useEffect, useRef } from "react";
import { useClerk, UserButton } from "@clerk/clerk-react";

export function User() {
  const { signOut } = useClerk();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null); // Ref for the main container

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev); // Toggle based on previous state
  };

  const handleLogout = () => {
    signOut();
    setIsPopupOpen(false); // Close popup after logout action
  };

  // Effect to handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the referenced element
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false); // Close the popup
      }
    };

    // Add listener only when the popup is open
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Remove listener if popup is closed (or initially)
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup function to remove the listener when the component unmounts
    // or before the effect runs again if isPopupOpen changes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]); // Dependency array includes isPopupOpen

  return (
    // Attach the ref to the main container div
    <div
      ref={popupRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <span
        onClick={togglePopup}
        style={{ cursor: "pointer" }} // Keep cursor pointer on the name
        aria-haspopup="true"
        aria-expanded={isPopupOpen}
        className="hover:underline text-2xl"
      >
        <UserButton />
      </span>
      {isPopupOpen && (
        <div
          style={{
            // --- Essential Positioning Styles ---
            position: "absolute",
            top: "100%", // Position below the name span
            marginTop: "20px",
            right: 0, // Align to the right of the container
            zIndex: 1000, // Ensure it appears above other content
            // --- Removed other styling ---
          }}
          role="menu"
        >
          <span
            className="hover:underline"
            onClick={handleLogout}
            style={{ cursor: "pointer" }} // Keep cursor pointer on logout
            role="menuitem"
          >
            Logout
          </span>
          {/* Add other menu items here if needed */}
        </div>
      )}
    </div>
  );
}
