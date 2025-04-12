const API_URL = process.env.REACT_APP_API_URL || "http://localhost:6680";

class ApiClient {
  private baseUrl: string = `${API_URL}/api`;

  private async request<T>(resource: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}/${resource}`;
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        // Attempt to parse error details from the response body
        let errorData;
        try {
          errorData = await response.json();
        } catch (error: unknown) {
          console.error("Failed to parse error response:", error);
          // Ignore if the body isn't valid JSON
        }
        console.error("API Error Response:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData?.message || response.statusText
          }`
        );
      }

      // Handle cases like DELETE which might not return a body (status 204)
      if (response.status === 204) {
        return {} as T; // Return an empty object or handle as needed
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error("API request failed:", error);
      // Re-throw the error so calling code can handle it
      throw error;
    }
  }

  public get<T>(resource: string, id?: string | number): Promise<T> {
    const path = id ? `${resource}/${id}` : resource;
    return this.request<T>(path, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add other headers like Authorization if needed
      },
    });
  }

  public post<T, U>(resource: string, data: U): Promise<T> {
    return this.request<T>(resource, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add other headers like Authorization if needed
      },
      body: JSON.stringify(data),
    });
  }

  public put<T, U>(resource: string, id: string | number, data: U): Promise<T> {
    const path = `${resource}/${id}`;
    return this.request<T>(path, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Add other headers like Authorization if needed
      },
      body: JSON.stringify(data),
    });
  }

  public delete<T>(resource: string, id: string | number): Promise<T> {
    const path = `${resource}/${id}`;
    return this.request<T>(path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Add other headers like Authorization if needed
      },
    });
  }
}

// Export an instance for easy use throughout the application
const apiClient = new ApiClient();
export default apiClient;

// Example Usage (in a component):
/*
import apiClient from './api/api';

interface Event {
    _id: string;
    title: string;
    // ... other fields
}

async function fetchEvents() {
    try {
        const events = await apiClient.get<Event[]>('events');
        console.log(events);
    } catch (error) {
        console.error("Failed to fetch events:", error);
    }
}

async function createEvent(newEventData: Omit<Event, '_id'>) {
    try {
        const createdEvent = await apiClient.post<Event, Omit<Event, '_id'>>('events', newEventData);
        console.log('Created:', createdEvent);
    } catch (error) {
        console.error("Failed to create event:", error);
    }
}
*/
