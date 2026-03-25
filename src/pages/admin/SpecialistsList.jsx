import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/layout/AdminNavbar";
import adminApi from "../../services/adminApi";
import usePaginatedQuery from "../../hooks/usePaginatedQuery";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import StatusCapsule from "../../components/common/StatusCapsule";
import Paginator from "../../components/common/Paginator";
import {
  PersonAdd,
  MoreVert,
  Edit,
  Delete,
  Description,
  Add,
} from "@mui/icons-material";

const SpecialistsList = () => {
  const navigate = useNavigate();
  const {
    data: specialists,
    pagination,
    loading,
    error: fetchError,
    setPage,
    setPageSize,
    refetch,
  } = usePaginatedQuery(adminApi, "specialists/");

  const [documentCounts, setDocumentCounts] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  // Sync fetch errors into local error state
  useEffect(() => {
    if (fetchError) setError(fetchError);
  }, [fetchError]);

  // Fetch document counts for the current page of specialists
  useEffect(() => {
    if (specialists.length > 0) {
      fetchDocumentCounts();
    }
  }, [specialists]);

  // Close menu when clicking outside
  useEffect(() => {
    if (openMenuId === null) return;

    const handleClickOutside = (event) => {
      const clickedInside = Object.values(menuRefs.current).some((ref) => {
        return ref && ref.contains(event.target);
      });

      if (!clickedInside) {
        setOpenMenuId(null);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const fetchDocumentCounts = async () => {
    // Fetch document counts for all specialists
    const counts = {};
    for (const specialist of specialists) {
      try {
        const response = await adminApi.get(`specialists/${specialist.id}/documents/`);
        const data = response.data;
        if (data?.success && data.data) {
          const documents = data.data;
          const totalDocs = documents.length;
          const approvedDocs = documents.filter(doc => doc.verification_status === 'approved').length;
          const allApproved = totalDocs > 0 && approvedDocs === totalDocs;
          
          counts[specialist.id] = {
            count: totalDocs,
            hasDocuments: totalDocs > 0,
            hasVerifiedDocuments: approvedDocs > 0,
            allDocumentsApproved: allApproved,
            approvedCount: approvedDocs,
            totalCount: totalDocs
          };
        } else {
          counts[specialist.id] = { 
            count: 0, 
            hasDocuments: false, 
            hasVerifiedDocuments: false,
            allDocumentsApproved: false,
            approvedCount: 0,
            totalCount: 0
          };
        }
      } catch {
        // If error, assume no documents
        counts[specialist.id] = { 
          count: 0, 
          hasDocuments: false, 
          hasVerifiedDocuments: false,
          allDocumentsApproved: false,
          approvedCount: 0,
          totalCount: 0
        };
      }
    }
    setDocumentCounts(counts);
  };

  const handleEdit = (specialistId) => {
    console.log("Edit clicked for specialist:", specialistId);
    setOpenMenuId(null);
    navigate(`/admin/edit-specialist/${specialistId}`);
  };

  const handleDelete = async (specialistId) => {
    console.log("Delete clicked for specialist:", specialistId);
    setOpenMenuId(null);
    if (!window.confirm("Are you sure you want to delete this specialist? This action cannot be undone.")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      const response = await adminApi.delete(`specialists/${specialistId}/`);
      const data = response.data;

      if (data?.success) {
        setSuccess("Specialist deleted successfully");
        setTimeout(() => {
          refetch();
        }, 1000);
      } else {
        setError(data?.message || "Failed to delete specialist");
      }
    } catch (err) {
      console.error("Failed to delete specialist:", err);
      const errorData = err.response?.data;
      setError(errorData?.message || "Failed to delete specialist. Please try again.");
    }
  };

  const toggleMenu = (specialistId) => {
    setOpenMenuId(openMenuId === specialistId ? null : specialistId);
  };

  const handleManageDocuments = (specialistId) => {
    navigate(`/admin/specialists/${specialistId}/documents`);
  };

  const getVerificationStatus = (specialist) => {
    // Check if account is fully verified and active
    if (specialist.is_active && specialist.email_verified_at) {
      return { label: 'Verified & Active', variant: 'success' };
    }
    
    // Account is active but email not verified
    if (specialist.is_active && !specialist.email_verified_at) {
      return { label: 'Pending Email Verification', variant: 'warning' };
    }
    
    // Account not active yet - check document status
    const docInfo = documentCounts[specialist.id];
    
    // No documents uploaded
    if (!docInfo || !docInfo.hasDocuments || docInfo.totalCount === 0) {
      return { label: 'No Documents', variant: 'danger' };
    }
    
    // All documents are approved - ready for account verification
    if (docInfo.allDocumentsApproved) {
      return { label: 'Ready to Verify', variant: 'orange' };
    }
    
    // Some documents approved but not all
    if (docInfo.hasVerifiedDocuments && docInfo.approvedCount > 0) {
      return { label: `Pending Documents (${docInfo.approvedCount}/${docInfo.totalCount} approved)`, variant: 'warning' };
    }
    
    // Documents exist but none approved yet
    return { label: 'Pending Documents', variant: 'warning' };
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Specialists
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all specialist accounts ({pagination.total} total)
            </p>
          </div>
          <Link
            to="/admin/create-specialist"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            <PersonAdd className="w-5 h-5" />
            Create Specialist
          </Link>
        </div>

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {specialists.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No specialists found.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Specialist Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Verification Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {specialists.map((specialist) => (
                  <tr key={specialist.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {specialist.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {specialist.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {specialist.first_name && specialist.last_name
                          ? `${specialist.first_name} ${specialist.last_name}`
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {specialist.specialist_type_display || specialist.specialist_type || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const statusInfo = getVerificationStatus(specialist);
                        return <StatusCapsule label={statusInfo.label} variant={statusInfo.variant} />;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {specialist.date_joined ? new Date(specialist.date_joined).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleManageDocuments(specialist.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-lg transition"
                        >
                          {documentCounts[specialist.id]?.hasDocuments ? (
                            <>
                              <Description className="w-4 h-4" />
                              Update Documents
                            </>
                          ) : (
                            <>
                              <Add className="w-4 h-4" />
                              Add Documents
                            </>
                          )}
                        </button>
                        <div className="relative" ref={(el) => (menuRefs.current[specialist.id] = el)}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(specialist.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                          aria-label="Options"
                        >
                          <MoreVert className="w-5 h-5" />
                        </button>
                        {openMenuId === specialist.id && (
                          <div 
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(specialist.id);
                                }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(specialist.id);
                                }}
                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Delete className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Paginator
              pagination={pagination}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialistsList;

