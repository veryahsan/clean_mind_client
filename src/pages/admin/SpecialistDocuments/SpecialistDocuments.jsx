import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../../components/layout/AdminNavbar";
import adminApi from "../../../services/adminApi";
import Loader from "../../../components/common/Loader";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";
import { useCard } from "../../../context/CardContext";
import SpecialistDocumentCard from "./components/SpecialistDocumentCard";

const DOCUMENT_TYPES = [
  { value: "license", label: "Professional License" },
  { value: "certificate", label: "Professional Certificate" },
  { value: "degree", label: "Academic Degree" },
  { value: "id_proof", label: "Identity Proof" },
  { value: "cv_resume", label: "CV/Resume" },
  { value: "registration", label: "Professional Registration" },
  { value: "other", label: "Other" },
];

const VERIFICATION_STATUS_OPTIONS = [
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "needs_revision", label: "Needs Revision" },
];

const SpecialistDocuments = () => {
  const navigate = useNavigate();
  const { specialistId } = useParams();
  const { Card, CardHeader, CardBody, EmptyState } = useCard();
  const [specialist, setSpecialist] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    document_type: "",
    document_file: null,
    admin_notes: "",
  });

  useEffect(() => {
    fetchSpecialistAndDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialistId]);

  const fetchSpecialistAndDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch specialist details
      const specialistResponse = await adminApi.get(`specialists/${specialistId}/`);
      if (specialistResponse.data?.success) {
        setSpecialist(specialistResponse.data.data);
      }

      // Fetch documents
      const documentsResponse = await adminApi.get(`specialists/${specialistId}/documents/`);
      if (documentsResponse.data?.success) {
        setDocuments(documentsResponse.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      const errorData = err.response?.data;
      setError(errorData?.message || "Failed to load specialist documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        document_file: file,
      });
      setError("");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess("");

    if (!formData.document_type || !formData.document_file) {
      setError("Please select document type and upload a file");
      setUploading(false);
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("document_type", formData.document_type);
      uploadFormData.append("document_file", formData.document_file);
      if (formData.admin_notes) {
        uploadFormData.append("admin_notes", formData.admin_notes);
      }

      const response = await adminApi.post(
        `specialists/${specialistId}/documents/`,
        uploadFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      if (data?.success) {
        setSuccess("Document uploaded successfully!");
        setFormData({
          document_type: "",
          document_file: null,
          admin_notes: "",
        });
        setShowAddForm(false);
        // Reset file input
        const fileInput = document.getElementById("document_file");
        if (fileInput) fileInput.value = "";
        
        // Refresh documents list
        setTimeout(() => {
          fetchSpecialistAndDocuments();
        }, 1000);
      } else {
        setError(data?.message || "Failed to upload document");
      }
    } catch (err) {
      console.error("Failed to upload document:", err);
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat();
        setError(errorMessages.join(", ") || "Failed to upload document");
      } else {
        setError(errorData?.message || "Failed to upload document. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateStatus = async (documentId, status, notes = "") => {
    try {
      setError("");
      setSuccess("");
      const response = await adminApi.patch(`documents/${documentId}/`, {
        verification_status: status,
        admin_notes: notes,
      });

      const data = response.data;
      if (data?.success) {
        setSuccess("Document status updated successfully!");
        setTimeout(() => {
          fetchSpecialistAndDocuments();
        }, 1000);
      } else {
        setError(data?.message || "Failed to update document status");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      const errorData = err.response?.data;
      setError(errorData?.message || "Failed to update document status. Please try again.");
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      const response = await adminApi.delete(`documents/${documentId}/`);
      const data = response.data;

      if (data?.success) {
        setSuccess("Document deleted successfully!");
        setTimeout(() => {
          fetchSpecialistAndDocuments();
        }, 1000);
      } else {
        setError(data?.message || "Failed to delete document");
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
      const errorData = err.response?.data;
      setError(errorData?.message || "Failed to delete document. Please try again.");
    }
  };


  if (loading) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/admin/specialists")}
            className="mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back to Specialists
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Specialist Documents
              </h1>
              {specialist && (
                <p className="text-gray-600 dark:text-gray-400">
                  {specialist.first_name && specialist.last_name
                    ? `${specialist.first_name} ${specialist.last_name}`
                    : specialist.username}{" "}
                  ({specialist.email})
                </p>
              )}
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
              >
                + Add Document
              </button>
            )}
          </div>
        </div>

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {/* Add Document Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Document
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ document_type: "", document_file: null, admin_notes: "" });
                  const fileInput = document.getElementById("document_file");
                  if (fileInput) fileInput.value = "";
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="document_type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Document Type *
                </label>
                <select
                  id="document_type"
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select document type</option>
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="document_file"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Document File *
                </label>
                <input
                  type="file"
                  id="document_file"
                  name="document_file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
                {formData.document_file && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Selected: {formData.document_file.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="admin_notes"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Admin Notes (Optional)
                </label>
                <textarea
                  id="admin_notes"
                  name="admin_notes"
                  value={formData.admin_notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Add any notes about this document..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader fullScreen={false} size={20} /> : "Upload Document"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ document_type: "", document_file: null, admin_notes: "" });
                    const fileInput = document.getElementById("document_file");
                    if (fileInput) fileInput.value = "";
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Documents List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <CardHeader title={`Documents (${documents.length})`} />
          {documents.length === 0 ? (
            <EmptyState message="No documents uploaded yet. Click '+ Add Document' to upload verification documents." />
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {documents.map((doc) => (
                <SpecialistDocumentCard
                  key={doc.id}
                  document={doc}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialistDocuments;
