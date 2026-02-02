import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useForm } from "../../../hooks/useForm";

/**
 * Edit public profile section for specialists.
 * Manages phone, address and bio shown on the public profile page.
 * Renders only when profileData.role === 'specialist'.
 */
const EditPublicProfile = ({ profileData, updateProfile, setError }) => {
  const [successMessage, setSuccessMessage] = useState(null);

  // Initial values from loaded profile so submit is only enabled when something changed
  const initialValues = {
    phone: profileData?.phone ?? "",
    address: profileData?.address ?? "",
    bio: profileData?.bio ?? "",
  };

  const validationRules = {};

  const onSubmit = async (formData) => {
    if (setError) setError(null);
    setSuccessMessage(null);
    const submitData = new FormData();
    submitData.append("phone", formData.phone || "");
    submitData.append("address", formData.address || "");
    submitData.append("bio", formData.bio || "");
    const result = await updateProfile(submitData);
    if (result.success) {
      setSuccessMessage("Public profile updated successfully.");
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    canSubmit,
    handleChange,
    handleBlur,
    handleSubmit,
    setFormValues,
  } = useForm(initialValues, validationRules, onSubmit);

  // Sync form when profile data loads
  useEffect(() => {
    if (profileData?.role === "specialist") {
      setFormValues({
        phone: profileData.phone || "",
        address: profileData.address || "",
        bio: profileData.bio || "",
      });
    }
  }, [profileData, setFormValues]);

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
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 ${
                touched.phone && errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g. +1 234 567 8900"
            />
            {touched.phone && errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 resize-y ${
                touched.address && errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Practice or contact address"
            />
            {touched.address && errors.address && (
              <p className="text-xs text-red-500 mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About / Bio
            </label>
            <textarea
              name="bio"
              value={values.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900 resize-y ${
                touched.bio && errors.bio ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Short bio or description for your public profile"
            />
            {touched.bio && errors.bio && (
              <p className="text-xs text-red-500 mt-1">{errors.bio}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-2 bg-primary hover:bg-primaryHover text-white rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress size={20} color="inherit" />
                </Box>
              )}
              {isSubmitting ? "Updating..." : "Update public profile"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditPublicProfile;
