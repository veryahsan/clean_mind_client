import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAppointments } from "../../services/appointmentsApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusCapsule from "../../components/common/StatusCapsule";

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

const AppointmentRow = ({ appointment }) => {
  const specialistName =
    appointment.specialist?.username || "Specialist";
  const status = appointment.status || "pending";
  const variant = STATUS_VARIANTS[status] || "info";
  const statusLabel = appointment.status_display || status;

  return (
    <div className="flex flex-wrap items-center gap-4 py-4 px-4 sm:px-5 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-neutral-900 dark:text-white truncate">
          {specialistName}
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
          {formatScheduledAt(appointment.scheduled_at)}
        </p>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-neutral-600 dark:text-neutral-300">
          {appointment.appointment_type_display || appointment.appointment_type || "—"}
        </span>
        <span className="text-neutral-500 dark:text-neutral-400">
          {appointment.duration_minutes ?? 60} min
        </span>
        <StatusCapsule label={statusLabel} variant={variant} size="sm" />
      </div>
    </div>
  );
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAppointments();
        if (!cancelled && res?.data?.data) {
          setAppointments(res.data.data);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err.response?.data?.message ||
            err.message ||
            "Failed to load appointments.";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAppointments();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} fullScreen />;

  return (
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-neutral-950">
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-5 py-5 space-y-4">
        <header className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4 sm:px-5 sm:py-4 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Appointments
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Manage your medical appointments and schedule new ones.
              </p>
            </div>
            <Link
              to="/explore-doctors"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors shadow-sm shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Book new appointment
            </Link>
          </div>
        </header>

        {appointments.length === 0 ? (
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 py-12 px-4 text-center shadow-sm"
            aria-label="No appointments"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
              You have no appointments yet.
            </p>
            <Link
              to="/explore-doctors"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
            >
              Book from Explore Doctors →
            </Link>
          </section>
        ) : (
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
            aria-label="Appointments list"
          >
            <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {appointments.map((apt) => (
                <li key={apt.id}>
                  <AppointmentRow appointment={apt} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default Appointments;
