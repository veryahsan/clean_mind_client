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

const RequestCard = ({ children }) => (
  <div className="w-full max-w-xl mx-auto rounded-2xl border border-neutral-200/80 dark:border-neutral-700/70 bg-white/90 dark:bg-neutral-900/95 shadow-xl shadow-black/5 dark:shadow-black/40 backdrop-blur-sm">
    {children}
  </div>
);

const AppointmentRequestModal = ({ doctor, onSuccess, onClose }) => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const [scheduledAt, setScheduledAt] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [proposedFee, setProposedFee] = useState("");
  const [notes, setNotes] = useState("");
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
      // Backend expects a proposed start/end slot, not scheduled_at directly.
      // Use selected date at 09:00 local as start, with duration defining the end.
      const startDateTime = new Date(`${scheduledAt}T09:00:00`);
      const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
      const payload = {
        specialist: doctor.id,
        proposed_start_at: startDateTime.toISOString(),
        proposed_end_at: endDateTime.toISOString(),
        appointment_type: appointmentType,
        duration_minutes: durationMinutes,
      };

      const trimmedNotes = notes.trim();
      if (trimmedNotes) {
        payload.notes = trimmedNotes;
      }

      const feeNumber = Number(proposedFee);
      if (!Number.isNaN(feeNumber) && feeNumber > 0) {
        payload.proposed_fee = feeNumber;
      }

      await createAppointment(payload);
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
    <>
      <div className="px-5 pt-5 pb-1 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
            Appointment Request
          </h3>
          <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-300">
            with {displayName}
          </p>
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            Choose a preferred date, suggest a fee, and share context so the specialist can prepare
            before confirming.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="px-5 pb-5 pt-4 space-y-5">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3.5 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="scheduled_at"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Preferred date
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
            <p className="mt-1 text-xs text-neutral-400">
              Exact time can be adjusted later during negotiation.
            </p>
          </div>
          <div>
            <label
              htmlFor="appointment_type"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Session type
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
            <p className="mt-1 text-xs text-neutral-400">
              Pick the option that best matches your need.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <p className="mt-1 text-xs text-neutral-400">
              Most sessions are 45–60 minutes, but you can suggest what you prefer.
            </p>
          </div>
          <div>
            <label
              htmlFor="proposed_fee"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              Proposed fee{" "}
              <span className="text-xs font-normal text-neutral-400">
                (optional)
              </span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                $
              </span>
              <input
                id="proposed_fee"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={proposedFee}
                onChange={(e) => setProposedFee(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white pl-6 pr-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
                placeholder="e.g. 50.00"
              />
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Share what you&apos;re comfortable paying. The specialist can accept or counter this
              offer.
            </p>
          </div>
        </div>
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            Notes for your specialist{" "}
            <span className="text-xs font-normal text-neutral-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Briefly describe what you’d like to talk about, any symptoms, or goals for this session."
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:focus:border-teal-500 transition-colors resize-y"
          />
          <p className="mt-1 text-xs text-neutral-400">
            Up to 500 characters. This is only visible to your specialist.
          </p>
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
    </>
  );
};

export default AppointmentRequestModal;
