import React from "react";
import StatusCapsule from "../../../components/common/StatusCapsule";
import {
  updateAppointment,
  deleteAppointment,
  createNegotiation,
} from "../../../services/appointmentsApi";

const STATUS_VARIANTS = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
  completed: "info",
  no_show: "danger",
  rescheduled: "info",
};

function formatScheduledAt(isoString) {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const SpecialistAppointmentRow = ({ appointment, onUpdateLocal, mode = "default", onViewDetail }) => {
  const counterpartUser = appointment.member;

  const patientName =
    [counterpartUser?.first_name, counterpartUser?.last_name]
      .filter(Boolean)
      .join(" ") ||
    counterpartUser?.username ||
    "Patient";

  const status = appointment.status || "pending";
  const variant = STATUS_VARIANTS[status] || "info";
  const statusLabel = appointment.status_display || status;

  const canModify = ["pending", "confirmed", "rescheduled"].includes(status);
  const showAccept = status === "pending";
  const showMarkDone = ["confirmed", "rescheduled"].includes(status);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateAppointment(appointment.id, { status: newStatus });
      const updated = res.data?.data || res.data;
      onUpdateLocal(updated);
    } catch (err) {
      console.error("Failed to update appointment status:", err);
      alert(
        err.response?.data?.message ||
          "Failed to update appointment. Please try again."
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      await deleteAppointment(appointment.id);
      onUpdateLocal(null); // signal removal
    } catch (err) {
      console.error("Failed to delete appointment:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete appointment. Please try again."
      );
    }
  };

  const handleNegotiate = async () => {
    if (!canModify) return;

    const dateInput = window.prompt(
      "Enter proposed date (YYYY-MM-DD) for the new slot:",
      appointment.scheduled_at ? appointment.scheduled_at.slice(0, 10) : ""
    );
    if (!dateInput) return;

    const timeInput = window.prompt(
      "Enter proposed time (HH:MM, 24h) for the new slot:",
      "09:00"
    );
    if (!timeInput) return;

    const [hours, minutes] = timeInput.split(":").map((v) => parseInt(v, 10));
    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      alert("Invalid time format. Please use HH:MM (24h).");
      return;
    }

    const start = new Date(dateInput);
    start.setHours(hours, minutes, 0, 0);
    const duration = appointment.duration_minutes ?? 60;
    const end = new Date(start.getTime() + duration * 60000);

    try {
      await createNegotiation(appointment.id, {
        proposed_start_at: start.toISOString(),
        proposed_end_at: end.toISOString(),
      });
      alert("Negotiation proposal sent successfully.");
    } catch (err) {
      console.error("Failed to create negotiation:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.proposed_start_at?.[0] ||
        err.response?.data?.errors?.proposed_end_at?.[0] ||
        "Failed to send negotiation proposal.";
      alert(message);
    }
  };

  const memberNote = appointment.member_note;
  const latestProposedFee = appointment.latest_proposed_fee;
  // Only show the richer negotiation strip on non-request views.
  const showRequestMeta = status === "pending" && mode !== "request";

  const avatarSrc = counterpartUser?.headshot || null;

  return (
    <div className="flex flex-col gap-3 py-3 px-3 sm:px-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex-shrink-0">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={patientName}
              className="h-10 w-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-teal-600/10 text-teal-700 dark:text-teal-300 flex items-center justify-center text-sm font-semibold border border-teal-500/30">
              {patientName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-neutral-900 dark:text-white truncate">
            {patientName}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {appointment.appointment_type_display ||
              appointment.appointment_type ||
              "—"}{" "}
            • {appointment.duration_minutes ?? 60} min
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {formatScheduledAt(appointment.scheduled_at)}
          </p>
        </div>
      </div>

      {showRequestMeta && (memberNote || latestProposedFee) && (
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-3">
          <div className="flex-1">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Notes from patient
            </p>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-xs text-neutral-800 dark:text-neutral-100 min-h-[48px]">
              {memberNote ? (
                <span className="whitespace-pre-wrap">{memberNote}</span>
              ) : (
                <span className="text-neutral-400">No additional notes.</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center px-2 sm:px-0">
            <svg
              className="w-4 h-4 text-neutral-400 mb-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
              <polyline points="18 9 12 3 6 9" />
            </svg>
            <span className="text-[10px] uppercase tracking-wide text-neutral-400">
              negotiation
            </span>
          </div>

          <div className="w-full sm:w-40">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              Proposed amount
            </p>
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-900/30 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-100 flex items-center justify-between">
              <span className="font-semibold">
                {latestProposedFee ? `$${latestProposedFee}` : "Not specified"}
              </span>
              <svg
                className="w-4 h-4 text-emerald-600 dark:text-emerald-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 9 12 3 6 9" />
                <polyline points="6 15 12 21 18 15" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm mt-1">
        <div className="sm:order-2 flex justify-start sm:justify-end">
          <StatusCapsule label={statusLabel} variant={variant} size="sm" />
        </div>
        <div className="sm:order-1 flex flex-wrap gap-2 justify-start sm:justify-start">
          {mode === "request" ? (
            <>
              {showAccept && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("confirmed")}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Accept
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => onViewDetail && onViewDetail(appointment)}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-800 text-white hover:bg-neutral-900"
              >
                View details
              </button>
            </>
          ) : (
            <>
              {showAccept && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("confirmed")}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Accept
                </button>
              )}
              {showMarkDone && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("completed")}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Mark done
                </button>
              )}
              {status !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("cancelled")}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-600 text-white hover:bg-amber-700"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={handleNegotiate}
                disabled={!canModify}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
              >
                Negotiate
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialistAppointmentRow;

