// to ge log lived token for testing: await window.Clerk.session.getToken({ template: 'yaak_token' })

import { GetToken } from "@clerk/types"; // Import GetToken type from Clerk

class ApiClient {
  private baseUrl: string = "/api";
  private getTokenFunc: GetToken; // Store the getToken function from Clerk SDK

  // Accept getToken function in the constructor
  constructor(getTokenFunc: GetToken) {
    if (!getTokenFunc) {
      throw new Error("Clerk getToken function must be provided.");
    }
    this.getTokenFunc = getTokenFunc;
  }

  private async getToken(): Promise<string> {
    try {
      // Use the provided getToken function
      // You can customize the token template if needed, e.g., { template: 'your_template' }
      const token = await this.getTokenFunc();
      if (!token) {
        throw new Error("Failed to retrieve Clerk token via SDK.");
      }
      return token;
    } catch (error) {
      console.error("Error getting Clerk token via SDK:", error);
      throw new Error("Authentication token could not be retrieved.");
    }
  }

  private async request<T>(resource: string, options: RequestInit): Promise<T> {
    const token = await this.getToken(); // Get token internally using the passed function

    const cleanResource = resource.startsWith("/")
      ? resource.substring(1)
      : resource;
    const url = `${this.baseUrl}/${cleanResource}`;

    // Prepare headers
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    headers.set("Authorization", `Bearer ${token}`);
    const finalOptions: RequestInit = {
      ...options,
      headers: headers,
    };

    console.log("API Request URL:", url);

    try {
      const response = await fetch(url, finalOptions);
      console.log("API Response Status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (error: unknown) {
          errorData = { message: await response.text() };
          console.log("Error response is not JSON:", error);
        }
        console.error("API Error Response:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorData?.message || response.statusText
          }`
        );
      }

      if (response.status === 204) {
        return {} as T;
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return (await response.json()) as T;
      } else {
        return {} as T;
      }
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Public methods remain the same, they now implicitly use the SDK's getToken

  public get<T>(resource: string, id?: string | number): Promise<T> {
    const path = id ? `${resource}/${id}` : resource;
    return this.request<T>(path, {
      method: "GET",
    });
  }

  public post<T, U>(resource: string, data: U): Promise<T> {
    return this.request<T>(resource, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public put<T, U>(resource: string, id: string | number, data: U): Promise<T> {
    const path = `${resource}/${id}`;
    return this.request<T>(path, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  public delete<T>(resource: string, id: string | number): Promise<T> {
    const path = `${resource}/${id}`;
    return this.request<T>(path, {
      method: "DELETE",
    });
  }
}

// Export the class itself, not an instance.
// The instance will be created where the Clerk context (and getToken) is available.
export default ApiClient;

/*
 * Example Usage (in a React component or context where useAuth is available):
 *
 * import { useAuth } from "@clerk/clerk-react";
 * import ApiClient from "./api"; // Adjust path as needed
 * import { useMemo } from "react";
 *
 * function MyComponent() {
 *   const { getToken } = useAuth();
 *
 *   // Memoize the apiClient instance to avoid recreating it on every render
 *   const apiClient = useMemo(() => {
 *      // Pass the getToken function from Clerk's useAuth hook
 *      return new ApiClient(getToken);
 *   }, [getToken]);
 *
 *   // Now use apiClient for your requests
 *   // Example: Fetching data
 *   useEffect(() => {
 *     const fetchData = async () => {
 *       try {
 *         const data = await apiClient.get<{ message: string }>('/some-resource');
 *         console.log(data);
 *       } catch (error) {
 *         console.error("Failed to fetch data:", error);
 *       }
 *     };
 *     fetchData();
 *   }, [apiClient]); // Add apiClient as a dependency
 *
 *   return <div>...</div>;
 * }
 */
