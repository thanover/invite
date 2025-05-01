import React, { useState, useEffect, useCallback, useMemo } from "react";
import CreateSeriesModal from "./CreateSeriesModal";
import SeriesListItem from "./SeriesListItem";
import { SeriesType } from "../../types/series";
import ApiClient from "../../api/api";
import { useAuth } from "@clerk/clerk-react";

const SeriesList: React.FC = () => {
  const [seriesList, setSeriesList] = useState<SeriesType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getToken } = useAuth();

  const apiClient = useMemo(() => {
    if (!getToken) return null;
    return new ApiClient(getToken);
  }, [getToken]);

  const fetchSeries = useCallback(async () => {
    if (!apiClient) return;
    setIsLoading(true);
    try {
      const data = await apiClient.get<SeriesType[]>("series");
      setSeriesList(data);
    } catch (error) {
      console.error("Failed to fetch series:", error);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  const handleInviteCreated = () => {
    console.log("Invite created in child, refreshing series list...");
    fetchSeries();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSeriesCreated = useCallback(() => {
    console.log("Series created, refreshing list...");
    fetchSeries();
  }, [fetchSeries]);

  if (isLoading) {
    return <div>Loading series...</div>;
  }

  return (
    <div>
      {seriesList && (
        <ul className="border-t border-[#7AA2F7]">
          {seriesList.map((series) => {
            return (
              <SeriesListItem
                key={series._id}
                series={series}
                onInviteCreated={handleInviteCreated}
              />
            );
          })}
        </ul>
      )}
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
      <CreateSeriesModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSeriesCreated={handleSeriesCreated}
      />
    </div>
  );
};

export default SeriesList;
