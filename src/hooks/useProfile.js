import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import profileApi from "../services/profileApi";

export const useProfile = () => {
  const { updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await profileApi.get("");
      const responseData = response.data;
      if (responseData.success && responseData.data) {
        setProfileData(responseData.data);
      } else {
        setProfileData(responseData);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      
      if (err.response) {
        const errorData = err.response.data;
        if (errorData && errorData.success === false) {
          setError(errorData.message || "An error occurred");
        } else if (err.response.status === 401) {
          setError("Authentication failed. Your session may have expired. Please login again.");
        } else if (err.response.status === 403) {
          setError("You don't have permission to access this resource.");
        } else {
          setError(
            errorData?.message ||
              errorData?.detail ||
              `Error: ${err.response.status} - ${err.response.statusText}`
          );
        }
      } else if (err.request) {
        setError("Unable to connect to server. Please check your connection and ensure the backend is running.");
      } else {
        setError("Failed to load profile information. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      setError(null);
      
      const response = await profileApi.patch("", formData);
      const responseData = response.data;
      let updatedData;
      if (responseData.success && responseData.data) {
        updatedData = responseData.data;
      } else {
        updatedData = responseData.data || responseData;
      }
      
      setProfileData(updatedData);
      
      const updatedUserData = {
        id: updatedData.id,
        username: updatedData.username,
        role: updatedData.role,
        email: updatedData.email,
        first_name: updatedData.first_name,
        last_name: updatedData.last_name,
        headshot: updatedData.headshot,
        has_headshot: updatedData.has_headshot,
      };
      updateUser(updatedUserData);
      
      return { success: true, data: updatedData };
    } catch (err) {
      console.error("Failed to update profile:", err);
      
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (err.response) {
        const errorData = err.response.data;
        
        // Handle standardized error format
        if (errorData && errorData.success === false) {
          errorMessage = errorData.message || errorMessage;
          
          // If there are field-specific errors, format them
          if (errorData.errors && typeof errorData.errors === 'object') {
            const errorMessages = [];
            Object.keys(errorData.errors).forEach((key) => {
              if (Array.isArray(errorData.errors[key])) {
                errorMessages.push(`${key}: ${errorData.errors[key].join(', ')}`);
              } else {
                errorMessages.push(`${key}: ${errorData.errors[key]}`);
              }
            });
            if (errorMessages.length > 0) {
              errorMessage = errorMessages.join(' ');
            }
          }
        } else if (err.response.status === 401) {
          errorMessage = "Authentication failed. Your session may have expired. Please login again.";
        } else if (err.response.status === 400) {
          // Handle old format validation errors
          const errorMessages = [];
          if (typeof errorData === 'object') {
            Object.keys(errorData).forEach((key) => {
              if (Array.isArray(errorData[key])) {
                errorMessages.push(`${key}: ${errorData[key].join(', ')}`);
              } else {
                errorMessages.push(`${key}: ${errorData[key]}`);
              }
            });
          }
          errorMessage = errorMessages.length > 0 ? errorMessages.join(' ') : "Validation error. Please check your input.";
        } else {
          errorMessage = errorData?.message || errorData?.detail || errorMessage;
        }
      } else if (err.request) {
        errorMessage = "Unable to connect to server. Please check your connection.";
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profileData,
    loading,
    error,
    fetchProfile,
    updateProfile,
    setError,
  };
};

