import { useState, useEffect, useRef } from "react";

export const useFileUpload = (options = {}) => {
  const { maxSize = 5 * 1024 * 1024, acceptedTypes = ['image/*'] } = options;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      return;
    }

    // Validate file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(`${baseType}/`);
      }
      return file.type === type;
    });

    if (!isValidType) {
      setError(`Please select a valid image file. Accepted types: ${acceptedTypes.join(', ')}`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      setError(`Image size must be less than ${maxSizeMB}MB.`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setError(null);
  };

  return {
    selectedFile,
    previewUrl,
    error,
    fileInputRef,
    handleFileChange,
    clearFile,
    setError,
  };
};


