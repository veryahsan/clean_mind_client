import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/**
 * Edit public profile section for specialists.
 * Manages phone, address and bio shown on the public profile page.
 * Renders only when profileData.role === 'specialist'.
 */
const EditPublicProfile = ({ profileData, updateProfile, setError }) => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (profileData?.role === "specialist") {
      setPhone(profileData.phone || "");
      setAddress(profileData.address || "");
      setBio(profileData.bio || "");
    }
  }, [profileData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setError) setError(null);
    setSuccessMessage(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("phone", phone || "");
      formData.append("address", address || "");
      formData.append("bio", bio || "");
      const result = await updateProfile(formData);
      if (result.success) {
        setSuccessMessage("Public profile updated successfully.");
        setTimeout(() => setSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error("Failed to update public profile:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (profileData?.role !== "specialist") {
    return null;
  }

  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Edit public profile
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Phone, address and bio shown on your public profile page to patients.
            </p>
          </div>
          {profileData?.id && (
            <Link
              to={`/profile/doctor/${profileData.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:text-primaryHover shrink-0"
            >
              Preview public profile →
            </Link>
          )}
        </div>

        {successMessage && (
          <div className="mb-4 p-3 rounded-md bg-green-50 text-green-800 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
              placeholder="e.g. +1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 resize-y"
              placeholder="Practice or contact address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About / Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 resize-y"
              placeholder="Short bio or description for your public profile"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary hover:bg-primaryHover text-white rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress size={20} color="inherit" />
                </Box>
              )}
              {submitting ? "Updating..." : "Update public profile"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPublicProfile;
