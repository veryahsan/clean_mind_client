import React, { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useFileUpload } from "../../hooks/useFileUpload";
import { useForm } from "../../hooks/useForm";
import { getMediaUrl } from "../../utils/imageUtils";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import Avatar from "@mui/material/Avatar";
import UserAvatar from "../../components/layout/UserAvatar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import EditPublicProfile from "./components/EditPublicProfile";

const Profile = () => {
  const { profileData, loading, error, updateProfile, setError } = useProfile();
  const {
    selectedFile,
    previewUrl,
    error: fileError,
    fileInputRef,
    handleFileChange,
    clearFile,
    setError: setFileError,
  } = useFileUpload({ maxSize: 5 * 1024 * 1024 });

  const [successMessage, setSuccessMessage] = useState(null);

  // Validation rules
  const validationRules = {
    email: {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Enter a valid email address",
      },
    },
    first_name: {},
    last_name: {},
    availability_status: {},
  };

  // Initialize form with empty values (will be populated when profileData loads)
  const initialValues = {
    email: '',
    first_name: '',
    last_name: '',
    availability_status: 'offline',
  };

  // Form submission handler (defined before useForm to avoid circular dependency)
  const handleFormSubmit = async (formData) => {
    // Clear any previous errors
    setError(null);
    setFileError(null);
    setSuccessMessage(null);

    try {
      // Create FormData for multipart/form-data
      const submitFormData = new FormData();
      
      if (formData.email) {
        submitFormData.append('email', formData.email);
      }
      if (formData.first_name !== undefined) {
        submitFormData.append('first_name', formData.first_name || '');
      }
      if (formData.last_name !== undefined) {
        submitFormData.append('last_name', formData.last_name || '');
      }
      
      // Add availability_status for specialists
      if (profileData?.role === 'specialist' && formData.availability_status) {
        submitFormData.append('availability_status', formData.availability_status);
      }
      
      if (selectedFile) {
        submitFormData.append('headshot', selectedFile);
      }

      const result = await updateProfile(submitFormData);

      if (result.success) {
        clearFile();
        setSuccessMessage("Profile updated successfully.");
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      throw err;
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
    clearErrors,
  } = useForm(initialValues, validationRules, handleFormSubmit);

  // Handle server errors from API responses
  useEffect(() => {
    if (error) {
      // If error contains field-specific errors, set them in the form
      // This would need to be handled based on your API error format
      // For now, we'll just clear form errors when there's a general error
      clearErrors();
    }
  }, [error, clearErrors]);

  // Update main form values when profile data loads
  useEffect(() => {
    if (profileData) {
      setFormValues({
        email: profileData.email || '',
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        availability_status: profileData.availability_status || 'offline',
      });
    }
  }, [profileData, setFormValues]);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error && !profileData) {
    return <ErrorMessage message={error} fullScreen />;
  }

  const displayError = error || fileError;
  // Use has_headshot flag from backend if available, otherwise fallback to checking headshot
  const hasHeadshot = profileData?.has_headshot !== undefined 
    ? profileData.has_headshot 
    : Boolean(profileData?.headshot);
  const displayHeadshot = previewUrl || (hasHeadshot && profileData?.headshot ? getMediaUrl(profileData.headshot) : null);

  return (
    <div className="bg-white p-6">
      <div className="max-w-7xl mx-auto">
          <SuccessMessage 
            message={successMessage} 
            onDismiss={() => setSuccessMessage(null)} 
          />
          
          {displayError && (
            <ErrorMessage message={displayError} />
          )}

          {/* Profile Picture Section */}
          <div className="mb-8 flex flex-col items-center md:flex-row md:items-start md:space-x-6">
            <div className="mb-4 md:mb-0">
              {/* Bigger Headshot with Hover Camera Icon */}
              <div 
                className="relative group cursor-pointer"
                onClick={handleImageClick}
                title="Click to edit profile picture"
              >
                {displayHeadshot ? (
                  <Avatar
                    src={displayHeadshot}
                    alt={previewUrl ? "Preview" : `${profileData?.first_name || ""} ${profileData?.last_name || ""}`.trim() || profileData?.username}
                    sx={{ width: 120, height: 120, cursor: 'pointer' }}
                    className="border-4 border-gray-200 transition-opacity duration-200 group-hover:opacity-75"
                  />
                ) : (
                  <div className="w-30 h-30 transition-opacity duration-200 group-hover:opacity-75 cursor-pointer">
                    <UserAvatar 
                      username={profileData?.username} 
                      headshot={profileData?.headshot} 
                      has_headshot={profileData?.has_headshot}
                      size={120} 
                    />
                  </div>
                )}
                {/* Camera Icon Overlay on Hover */}
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              {/* Edit Profile Text */}
              <button
                type="button"
                onClick={handleImageClick}
                className="mt-2 text-sm text-primary hover:text-primaryHover font-medium transition-colors duration-200 block w-full text-center"
              >
                Edit Profile
              </button>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {profileData?.first_name || profileData?.last_name
                  ? `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim()
                  : profileData?.username}
              </h2>
              <p className="text-gray-600 mb-1">
                @{profileData?.username}
              </p>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                {profileData?.role === "specialist" ? "Medical Specialist" : "Member"}
              </span>
              {profileData?.role === "specialist" && profileData?.availability_status && (
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ml-2 ${
                  profileData.availability_status === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : profileData.availability_status === 'on-leave'
                    ? 'bg-yellow-100 text-yellow-800'
                    : profileData.availability_status === 'in-emergency'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {profileData.availability_status === 'available' ? 'Available' :
                   profileData.availability_status === 'on-leave' ? 'On Leave' :
                   profileData.availability_status === 'in-emergency' ? 'In Emergency' :
                   'Offline'}
                </span>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden file input for headshot upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="hidden"
              name="headshot"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profileData?.username || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username cannot be changed
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 ${
                    touched.email && errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={values.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 ${
                    touched.first_name && errors.first_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your first name"
                />
                {touched.first_name && errors.first_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={values.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 ${
                    touched.last_name && errors.last_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your last name"
                />
                {touched.last_name && errors.last_name && (
                  <p className="text-xs text-red-500 mt-1">{errors.last_name}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profileData?.role === "specialist" ? "Medical Specialist" : "Member"}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Role cannot be changed
                </p>
              </div>

              {/* Availability Status - Only for Specialists */}
              {profileData?.role === "specialist" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability Status
                  </label>
                  <select
                    name="availability_status"
                    value={values.availability_status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 ${
                      touched.availability_status && errors.availability_status
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="offline">Offline</option>
                    <option value="available">Available</option>
                    <option value="on-leave">On Leave</option>
                    <option value="in-emergency">In Emergency</option>
                  </select>
                  {touched.availability_status && errors.availability_status && (
                    <p className="text-xs text-red-500 mt-1">{errors.availability_status}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Update your current availability status
                  </p>
                </div>
              )}
            </div>

            {/* Update Button */}
            <div className=" flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary hover:bg-primaryHover text-white rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && (
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress size={20} color="inherit" />
                  </Box>
                )}
                {isSubmitting ? "Updating..." : "Update Changes"}
              </button>
              {selectedFile && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel file selection
                </button>
              )}
            </div>
          </form>

          <EditPublicProfile
            profileData={profileData}
            updateProfile={updateProfile}
            setError={setError}
          />
      </div>
    </div>
  );
};

export default Profile;
