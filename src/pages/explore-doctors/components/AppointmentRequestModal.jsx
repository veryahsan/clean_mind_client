import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/ModalContext";
import { createAppointment } from "../../../services/appointmentsApi";
import ConfirmationModal from "../../../modals/ConfirmationModal";

const APPOINTMENT_TYPES = [
  { value: "consultation", label: "Consultation" },
  { value: "follow_up", label: "Follow-up" },
  { value: "therapy_session", label: "Therapy Session" },
  { value: "assessment", label: "Assessment" },
  { value: "emergency", label: "Emergency" },
];

const SuccessIcon = () => (
  <svg
    className="w-14 h-14 text-green-500 mx-auto"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const FailIcon = () => (
  <svg
    className="w-14 h-14 text-red-500 mx-auto"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const AppointmentRequestModal = ({ doctor, onSuccess, onClose }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [scheduledAt, setScheduledAt] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const displayName =
    [doctor?.first_name, doctor?.last_name].filter(Boolean).join(" ") ||
    doctor?.username ||
    "Doctor";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!scheduledAt) {
      setError("Please choose a date.");
      return;
    }
    setSubmitting(true);
    try {
      // Backend expects datetime: use selected date at 09:00 local
      const scheduledDateTime = new Date(`${scheduledAt}T09:00:00`);
      await createAppointment({
        specialist: doctor.id,
        scheduled_at: scheduledDateTime.toISOString(),
        appointment_type: appointmentType,
        duration_minutes: durationMinutes,
      });
      openModal(
        <ConfirmationModal
          icon={<SuccessIcon />}
          message="Your appointment request has been sent successfully."
          buttonText="OK"
          variant="success"
          onConfirm={() => {
            navigate("/appointments");
            onSuccess?.();
          }}
        />
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.scheduled_at?.[0] ||
        err.message ||
        "Failed to send appointment request.";
      openModal(
        <ConfirmationModal
          icon={<FailIcon />}
          message={message}
          buttonText="OK"
          variant="danger"
        />
      );
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = (() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  })();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
          Request appointment
        </h3>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          with {displayName}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="scheduled_at"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Date
          </label>
          <input
            id="scheduled_at"
            type="date"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            min={minDate}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
            required
          />
        </div>
        <div>
          <label
            htmlFor="appointment_type"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Type
          </label>
          <select
            id="appointment_type"
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
          >
            {APPOINTMENT_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="duration_minutes"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Duration (minutes)
          </label>
          <input
            id="duration_minutes"
            type="number"
            min={15}
            max={120}
            step={15}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value) || 60)}
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
          />
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 shadow-sm"
          >
            {submitting ? "Sending…" : "Send request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentRequestModal;
