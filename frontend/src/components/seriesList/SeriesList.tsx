import { useState, useCallback, useEffect } from "react"; // Import useState and useCallback
import CreateSeriesModal from "./CreateSeriesModal"; // Import the modal component
import { useAuth } from "@clerk/clerk-react";
import { SeriesType } from "../../types/series";
import SeriesListItem from "./SeriesListItem";

const SeriesList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [series, setSeries] = useState<SeriesType[]>([]);
  const { getToken } = useAuth();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useCallback(() => {}, []);

  const fetchSeries = async () => {
    try {
      const token = await getToken();
      // Changed method to POST and added body
      const response = await fetch("/api/series", {
        method: "GET", // Changed to POST to send a body
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Added Content-Type header
        },
      });
      const data: SeriesType[] = await response.json();
      setSeries(data);
    } catch (error) {
      console.error("Error fetching series:", error);
      // Optionally set an error state here to display to the user
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  // Callback to refresh the list after creation
  const handleSeriesCreated = useCallback(() => {
    console.log("Series created, refreshing list...");
    fetchSeries();
  }, []);

  return (
    <div>
      {series && (
        <ul className="border-t border-[#7AA2F7]">
          {series.map((series) => {
            return <SeriesListItem series={series} />;
          })}
        </ul>
      )}
      {/* Use a standard button or your custom Button component */}
      <button
        onClick={handleOpenModal}
        className="bg-[var(--color-blue)] 
        hover:bg-[var(--color-turquoise)] 
        transition 
        delay-150 
        duration-300 
        ease-in-out 
        rounded-lg 
        pl-4 pr-4 p-1"
      >
        + New Series
      </button>

      {/* Render the modal */}
      <CreateSeriesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSeriesCreated={handleSeriesCreated}
      />
    </div>
  );
};

export default SeriesList;
