import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import AdminNavbar from "../../components/layout/AdminNavbar";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";

const SPECIALIST_TYPES = [
  { value: "doctor", label: "Doctor" },
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "psychologist", label: "Psychologist" },
  { value: "physiotherapist", label: "Physiotherapist" },
  { value: "counselor", label: "Counselor" },
  { value: "therapist", label: "Therapist" },
  { value: "nutritionist", label: "Nutritionist" },
  { value: "custom", label: "Custom (Enter below)" },
];

const CreateSpecialist = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");

  const initialValues = {
    username: "",
    email: "",
    password: "",
    specialist_type: "",
    custom_specialist_type: "",
  };

  const validationRules = {
    username: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
    specialist_type: {
      required: "Specialist type is required",
    },
    custom_specialist_type: {
      custom: (value, formValues) => {
        if (formValues.specialist_type === "custom" && !value.trim()) {
          return "Please enter a custom specialist type";
        }
        return "";
      },
    },
  };

  const onSubmit = async (formData) => {
    setApiError("");
    setSuccess("");

    try {
      // Prepare payload - use custom_specialist_type if "custom" is selected
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        specialist_type:
          formData.specialist_type === "custom"
            ? formData.custom_specialist_type.trim()
            : formData.specialist_type,
      };

      const response = await api.post("create-specialist/", payload);
      const data = response.data;

      if (data?.success) {
        setSuccess("Specialist created successfully!");
        reset();
        setTimeout(() => {
          navigate("/admin/specialists");
        }, 2000);
      } else {
        setApiError(data?.message || "Failed to create specialist");
      }
    } catch (err) {
      console.error("Failed to create specialist:", err);
      const errorData = err.response?.data;

      if (errorData?.errors) {
        // Set server-side validation errors
        setServerErrors(errorData.errors);

        // Also set a general error message
        const errorMessages = Object.values(errorData.errors).flat();
        setApiError(errorMessages.join(", "));
      } else {
        setApiError(
          errorData?.message || "Failed to create specialist. Please try again."
        );
      }

      throw err; // Re-throw to let useForm handle it
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
    setServerErrors,
    reset,
  } = useForm(initialValues, validationRules, onSubmit);

  const handleInputChange = (e) => {
    handleChange(e);
    setApiError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Specialist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create a new specialist account
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ErrorMessage message={apiError} />
            <SuccessMessage message={success} />

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={values.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              {touched.username && errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="specialist_type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Specialist Type *
              </label>
              <select
                id="specialist_type"
                name="specialist_type"
                value={values.specialist_type}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a type</option>
                {SPECIALIST_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {touched.specialist_type && errors.specialist_type && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.specialist_type}
                </p>
              )}
            </div>

            {values.specialist_type === "custom" && (
              <div>
                <label
                  htmlFor="custom_specialist_type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Custom Specialist Type *
                </label>
                <input
                  type="text"
                  id="custom_specialist_type"
                  name="custom_specialist_type"
                  value={values.custom_specialist_type}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Occupational Therapist, Speech Therapist"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {touched.custom_specialist_type &&
                  errors.custom_specialist_type && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.custom_specialist_type}
                    </p>
                  )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader fullScreen={false} size={20} />
                ) : (
                  "Create Specialist"
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/specialists")}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSpecialist;
