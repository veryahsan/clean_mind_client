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
} from "@mui/icons-material";

const MembersList = () => {
  const navigate = useNavigate();
  const {
    data: members,
    pagination,
    loading,
    error: fetchError,
    setPage,
    setPageSize,
    refetch,
  } = usePaginatedQuery(adminApi, "members/");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  // Sync fetch errors into local error state
  useEffect(() => {
    if (fetchError) setError(fetchError);
  }, [fetchError]);

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

  const handleEdit = (memberId) => {
    console.log("Edit clicked for member:", memberId);
    setOpenMenuId(null);
    navigate(`/admin/edit-member/${memberId}`);
  };

  const handleDelete = async (memberId) => {
    console.log("Delete clicked for member:", memberId);
    setOpenMenuId(null);
    if (!window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      const response = await adminApi.delete(`members/${memberId}/`);
      const data = response.data;

      if (data?.success) {
        setSuccess("Member deleted successfully");
        setTimeout(() => {
          refetch();
        }, 1000);
      } else {
        setError(data?.message || "Failed to delete member");
      }
    } catch (err) {
      console.error("Failed to delete member:", err);
      const errorData = err.response?.data;
      setError(errorData?.message || "Failed to delete member. Please try again.");
    }
  };

  const toggleMenu = (memberId) => {
    setOpenMenuId(openMenuId === memberId ? null : memberId);
  };

  const getVerificationStatus = (member) => {
    // Check if account is fully verified and active
    if (member.is_active && member.email_verified_at) {
      return { label: 'Verified & Active', variant: 'success' };
    }
    
    // Account is active but email not verified
    if (member.is_active && !member.email_verified_at) {
      return { label: 'Pending Email Verification', variant: 'warning' };
    }
    
    // Account is suspended/inactive
    return { label: 'Suspended', variant: 'danger' };
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
              Members
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all member accounts ({pagination.total} total)
            </p>
          </div>
          <Link
            to="/admin/create-member"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            <PersonAdd className="w-5 h-5" />
            Create Member
          </Link>
        </div>

        <ErrorMessage message={error} />
        <SuccessMessage message={success} />

        {members.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No members found.
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
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {member.first_name && member.last_name
                          ? `${member.first_name} ${member.last_name}`
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const statusInfo = getVerificationStatus(member);
                        return <StatusCapsule label={statusInfo.label} variant={statusInfo.variant} />;
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {member.date_joined ? new Date(member.date_joined).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <div className="relative" ref={(el) => (menuRefs.current[member.id] = el)}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMenu(member.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                          aria-label="Options"
                        >
                          <MoreVert className="w-5 h-5" />
                        </button>
                        {openMenuId === member.id && (
                          <div 
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="py-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(member.id);
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
                                  handleDelete(member.id);
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

export default MembersList;

