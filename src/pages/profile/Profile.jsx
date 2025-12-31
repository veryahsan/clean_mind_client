import React, { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useFileUpload } from "../../hooks/useFileUpload";
import { getMediaUrl } from "../../utils/imageUtils";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import Avatar from "@mui/material/Avatar";
import UserAvatar from "../../components/layout/UserAvatar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

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
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when profile data loads
  useEffect(() => {
    if (profileData) {
      setFormData({
        email: profileData.email || '',
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
      });
    }
  }, [profileData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Clear any previous errors
    setError(null);
    setFileError(null);
    setSuccessMessage(null);

    try {
      setIsSubmitting(true);

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
      
      if (selectedFile) {
        submitFormData.append('headshot', selectedFile);
      }

      const result = await updateProfile(submitFormData);

      if (result.success) {
        clearFile();
        setSuccessMessage("Profile updated successfully!");
        
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSubmitting(false);
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
    <div className="min-h-screen bg-white p-6">
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
              {displayHeadshot ? (
                <Avatar
                  src={displayHeadshot}
                  alt={previewUrl ? "Preview" : `${profileData?.first_name || ""} ${profileData?.last_name || ""}`.trim() || profileData?.username}
                  sx={{ width: 120, height: 120 }}
                  className="border-4 border-gray-200"
                />
              ) : (
                <div className="w-30 h-30">
                  <UserAvatar 
                    username={profileData?.username} 
                    headshot={profileData?.headshot} 
                    has_headshot={profileData?.has_headshot}
                    size={120} 
                  />
                </div>
              )}
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
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                  placeholder="Enter your email"
                />
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                  placeholder="Enter your last name"
                />
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
            </div>

            {/* Profile Picture Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                {displayHeadshot ? (
                  <img
                    src={displayHeadshot}
                    alt={previewUrl ? "Preview" : "Profile"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a new profile picture (JPG, PNG, etc. - Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
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
      </div>
    </div>
  );
};

export default Profile;
