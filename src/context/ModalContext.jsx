/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ModalContext = createContext();
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = useCallback((content) => {
    if (!content) {
      console.error("ModalContext: openModal called with no content");
      return;
    }
    setModalContent(content);
    setIsClosing(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setModalContent(null);
      setIsClosing(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (modalContent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [modalContent]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalContent }}>
      {children}
      {modalContent && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white dark:bg-gray-900 rounded-2xl relative transform transition-all duration-300 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col ${
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: 'fit-content',
              minWidth: 'min(320px, 90vw)',
              maxWidth: '90vw'
            }}
          >
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              {modalContent}
            </div>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
