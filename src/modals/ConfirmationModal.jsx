import React from "react";
import { useModal } from "../context/ModalContext";

/**
 * Common confirmation popup.
 * @param {React.ReactNode} icon - Icon to show above the message
 * @param {string} message - Message text
 * @param {string} buttonText - Primary action button label
 * @param {function} [onConfirm] - Called when primary button is clicked (then modal closes)
 * @param {string} [cancelButtonText] - If provided, shows a cancel button with this label
 * @param {string} [variant='primary'] - Button style: 'primary' (teal) | 'danger' (red) | 'success' (green)
 */
const ConfirmationModal = ({
  icon,
  message,
  buttonText,
  onConfirm,
  cancelButtonText,
  variant = "primary",
}) => {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal();
  };

  const buttonClasses = {
    primary:
      "bg-teal-600 hover:bg-teal-700 text-white shadow-sm focus:ring-teal-500",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500",
    success:
      "bg-green-600 hover:bg-green-700 text-white shadow-sm focus:ring-green-500",
  };
  const btnClass = buttonClasses[variant] || buttonClasses.primary;

  return (
    <div className="text-center">
      {icon && (
        <div className="flex justify-center mb-5 text-neutral-500 dark:text-neutral-400">
          {icon}
        </div>
      )}
      <p className="text-neutral-700 dark:text-neutral-300 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
        {message}
      </p>
      <div className="flex gap-3 justify-center">
        {cancelButtonText && (
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 max-w-[140px] px-4 py-2.5 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          >
            {cancelButtonText}
          </button>
        )}
        <button
          type="button"
          onClick={handleConfirm}
          className={`flex-1 max-w-[140px] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${btnClass}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
