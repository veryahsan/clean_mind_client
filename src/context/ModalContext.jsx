/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = useCallback((content) => {
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
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full relative transform transition-all duration-300 ${
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
