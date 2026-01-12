import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../components/layout/AdminNavbar";
import adminApi from "../../services/adminApi";
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

const EditSpecialist = () => {
  const navigate = useNavigate();
  const { specialistId } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    specialist_type: "",
    custom_specialist_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSpecialist();
  }, [specialistId]);

  const fetchSpecialist = async () => {
    try {
      setFetching(true);
      setError("");
      const response = await adminApi.get(`specialists/${specialistId}/`);
      const data = response.data;

      if (data?.success) {
        const specialist = data.data;
        const specialistType = specialist.specialist_type || "";
        
        // Check if it's a predefined type
        const isPredefined = SPECIALIST_TYPES.some(
          (type) => type.value === specialistType
        );

        setFormData({
          username: specialist.username || "",
          email: specialist.email || "",
          first_name: specialist.first_name || "",
          last_name: specialist.last_name || "",
          specialist_type: isPredefined ? specialistType : "custom",
          custom_specialist_type: isPredefined ? "" : specialistType,
        });
      } else {
        setError(data?.message || "Failed to load specialist");
      }
    } catch (err) {
      console.error("Failed to fetch specialist:", err);
      const errorData = err.response?.data;
      setError(
        errorData?.message || "Failed to load specialist. Please try again."
      );
    } finally {
      setFetching(false);
    }
  };

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
    if (
      formData.specialist_type === "custom" &&
      !formData.custom_specialist_type.trim()
    ) {
      setError("Please enter a custom specialist type");
      setLoading(false);
      return;
    }

    try {
      // Prepare payload - use custom_specialist_type if "custom" is selected, otherwise use specialist_type
      const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        specialist_type:
          formData.specialist_type === "custom"
            ? formData.custom_specialist_type.trim()
            : formData.specialist_type,
      };

      const response = await adminApi.patch(`specialists/${specialistId}/`, payload);
      const data = response.data;

      if (data?.success) {
        setSuccess("Specialist updated successfully!");
        setTimeout(() => {
          navigate("/admin/specialists");
        }, 2000);
      } else {
        setError(data?.message || "Failed to update specialist");
      }
    } catch (err) {
      console.error("Failed to update specialist:", err);
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat();
        setError(errorMessages.join(", ") || "Failed to update specialist");
      } else {
        setError(
          errorData?.message || "Failed to update specialist. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavbar />
        <div className="flex justify-center items-center py-20">
          <Loader fullScreen={false} size={50} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Specialist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update specialist account information
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
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
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
                {loading ? (
                  <Loader fullScreen={false} size={20} />
                ) : (
                  "Update Specialist"
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

export default EditSpecialist;
