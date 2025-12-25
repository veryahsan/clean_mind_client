import React from "react";
import { Email, Phone, LocationOn } from "@mui/icons-material";
import { useModal } from "../context/ModalContext";

const ContactModal = () => {
  const { closeModal } = useModal();

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Contact Information
      </h3>

      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <Email className="text-indigo-600" />
          <a href="mailto:info@example.com" className="underline">
            dev.ahsan.mehmood@gmail.com
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="text-indigo-600" />
          <a href="tel:+1234567890" className="underline">
            +92 303 4658867
          </a>
        </div>

        <div className="flex items-center gap-3">
          <LocationOn className="text-indigo-600" />
          <span>Model Town, Lahore, Pakistan</span>
        </div>
      </div>

      <button
        onClick={closeModal}
        className="mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-full text-sm hover:bg-indigo-700 transition"
      >
        Close
      </button>
    </div>
  );
};

export default ContactModal;
