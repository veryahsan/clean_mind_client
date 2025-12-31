import React from "react";
import { useModal } from "../context/ModalContext";

const LogoutModal = ({ onConfirm }) => {
  const { closeModal } = useModal();

  const handleConfirmLogout = () => {
    closeModal();
    setTimeout(() => {
      if (onConfirm) {
        onConfirm();
      }
    }, 150);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Sign Out
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to sign out? You'll need to sign in again to access your account.
      </p>

      <div className="flex gap-3">
        <button
          onClick={closeModal}
          className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmLogout}
          className="flex-1 px-4 py-2.5 rounded-full text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
