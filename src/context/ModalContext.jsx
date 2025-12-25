/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setIsClosing(false);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModalContent(null);
      setIsClosing(false);
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalContent && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full relative transform transition-transform duration-300 ${
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
