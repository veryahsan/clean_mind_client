import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import UserAvatar from "../layout/UserAvatar";
import Logo from "../../assets/logo.png";
import LogoutModal from "../../modals/LogoutModal";
import AuthenticatedFooter from "./AuthenticatedFooter";
import { menuSections, generalMenuItems } from "./sidebarMenuItems.jsx";

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 500;
const DEFAULT_SIDEBAR_WIDTH = 256; // w-64 = 256px

const Sidebar = ({ isOpen, onClose, sidebarWidth, setSidebarWidth }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { openModal } = useModal();
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const sidebarRef = useRef(null);
  const resizeHandleRef = useRef(null);
  
  // Track user's manual expand/collapse preferences
  const [userExpandedSections, setUserExpandedSections] = useState(() => {
    const defaultExpanded = new Set(menuSections.map(section => section.id));
    defaultExpanded.add('general');
    return defaultExpanded;
  });

  // Compute which sections should be expanded based on route
  const routeBasedExpanded = useMemo(() => {
    const activePath = location.pathname;
    const expanded = new Set();
    
    // Check menu sections
    menuSections.forEach(section => {
      const hasActiveItem = section.items.some(item => item.path === activePath);
      if (hasActiveItem) {
        expanded.add(section.id);
      }
    });

    // Check general menu items
    const hasActiveGeneralItem = generalMenuItems.some(item => item.path === activePath);
    if (hasActiveGeneralItem) {
      expanded.add('general');
    }
    
    return expanded;
  }, [location.pathname]);

  // Merge route-based expansion with user preferences
  const expandedSections = useMemo(() => {
    const merged = new Set(userExpandedSections);
    // Always include sections that contain the active route
    routeBasedExpanded.forEach(sectionId => merged.add(sectionId));
    return merged;
  }, [userExpandedSections, routeBasedExpanded]);

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

  // Toggle section expand/collapse (only affects user preferences, not route-based expansion)
  const toggleSection = useCallback((sectionId) => {
    setUserExpandedSections(prev => {
      const newSet = new Set(prev);
      // Don't allow collapsing if this section contains the active route
      if (routeBasedExpanded.has(sectionId)) {
        // If route-based, just ensure it's in user preferences for when route changes
        newSet.add(sectionId);
      } else {
        // Toggle user preference
        if (newSet.has(sectionId)) {
          newSet.delete(sectionId);
        } else {
          newSet.add(sectionId);
        }
      }
      return newSet;
    });
  }, [routeBasedExpanded]);

  // Only show sidebar when authenticated
  if (!isAuthenticated) return null;

  const isActive = (path) => {
    return location.pathname === path;
  };

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
        } lg:translate-x-0 transform h-full fixed top-0 start-0 bottom-0 z-50 bg-gradient-to-b from-white via-white to-gray-50/50 border-e border-gray-200/80 shadow-lg dark:from-neutral-800 dark:via-neutral-800 dark:to-neutral-900/50 dark:border-neutral-700 w-64 ${
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
          <header className="p-4 flex justify-between items-center gap-x-2 border-b border-gray-200/60 dark:border-neutral-700/60 bg-gradient-to-r from-indigo-50/30 to-transparent dark:from-indigo-900/10">
            <Link
              to="/dashboard"
              className="flex-none font-semibold text-xl text-gray-900 focus:outline-none focus:opacity-80 dark:text-white flex items-center gap-2.5"
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
                className="flex justify-center items-center gap-x-3 size-8 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-gray-500/20 transition-colors duration-150 dark:bg-neutral-700/80 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-600"
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
          <nav className="flex-1 overflow-y-auto py-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-300/60 hover:[&::-webkit-scrollbar-thumb]:bg-indigo-400/80 dark:[&::-webkit-scrollbar-thumb]:bg-indigo-600/40 dark:hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500/60 transition-colors">
            <div className="pb-0 px-3 w-full flex flex-col flex-wrap">
              {menuSections.map((section) => {
                const isExpanded = expandedSections.has(section.id);
                return (
                  <div key={section.id} className="mb-6">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150"
                    >
                      <span>{section.title}</span>
                      <svg
                        className={`size-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <ul className="space-y-1.5">
                        {section.items.map((item) => {
                          const active = isActive(item.path);
                          return (
                            <li key={item.id}>
                              <Link
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-x-2 py-2.5 px-3 text-sm font-medium rounded-xl transition-colors duration-150 ${
                                  active
                                    ? "bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 text-indigo-700 dark:text-indigo-300"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700/50"
                                }`}
                              >
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>
          {/* End Body */}

          {/* Profile Section at bottom */}
          <div className="mt-auto border-t border-gray-200/60 dark:border-neutral-700/60 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-neutral-900/30">
            {/* User Info */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <UserAvatar 
                    username={user?.username} 
                    headshot={user?.headshot} 
                    has_headshot={user?.has_headshot}
                    size={44} 
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-neutral-800 rounded-full shadow-sm"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.first_name && user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : user?.username || "User"}
                  </p>
                  {user?.email && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* General Menu Section */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleSection('general')}
                  className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150"
                >
                  <span>General</span>
                  <svg
                    className={`size-4 transition-transform duration-200 ${expandedSections.has('general') ? 'rotate-180' : ''}`}
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
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedSections.has('general') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <ul className="space-y-1.5">
                    {generalMenuItems.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <li key={item.id}>
                          <Link
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-x-2 py-2.5 px-3 text-sm font-medium rounded-xl transition-colors duration-150 ${
                              active
                                ? "bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 text-indigo-700 dark:text-indigo-300"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700/50"
                            }`}
                          >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                    <li>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-x-2 py-2.5 px-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      >
                        <svg
                          className="size-5"
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
              </div>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeHandleRef}
          onMouseDown={handleMouseDown}
          className={`hidden lg:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 w-3 h-16 cursor-col-resize rounded-lg transition-all duration-200 group ${
            isResizing 
              ? "bg-gradient-to-b from-indigo-500 to-indigo-600 scale-110 shadow-lg shadow-indigo-500/50" 
              : "bg-gradient-to-b from-indigo-200 to-indigo-300 dark:from-indigo-700 dark:to-indigo-800 hover:from-indigo-400 hover:to-indigo-500 dark:hover:from-indigo-600 dark:hover:to-indigo-700 hover:scale-105 hover:shadow-md"
          }`}
          style={{ 
            zIndex: 60,
            touchAction: "none"
          }}
          aria-label="Resize sidebar"
        >
          {/* Visual indicator dots */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex flex-col gap-1.5">
              <div className="w-1 h-1 rounded-full bg-white dark:bg-gray-200 shadow-sm"></div>
              <div className="w-1 h-1 rounded-full bg-white dark:bg-gray-200 shadow-sm"></div>
              <div className="w-1 h-1 rounded-full bg-white dark:bg-gray-200 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
      {/* End Sidebar */}
    </>
  );
};

export default Sidebar;
