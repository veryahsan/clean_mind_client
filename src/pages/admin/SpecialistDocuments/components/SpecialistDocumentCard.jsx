import React from "react";

const VERIFICATION_STATUS_OPTIONS = [
  { value: "pending", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "needs_revision", label: "Needs Revision" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "needs_revision":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const SpecialistDocumentCard = ({ 
  document, 
  onUpdateStatus, 
  onDelete
}) => {
  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {document.document_type_display || document.document_type}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                document.verification_status
              )}`}
            >
              {document.verification_status_display || document.verification_status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div>
              <span className="font-medium">File:</span>{" "}
              {document.document_file_url ? (
                <a
                  href={document.document_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Document
                </a>
              ) : (
                "N/A"
              )}
            </div>
            <div>
              <span className="font-medium">File Size:</span>{" "}
              {document.file_size ? `${(document.file_size / 1024).toFixed(2)} KB` : "N/A"}
            </div>
            <div>
              <span className="font-medium">Uploaded:</span>{" "}
              {document.created_at
                ? new Date(document.created_at).toLocaleString()
                : "N/A"}
            </div>
            {document.verified_at && (
              <div>
                <span className="font-medium">Verified:</span>{" "}
                {new Date(document.verified_at).toLocaleString()} by{" "}
                {document.verified_by_username || "Admin"}
              </div>
            )}
          </div>

          {document.admin_notes && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Notes:</span> {document.admin_notes}
              </p>
            </div>
          )}

          {/* Update Status Section */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Update Status:
            </span>
            {VERIFICATION_STATUS_OPTIONS.map((status) => (
              <button
                key={status.value}
                onClick={() => onUpdateStatus(document.id, status.value, document.admin_notes)}
                disabled={document.verification_status === status.value}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                  document.verification_status === status.value
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                }`}
              >
                {status.label}
              </button>
            ))}
            <button
              onClick={() => onDelete(document.id)}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistDocumentCard;
