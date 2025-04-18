// to ge log lived token for testing: await window.Clerk.session.getToken({ template: 'yaak_token' })

class ApiClient {
  private baseUrl: string = "/api";

  constructor() {}

  private async request<T>(
    resource: string,
    token: string,
    options: RequestInit
  ): Promise<T> {
    const cleanResource = resource.startsWith("/")
      ? resource.substring(1)
      : resource;
    const url = `${this.baseUrl}/${cleanResource}`;

    // Prepare headers
    const headers = new Headers(options.headers || {}); // Initialize Headers object
    headers.set("Content-Type", "application/json"); // Ensure Content-Type is set
    headers.set("Authorization", `Bearer ${token}`);
    const finalOptions: RequestInit = {
      ...options,
      headers: headers, // Use the Headers object
    };

    console.log("API Request URL:", url);
    console.log("API Request Options:", finalOptions); // Log final options with headers

    try {
      const response = await fetch(url, finalOptions);
      console.log("API Response Status:", response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (error: unknown) {
          console.log("Error parsing JSON:", error);
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

      return (await response.json()) as T;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET method - No changes needed here, request() handles auth
  public get<T>(
    resource: string,
    token: string,
    id?: string | number
  ): Promise<T> {
    const path = id ? `${resource}/${id}` : resource;
    return this.request<T>(path, token, {
      method: "GET",
    });
  }

  // POST method - No changes needed here, request() handles auth
  public post<T, U>(resource: string, token: string, data: U): Promise<T> {
    return this.request<T>(resource, token, {
      method: "POST",
      // Headers are now set in request()
      body: JSON.stringify(data),
    });
  }

  // PUT method - No changes needed here, request() handles auth
  public put<T, U>(
    resource: string,
    token: string,
    id: string | number,
    data: U
  ): Promise<T> {
    const path = `${resource}/${id}`;
    return this.request<T>(path, token, {
      method: "PUT",
      // Headers are now set in request()
      body: JSON.stringify(data),
    });
  }

  // DELETE method - No changes needed here, request() handles auth
  public delete<T>(
    resource: string,
    token: string,
    id: string | number
  ): Promise<T> {
    const path = `${resource}/${id}`;
    return this.request<T>(path, token, {
      method: "DELETE",
      // Headers are now set in request()
    });
  }
}

// Export an instance for easy use throughout the application
const apiClient = new ApiClient();
export default apiClient;
