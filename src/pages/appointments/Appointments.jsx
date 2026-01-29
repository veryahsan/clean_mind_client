import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAppointments } from "../../services/appointmentsApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusCapsule from "../../components/common/StatusCapsule";
import { useCard } from "../../context/CardContext"; // used by AppointmentCard

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

const AppointmentCard = ({ appointment }) => {
  const { Card, CardHeader, CardBody } = useCard();
  const specialistName =
    appointment.specialist?.username || "Specialist";
  const status = appointment.status || "pending";
  const variant = STATUS_VARIANTS[status] || "info";
  const statusLabel = appointment.status_display || status;

  const cardContent = (
    <>
      <CardHeader className="!py-4 !px-5 !border-b !border-neutral-100 dark:!border-neutral-800">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-white truncate tracking-tight">
            {specialistName}
          </h2>
          <StatusCapsule label={statusLabel} variant={variant} size="sm" />
        </div>
      </CardHeader>
      <CardBody className="!py-4 !px-5">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500 dark:text-neutral-400 font-medium">Date & time</dt>
            <dd className="text-neutral-900 dark:text-white text-right">
              {formatScheduledAt(appointment.scheduled_at)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500 dark:text-neutral-400 font-medium">Type</dt>
            <dd className="text-neutral-900 dark:text-white">
              {appointment.appointment_type_display || appointment.appointment_type || "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-neutral-500 dark:text-neutral-400 font-medium">Duration</dt>
            <dd className="text-neutral-900 dark:text-white">
              {appointment.duration_minutes ?? 60} min
            </dd>
          </div>
        </dl>
      </CardBody>
    </>
  );

  return (
    <Card
      cardContent={cardContent}
      className="!p-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow transition-shadow"
    />
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
    <div className="min-h-screen w-full bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-8">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Appointments
            </h1>
            <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400 max-w-xl">
              Manage your medical appointments and schedule new ones.
            </p>
          </div>
          <Link
            to="/explore-doctors"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors shadow-sm shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book new appointment
          </Link>
        </header>
        <div className="h-px bg-neutral-200 dark:bg-neutral-800 mb-8" aria-hidden />

        {appointments.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 py-16 px-6 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              You have no appointments yet.
            </p>
            <Link
              to="/explore-doctors"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
            >
              Book from Explore Doctors →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2" aria-label="Appointments list">
            {appointments.map((apt) => (
              <li key={apt.id}>
                <AppointmentCard appointment={apt} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Appointments;
