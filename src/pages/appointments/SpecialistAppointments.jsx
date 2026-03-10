import React, { useState, useEffect } from "react";
import {
  getAppointmentRequests,
  getUpcomingAppointments,
  getPastAppointments,
} from "../../services/appointmentsApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import RequestsSection from "./components/RequestsSection";
import UpcomingSection from "./components/UpcomingSection";
import PastSection from "./components/PastSection";

const SpecialistAppointments = () => {
  const [requests, setRequests] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const [requestsRes, upcomingRes, pastRes] = await Promise.all([
          getAppointmentRequests(),
          getUpcomingAppointments(),
          getPastAppointments(),
        ]);
        if (!cancelled) {
          setRequests(requestsRes.data?.data || []);
          setUpcoming(upcomingRes.data?.data || []);
          setPast(pastRes.data?.data || []);
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
                Patient Appointments
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Review upcoming bookings, accept or cancel requests, and
                negotiate new time slots.
              </p>
            </div>
          </div>
        </header>

        <RequestsSection
          appointments={requests}
          onUpdateAppointment={(id, updated) => {
            setRequests((prev) =>
              prev
                .map((a) => (a.id === id ? updated || null : a))
                .filter(Boolean)
            );
          }}
        />

        <UpcomingSection
          appointments={upcoming}
          onUpdateAppointment={(id, updated) => {
            setUpcoming((prev) =>
              prev
                .map((a) => (a.id === id ? updated || null : a))
                .filter(Boolean)
            );
          }}
        />

        <PastSection
          appointments={past}
          onUpdateAppointment={(id, updated) => {
            setPast((prev) =>
              prev
                .map((a) => (a.id === id ? updated || null : a))
                .filter(Boolean)
            );
          }}
        />
      </div>
    </div>
  );
};

export default SpecialistAppointments;

