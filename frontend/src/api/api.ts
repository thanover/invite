class ApiClient {
  // Always use the relative path '/api'.
  // This relies on the proxy configuration (Vite dev server or production server like Nginx)
  // to correctly forward requests starting with /api to the backend service.
  private baseUrl: string = "/api"; // Base URL now starts with a slash

  // Constructor is now simpler as baseUrl is fixed
  constructor() {}

  private async request<T>(resource: string, options: RequestInit): Promise<T> {
    // Construct the full URL using the absolute base path
    // Ensure resource doesn't accidentally start with a slash if baseUrl already has one
    const cleanResource = resource.startsWith("/")
      ? resource.substring(1)
      : resource;
    const url = `${this.baseUrl}/${cleanResource}`; // Use the baseUrl which starts with /

    console.log("API Request URL:", url); // Log the corrected URL
    console.log("API Request Options:", options);
    try {
      const response = await fetch(url, options);
      console.log("API Response Status:", response.status); // Log status code

      if (!response.ok) {
        // Attempt to parse error details from the response body
        let errorData;
        try {
          errorData = await response.json();
        } catch (error: unknown) {
          console.log("Error parsing JSON:", error);
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
    // console.log("API GET Path:", path); // Keep or remove logging as needed
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
