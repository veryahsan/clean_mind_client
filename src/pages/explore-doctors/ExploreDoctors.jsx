import React, { useState, useEffect, useMemo } from "react";
import exploreApi from "../../services/exploreApi";
import usePaginatedQuery from "../../hooks/usePaginatedQuery";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Paginator from "../../components/common/Paginator";
import DoctorList from "./components/DoctorList";
import DoctorDetailsPanel from "./components/DoctorDetailsPanel";

const ExploreDoctors = () => {
  const {
    data: doctors,
    pagination,
    loading,
    error,
    setPage,
  } = usePaginatedQuery(exploreApi, "explore-doctors/", { pageSize: 5 });

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // Auto-select the first doctor whenever a new page loads
  useEffect(() => {
    if (doctors.length > 0 && !doctors.find((d) => d.id === selectedDoctorId)) {
      setSelectedDoctorId(doctors[0].id);
    }
  }, [doctors, selectedDoctorId]);

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId) || null,
    [doctors, selectedDoctorId]
  );

  if (loading && doctors.length === 0) return <Loader />;
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
            {pagination.total > 0 && (
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {pagination.total} available
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
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 min-h-[480px]">
            <section
              className="lg:w-[40%] rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden min-h-0 flex flex-col"
              aria-label="Doctors list"
            >
              <div className="px-4 py-3 sm:px-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/60">
                <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
                  Choose doctor
                </h2>
                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  Browse specialists and pick one to view details.
                </p>
              </div>
              <DoctorList
                doctors={doctors}
                selectedDoctorId={selectedDoctorId}
                onSelectDoctor={setSelectedDoctorId}
              />
              <Paginator
                pagination={pagination}
                onPageChange={setPage}
                className="border-t border-neutral-100 dark:border-neutral-800"
              />
            </section>

            <section
              className="lg:flex-1 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden min-h-0 flex flex-col"
              aria-label="Selected doctor details"
            >
              <DoctorDetailsPanel doctorId={selectedDoctorId} />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreDoctors;
