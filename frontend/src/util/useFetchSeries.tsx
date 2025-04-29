import { useAuth } from "@clerk/clerk-react";
import { Series } from "../types/series";
import { useEffect, useState } from "react";
import { useUserInfo } from "./useUserInfo";

export function useFetchSeries(): { series: Series[] } {
  const [token, setToken] = useState<string>("");
  const [series, setSeries] = useState<Series[]>([]);
  const { userId } = useUserInfo();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const _token = await getToken();
      setToken(_token!);
    };
    fetchToken();
  }, [getToken]);

  useEffect(() => {
    // get a series using the api
    // Ensure both token and userId are available before fetching
    if (token && userId) {
      const fetchSeries = async () => {
        try {
          // Changed method to POST and added body
          const response = await fetch("/api/series", {
            method: "GET", // Changed to POST to send a body
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Added Content-Type header
            },
          });
          const data: Series[] = await response.json();
          setSeries(data);
        } catch (error) {
          console.error("Error fetching series:", error);
          // Optionally set an error state here to display to the user
        }
      };
      fetchSeries();
    }
    // Dependency array includes userId now
  }, [token, userId]); // Removed 'series' from dependency array to prevent infinite loop

  return { series };
}
