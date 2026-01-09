import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    specialist_type: "",
    custom_specialist_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate custom type if selected
    if (formData.specialist_type === "custom" && !formData.custom_specialist_type.trim()) {
      setError("Please enter a custom specialist type");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("create-specialist/", formData);
      const data = response.data;

      if (data?.success) {
        setSuccess("Specialist created successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          specialist_type: "",
          custom_specialist_type: "",
        });
        setTimeout(() => {
          navigate("/admin/specialists");
        }, 2000);
      } else {
        setError(data?.message || "Failed to create specialist");
      }
    } catch (err) {
      console.error("Failed to create specialist:", err);
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat();
        setError(errorMessages.join(", ") || "Failed to create specialist");
      } else {
        setError(errorData?.message || "Failed to create specialist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
            <ErrorMessage message={error} />
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
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
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
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
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
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
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
                value={formData.specialist_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a type</option>
                {SPECIALIST_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.specialist_type === "custom" && (
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
                  value={formData.custom_specialist_type}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Occupational Therapist, Speech Therapist"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader fullScreen={false} size={20} /> : "Create Specialist"}
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

