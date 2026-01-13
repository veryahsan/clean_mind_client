import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import UserAvatar from "../layout/UserAvatar";
import Logo from "../../assets/logo.png";
import LogoutModal from "../../modals/LogoutModal";
import AuthenticatedFooter from "./AuthenticatedFooter";

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;
const DEFAULT_SIDEBAR_WIDTH = 256; // w-64 = 256px

const Sidebar = ({ isOpen, onClose, sidebarWidth, setSidebarWidth }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { openModal } = useModal();
  const [expandedItems, setExpandedItems] = useState({});
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const sidebarRef = useRef(null);
  const resizeHandleRef = useRef(null);

  const handleLogoutConfirm = () => {
    logout();
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };

  const handleLogoutClick = () => {
    onClose();
    openModal(<LogoutModal onConfirm={handleLogoutConfirm} />);
  };

  // Check if we're on desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Initialize sidebar width from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !sidebarWidth) {
      const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
      if (savedWidth) {
        setSidebarWidth(parseInt(savedWidth, 10));
      } else {
        setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
      }
    }
  }, [sidebarWidth, setSidebarWidth]);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      const clampedWidth = Math.max(
        MIN_SIDEBAR_WIDTH,
        Math.min(MAX_SIDEBAR_WIDTH, newWidth)
      );
      setSidebarWidth(clampedWidth);
      localStorage.setItem(SIDEBAR_WIDTH_KEY, clampedWidth.toString());
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  // Only show sidebar when authenticated
  if (!isAuthenticated) return null;

  const toggleItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "calendar",
      name: "Calendar",
      path: "/calendar",
      icon: (
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
      ),
    },
    {
      id: "messages",
      name: "Messages",
      path: "/messages",
      icon: (
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      id: "notifications",
      name: "Notifications",
      path: "/notifications",
      icon: (
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "assistant",
      name: "Personal Assistant",
      path: "/assistant",
      icon: (
        <svg
          className="size-4"
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Overlay for mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        id="hs-sidebar-content-push"
        ref={sidebarRef}
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transform h-full fixed top-0 start-0 bottom-0 z-50 bg-white border-e border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 w-64 ${
          isResizing ? "" : "transition-all duration-300 ease-in-out"
        }`}
        style={{ 
          width: isDesktop ? `${sidebarWidth || DEFAULT_SIDEBAR_WIDTH}px` : undefined 
        }}
        role="dialog"
        tabIndex="-1"
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="p-4 flex justify-between items-center gap-x-2">
            <Link
              to="/dashboard"
              className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80 dark:text-white flex items-center gap-2"
              aria-label="Brand"
              onClick={onClose}
            >
              <img src={Logo} alt="CleanMind Logo" className="h-8 w-auto" />
              <span>CleanMind</span>
            </Link>

            <div className="lg:hidden -me-2">
              {/* Close Button */}
              <button
                type="button"
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                onClick={onClose}
              >
                <svg
                  className="shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>
          {/* End Header */}

          {/* Body */}
          <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="pb-0 px-2 w-full flex flex-col flex-wrap">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <li key={item.id}>
                      <Link
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center gap-x-1.5 py-2 px-2 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 transition ${
                          active
                            ? "bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white"
                            : "text-gray-800 dark:text-neutral-200"
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

            </div>
          </nav>
          {/* End Body */}

          {/* Profile Section at bottom */}
          <div className="mt-auto border-t border-gray-200 dark:border-neutral-700">
            {/* User Info */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <UserAvatar 
                  username={user?.username} 
                  headshot={user?.headshot} 
                  has_headshot={user?.has_headshot}
                  size={40} 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username || "User"}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Menu Links */}
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/profile"
                    onClick={onClose}
                    className={`flex items-center gap-x-3 py-2 px-2 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 transition ${
                      isActive("/profile")
                        ? "bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white"
                        : "text-gray-800 dark:text-neutral-200"
                    }`}
                  >
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </Link>
                </li>

                <li>
                  <Link
                    to="/settings"
                    onClick={onClose}
                    className={`flex items-center gap-x-3 py-2 px-2 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 transition ${
                      isActive("/settings")
                        ? "bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-white"
                        : "text-gray-800 dark:text-neutral-200"
                    }`}
                  >
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
                    </svg>
                    Settings
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-x-3 py-2 px-2 text-sm text-red-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 transition"
                  >
                    <svg
                      className="size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </li>
              </ul>
            </div>

            {/* Footer at bottom of sidebar */}
            <AuthenticatedFooter />
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeHandleRef}
          onMouseDown={handleMouseDown}
          className={`hidden lg:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-3 h-12 cursor-col-resize rounded-md transition-all duration-200 group ${
            isResizing 
              ? "bg-indigo-500 scale-110" 
              : "bg-gray-300 dark:bg-gray-600 hover:bg-indigo-400 dark:hover:bg-indigo-500 hover:scale-105"
          }`}
          style={{ 
            zIndex: 60,
            touchAction: "none"
          }}
          aria-label="Resize sidebar"
        >
          {/* Visual indicator dots */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex flex-col gap-1">
              <div className="w-1 h-1 rounded-full bg-white dark:bg-gray-200"></div>
              <div className="w-1 h-1 rounded-full bg-white dark:bg-gray-200"></div>
              <div className="w-1 h-1 rounded-full bg-white dark:bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
      {/* End Sidebar */}
    </>
  );
};

export default Sidebar;

