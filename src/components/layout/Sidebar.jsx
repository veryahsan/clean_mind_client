import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
const DEFAULT_SIDEBAR_WIDTH = 256;
const COLLAPSE_THRESHOLD = 220; // Width below which sidebar shows only icons
const COLLAPSED_WIDTH = 80; // Width when showing only icons
const DEFAULT_EXPANDED_SECTIONS = new Set(menuSections.map((s) => s.id));

const MenuItem = ({ item, isActive, isCollapsed, onClose }) => (
  <Link
    to={item.path}
    onClick={onClose}
    className={`flex items-center ${
      isCollapsed ? "justify-center" : "gap-x-2"
    } py-2.5 ${
      isCollapsed ? "px-2" : "px-3"
    } text-sm font-medium rounded-xl transition-colors duration-150 ${
      isActive
        ? "bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 text-indigo-700 dark:text-indigo-300"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700/50"
    }`}
    title={isCollapsed ? item.name : undefined}
  >
    <span className={isCollapsed ? "text-xl" : ""}>{item.icon}</span>
    {!isCollapsed && <span>{item.name}</span>}
  </Link>
);

const CollapsedProfile = ({
  user,
  generalMenuItems,
  isActive,
  onClose,
  handleLogoutClick,
}) => (
  <div className="flex flex-col items-center gap-4">
    <UserAvatar
      username={user?.username}
      headshot={user?.headshot}
      has_headshot={user?.has_headshot}
      size={44}
      availability_status={user?.role === 'specialist' ? user?.availability_status : undefined}
    />

    <ul className="space-y-2 w-full">
      {generalMenuItems.map((item) => (
        <li key={item.id}>
          <MenuItem
            item={item}
            isActive={isActive(item.path)}
            isCollapsed={true}
            onClose={onClose}
          />
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center py-2.5 px-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500/20"
          title="Sign out"
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
        </button>
      </li>
    </ul>
  </div>
);

const ExpandedProfile = ({
  user,
  generalMenuItems,
  expandedSections,
  toggleSection,
  isActive,
  onClose,
  handleLogoutClick,
}) => (
  <>
    <button
      type="button"
      onClick={() => toggleSection("general")}
      className="w-full flex items-center justify-between gap-3 mb-4 hover:bg-gray-50 dark:hover:bg-neutral-800/50 rounded-lg p-2 -m-2 transition-colors duration-150"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <UserAvatar
            username={user?.username}
            headshot={user?.headshot}
            has_headshot={user?.has_headshot}
            size={44}
            availability_status={user?.role === 'specialist' ? user?.availability_status : undefined}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate text-left">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.username || "User"}
          </p>
          {user?.email && (
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5 text-left">
              {user.email}
            </p>
          )}
        </div>
      </div>
      <svg
        className={`size-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ${
          expandedSections.has("general") ? "rotate-180" : ""
        }`}
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
        expandedSections.has("general")
          ? "max-h-96 opacity-100"
          : "max-h-0 opacity-0"
      }`}
    >
      <ul className="space-y-1.5">
        {generalMenuItems.map((item) => (
          <li key={item.id}>
            <MenuItem
              item={item}
              isActive={isActive(item.path)}
              isCollapsed={false}
              onClose={onClose}
            />
          </li>
        ))}
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
  </>
);

const Sidebar = ({ isOpen, onClose, sidebarWidth, setSidebarWidth }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { openModal } = useModal();
  const [isResizing, setIsResizing] = useState(false);
  const [tempWidth, setTempWidth] = useState(null);
  const sidebarRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches
  );

  // Determine if sidebar should show in collapsed/icon-only mode
  const isCollapsed = useMemo(() => {
    return isDesktop && sidebarWidth < COLLAPSE_THRESHOLD;
  }, [isDesktop, sidebarWidth]);

  // Track user's manual expand/collapse preferences
  const [userExpandedSections, setUserExpandedSections] = useState(
    () => DEFAULT_EXPANDED_SECTIONS
  );

  // Merge route-based expansion with user preferences
  const expandedSections = useMemo(() => {
    const merged = new Set(userExpandedSections);
    const activePath = location.pathname;

    menuSections.forEach((section) => {
      if (section.items.some((item) => item.path === activePath)) {
        merged.add(section.id);
      }
    });

    if (generalMenuItems.some((item) => item.path === activePath)) {
      merged.add("general");
    }

    return merged;
  }, [userExpandedSections, location.pathname]);

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

  // Handle expand button click when collapsed
  const handleExpandClick = useCallback(() => {
    if (isCollapsed) {
      setSidebarWidth(DEFAULT_SIDEBAR_WIDTH);
      localStorage.setItem(SIDEBAR_WIDTH_KEY, DEFAULT_SIDEBAR_WIDTH.toString());
    }
  }, [isCollapsed, setSidebarWidth]);

  // Check if we're on desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
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

      // Snap to collapsed width if dragging below threshold
      let clampedWidth;
      if (newWidth < COLLAPSE_THRESHOLD) {
        clampedWidth = COLLAPSED_WIDTH;
      } else {
        clampedWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, newWidth)
        );
      }

      setSidebarWidth(clampedWidth);
      setTempWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Only save to localStorage on mouse up
      if (tempWidth !== null) {
        localStorage.setItem(SIDEBAR_WIDTH_KEY, tempWidth.toString());
        setTempWidth(null);
      }
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
  }, [isResizing, setSidebarWidth, tempWidth]);

  // Toggle section expand/collapse
  const toggleSection = useCallback(
    (sectionId) => {
      if (isCollapsed) return;

      setUserExpandedSections((prev) => {
        const newSet = new Set(prev);

        // Check if this section contains the active route
        const activePath = location.pathname;
        let hasActiveRoute = false;

        if (sectionId === "general") {
          hasActiveRoute = generalMenuItems.some(
            (item) => item.path === activePath
          );
        } else {
          const section = menuSections.find((s) => s.id === sectionId);
          hasActiveRoute = section?.items.some(
            (item) => item.path === activePath
          );
        }

        // Don't allow collapsing if this section contains the active route
        if (hasActiveRoute) {
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
    },
    [isCollapsed, location.pathname]
  );

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
          width: isDesktop
            ? `${sidebarWidth || DEFAULT_SIDEBAR_WIDTH}px`
            : undefined,
        }}
        role="dialog"
        tabIndex="-1"
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header
            className={`p-4 flex ${
              isCollapsed ? "justify-center" : "justify-between"
            } items-center gap-x-2 border-b border-gray-200/60 dark:border-neutral-700/60 bg-gradient-to-r from-indigo-50/30 to-transparent dark:from-indigo-900/10`}
          >
            <Link
              to="/dashboard"
              className={`flex-none font-semibold text-xl text-gray-900 focus:outline-none focus:opacity-80 dark:text-white flex items-center ${
                isCollapsed ? "gap-0" : "gap-2.5"
              }`}
              aria-label="Brand"
              onClick={onClose}
            >
              <img src={Logo} alt="CleanMind Logo" className="h-8 w-auto" />
              {!isCollapsed && <span>CleanMind</span>}
            </Link>

            {!isCollapsed && (
              <div className="lg:hidden -me-2">
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
            )}
          </header>

          {/* Body */}
          <nav className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-indigo-300/60 hover:[&::-webkit-scrollbar-thumb]:bg-indigo-400/80 dark:[&::-webkit-scrollbar-thumb]:bg-indigo-600/40 dark:hover:[&::-webkit-scrollbar-thumb]:bg-indigo-500/60 transition-colors">
            <div
              className={`pb-0 ${
                isCollapsed ? "px-2" : "px-3"
              } w-full flex flex-col flex-wrap`}
            >
              {menuSections.map((section) => {
                const isExpanded = expandedSections.has(section.id);
                return (
                  <div key={section.id} className="mb-6">
                    {!isCollapsed && (
                      <button
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-150"
                      >
                        <span>{section.title}</span>
                        <svg
                          className={`size-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
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
                    )}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        !isCollapsed && isExpanded
                          ? "max-h-96 opacity-100"
                          : isCollapsed
                          ? "max-h-full opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul
                        className={`${
                          isCollapsed ? "space-y-2" : "space-y-1.5"
                        }`}
                      >
                        {section.items.map((item) => (
                          <li key={item.id}>
                            <MenuItem
                              item={item}
                              isActive={isActive(item.path)}
                              isCollapsed={isCollapsed}
                              onClose={onClose}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Profile Section at bottom */}
          <div className="mt-auto border-t border-gray-200/60 dark:border-neutral-700/60 bg-gradient-to-b from-transparent to-gray-50/30 dark:to-neutral-900/30">
            <div className="p-4">
              {isCollapsed ? (
                <CollapsedProfile
                  user={user}
                  generalMenuItems={generalMenuItems}
                  isActive={isActive}
                  onClose={onClose}
                  handleLogoutClick={handleLogoutClick}
                />
              ) : (
                <ExpandedProfile
                  user={user}
                  generalMenuItems={generalMenuItems}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                  isActive={isActive}
                  onClose={onClose}
                  handleLogoutClick={handleLogoutClick}
                />
              )}
            </div>
          </div>
        </div>

        {/* Resize Handle - Minimalist design, transforms to expand arrow when collapsed */}
        {isCollapsed ? (
          /* Expand Arrow Button when collapsed */
          <button
            onClick={handleExpandClick}
            className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 w-5 h-5 items-center justify-center bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all duration-200 cursor-pointer z-[60] group"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <svg
              className="w-2 h-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ) : (
          /* 3-Dot Resize Handle when expanded */
          <div
            ref={resizeHandleRef}
            onMouseDown={handleMouseDown}
            className={`hidden lg:flex absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 cursor-col-resize transition-all duration-200 group ${
              isResizing ? "scale-110" : "hover:scale-125"
            }`}
            style={{
              zIndex: 60,
              touchAction: "none",
            }}
            aria-label="Resize sidebar"
          >
            <div className="flex flex-col gap-1 p-1">
              <div
                className={`w-1 h-1 rounded-full border transition-all duration-200 ${
                  isResizing
                    ? "bg-indigo-400 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-300"
                    : "bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 group-hover:border-gray-600 dark:group-hover:border-gray-300"
                }`}
              />
              <div
                className={`w-1 h-1 rounded-full border transition-all duration-200 ${
                  isResizing
                    ? "bg-indigo-400 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-300"
                    : "bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 group-hover:border-gray-600 dark:group-hover:border-gray-300"
                }`}
              />
              <div
                className={`w-1 h-1 rounded-full border transition-all duration-200 ${
                  isResizing
                    ? "bg-indigo-400 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-300"
                    : "bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 group-hover:border-gray-600 dark:group-hover:border-gray-300"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
