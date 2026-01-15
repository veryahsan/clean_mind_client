import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import LogoutModal from "../../modals/LogoutModal";
import {
  Dashboard,
  People,
  MedicalServices,
  PersonAdd,
  Logout,
} from "@mui/icons-material";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const { openModal } = useModal();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <Dashboard className="w-4 h-4" /> },
    { name: "Members", path: "/admin/members", icon: <People className="w-4 h-4" /> },
    { name: "Specialists", path: "/admin/specialists", icon: <MedicalServices className="w-4 h-4" /> },
    { name: "Create Member", path: "/admin/create-member", icon: <PersonAdd className="w-4 h-4" /> },
    { name: "Create Specialist", path: "/admin/create-specialist", icon: <PersonAdd className="w-4 h-4" /> },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogoutConfirm = () => {
    logout();
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  const handleLogoutClick = () => {
    openModal(<LogoutModal onConfirm={handleLogoutConfirm} />);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "border-indigo-500 text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user?.username || "Admin"}
            </span>
            <button
              onClick={handleLogoutClick}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <Logout className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

