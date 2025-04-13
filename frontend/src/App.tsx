import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Layout from "./pages/Layout"; // Import the Layout component
import LoginPage from "./pages/Login";
import EventListPage from "./pages/EventList";
import EventDetailPage from "./pages/EventDetailsPage";

function App() {
  return (
    <Router>
      {" "}
      {/* Wrap the entire application with BrowserRouter */}
      {/* The main Routes definition */}
      <Routes>
        {/* Define the Layout route as the parent */}
        <Route path="/" element={<Layout />}>
          {/* Child routes that will render inside the Layout's <Outlet /> */}
          {/* Use 'index' for the component that matches the parent path exactly */}
          <Route index element={<LoginPage />} />
          <Route path="event" element={<EventListPage />} />
          <Route path="event/:id" element={<EventDetailPage />} />

          {/* Optional: Add a 404 Not Found route within the layout */}
          <Route
            path="*"
            element={
              <div>
                <h2>404 Not Found</h2>
                <p>The page you requested could not be found.</p>
                <Link to="/">Go Home</Link>
              </div>
            }
          />
        </Route>
        {/* You could add routes outside the Layout here if needed (e.g., a dedicated full-screen login) */}
      </Routes>
    </Router>
  );
}

export default App;
