/**
 * Constructs full URL for backend media files
 * @param {string} mediaPath - Relative path from backend (e.g., /media/headshots/image.jpg)
 * @returns {string|null} Full URL or null if path is empty
 */
export const getMediaUrl = (mediaPath) => {
  if (!mediaPath) return null;
  
  // If it's already a full URL, return as is
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }
  
  // If it's a relative URL, use it directly (Vite proxy will handle it)
  // For production, you might want to use an environment variable
  if (mediaPath.startsWith('/')) {
    return mediaPath;
  }
  
  // If it doesn't start with /, prepend it
  return `/${mediaPath}`;
};

/**
 * Constructs full backend URL for media files (for direct access)
 * @param {string} mediaPath - Relative path from backend
 * @returns {string|null} Full backend URL or null if path is empty
 */
export const getBackendMediaUrl = (mediaPath) => {
  if (!mediaPath) return null;
  
  // If it's already a full URL, return as is
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }
  
  // Construct full backend URL
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  // Ensure mediaPath starts with /
  const path = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  
  return `${backendUrl}${path}`;
};



