import React, { useState, useEffect, useMemo } from "react";
import { getDoctors } from "../../services/exploreApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import DoctorBar from "./components/DoctorBar";
import YourDoctors from "./components/YourDoctors";

const ExploreDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDoctors();
        if (!cancelled && res?.data?.data) {
          setDoctors(res.data.data);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err.response?.data?.message ||
            err.message ||
            "Failed to load doctors.";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDoctors();
    return () => {
      cancelled = true;
    };
  }, []);

  const { yourDoctors, otherDoctors } = useMemo(() => {
    const your = doctors.filter((d) => d.has_existing_appointment === true);
    const other = doctors.filter((d) => d.has_existing_appointment !== true);
    return { yourDoctors: your, otherDoctors: other };
  }, [doctors]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} fullScreen />;

  return (
    <div className="min-h-screen w-full bg-neutral-100 dark:bg-neutral-950">
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-5 py-5 space-y-4">
        <header className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4 sm:px-5 sm:py-4 shadow-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                Explore Doctors
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                Find and connect with licensed healthcare professionals.
              </p>
            </div>
            {doctors.length > 0 && (
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {doctors.length} available
              </p>
            )}
          </div>
        </header>

        {doctors.length === 0 ? (
          <section
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 py-12 px-4 text-center shadow-sm"
            aria-label="No doctors"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              No doctors are available at the moment. Check back later.
            </p>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <section
              className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden min-h-0"
              aria-labelledby="all-doctors-heading"
            >
              <div className="px-4 py-3 sm:px-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                <h2 id="all-doctors-heading" className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                  All Doctors
                </h2>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Browse and book appointments
                </p>
              </div>
              <div className="overflow-auto min-h-0">
                {otherDoctors.length > 0 ? (
                  <ul className="divide-y divide-neutral-100 dark:divide-neutral-800" aria-label="All doctors list">
                    {otherDoctors.map((doctor) => (
                      <li key={doctor.id}>
                        <DoctorBar doctor={doctor} showProfile />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 py-6 px-4 text-center">
                    No other doctors to show.
                  </p>
                )}
              </div>
            </section>

            <section
              className="lg:col-span-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden min-h-0 flex flex-col"
              aria-labelledby="your-doctors-heading"
            >
              <div className="px-4 py-3 sm:px-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 shrink-0">
                <h2 id="your-doctors-heading" className="text-base font-semibold tracking-tight text-neutral-900 dark:text-white">
                  Your Doctors
                </h2>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Doctors you have appointments with
                </p>
              </div>
              <div className="p-4 sm:p-5 overflow-auto flex-1 min-h-0">
                {yourDoctors.length > 0 ? (
                  <YourDoctors doctors={yourDoctors} />
                ) : (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 py-4 text-center">
                    No appointments yet. Book from the list on the left.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreDoctors;
