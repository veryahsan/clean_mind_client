import axios from "axios";

// Profile API instance for profile-related endpoints
const profileApi = axios.create({
  baseURL: "/api/auth/profile/", // Uses Vite proxy to avoid CORS issues
  // Don't set Content-Type here - let axios set it automatically
  // It will be 'application/json' for regular requests and 'multipart/form-data' for file uploads
});

// Add JWT token to all requests
profileApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Don't set Content-Type for multipart/form-data - let the browser set it with boundary
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (401, 403, etc.)
profileApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        // Clear invalid token
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        // Redirect to login (will be handled by ProtectedRoute)
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default profileApi;

