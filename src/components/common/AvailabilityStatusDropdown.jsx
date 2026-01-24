import React, { useState, useEffect, useRef } from "react";
import profileApi from "../../services/profileApi";
import { useAuth } from "../../context/AuthContext";

const AvailabilityStatusDropdown = ({ 
  currentStatus, 
  onStatusChange, 
  className = "",
  size = "sm" // sm, md, lg
}) => {
  const { user, updateUser } = useAuth();
  const [availabilityStatus, setAvailabilityStatus] = useState(currentStatus || user?.availability_status || 'offline');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync with prop if it changes
  useEffect(() => {
    if (currentStatus) {
      setAvailabilityStatus(currentStatus);
    }
  }, [currentStatus]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleAvailabilityChange = async (newStatus) => {
    if (isUpdating || newStatus === availabilityStatus) {
      setIsDropdownOpen(false);
      return;
    }
    
    try {
      setIsUpdating(true);
      setIsDropdownOpen(false);
      const formData = new FormData();
      formData.append('availability_status', newStatus);
      
      const response = await profileApi.patch("", formData);
      const responseData = response.data;
      const updatedData = responseData.success && responseData.data ? responseData.data : responseData;
      
      setAvailabilityStatus(newStatus);
      
      // Update user context if needed
      if (updatedData && updateUser) {
        updateUser({
          ...user,
          availability_status: newStatus,
        });
      }

      // Call the callback if provided
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (err) {
      console.error("Failed to update availability status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-green-700 dark:text-green-400 border-green-300 dark:border-green-600';
      case 'on-leave':
        return 'text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-600';
      case 'in-emergency':
        return 'text-red-700 dark:text-red-400 border-red-300 dark:border-red-600';
      default:
        return 'text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'on-leave':
        return 'On Leave';
      case 'in-emergency':
        return 'In Emergency';
      default:
        return 'Offline';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'pl-7 pr-7 py-1.5 text-xs';
      case 'md':
        return 'pl-8 pr-8 py-2 text-sm';
      case 'lg':
        return 'pl-9 pr-9 py-2.5 text-base';
      default:
        return 'pl-7 pr-7 py-1.5 text-xs';
    }
  };

  const getDotSize = () => {
    switch (size) {
      case 'sm':
        return 'w-2 h-2';
      case 'md':
        return 'w-2.5 h-2.5';
      case 'lg':
        return 'w-3 h-3';
      default:
        return 'w-2 h-2';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isUpdating && setIsDropdownOpen(!isDropdownOpen)}
        disabled={isUpdating}
        className={`
          flex items-center gap-2 ${getSizeClasses()} rounded-md border font-medium
          focus:outline-none focus:ring-1 focus:ring-offset-1
          transition-all duration-150
          bg-white dark:bg-gray-800 shadow-sm
          ${getStatusColor(availabilityStatus)}
          ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-pointer'}
        `}
      >
        {/* Status Indicator Dot */}
        <div className={`
          absolute left-2 ${getDotSize()} rounded-full
          ${availabilityStatus === 'available' ? 'bg-green-500' :
            availabilityStatus === 'on-leave' ? 'bg-yellow-500' :
            availabilityStatus === 'in-emergency' ? 'bg-red-500' :
            'bg-gray-400'}
        `} />
        <span>{getStatusLabel(availabilityStatus)}</span>
        {/* Dropdown Arrow */}
        <svg 
          className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isDropdownOpen && !isUpdating && (
        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {[
            { value: 'offline', label: 'Offline', color: 'bg-gray-400' },
            { value: 'available', label: 'Available', color: 'bg-green-500' },
            { value: 'on-leave', label: 'On Leave', color: 'bg-yellow-500' },
            { value: 'in-emergency', label: 'In Emergency', color: 'bg-red-500' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAvailabilityChange(option.value)}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-xs font-medium
                transition-colors duration-150
                ${availabilityStatus === option.value
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              <div className={`w-2 h-2 rounded-full ${option.color}`} />
              <span>{option.label}</span>
              {availabilityStatus === option.value && (
                <svg className="w-3 h-3 ml-auto text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
      
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-800/70 rounded-md">
          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityStatusDropdown;
