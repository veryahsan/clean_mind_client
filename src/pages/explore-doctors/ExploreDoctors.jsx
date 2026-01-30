import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "../../services/exploreApi";
import { getMediaUrl } from "../../utils/imageUtils";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Table from "../../components/common/Table";
import StatusCapsule from "../../components/common/StatusCapsule";
import { useModal } from "../../context/ModalContext";

const AVAILABILITY_VARIANTS = {
  available: "success",
  offline: "info",
  "on-leave": "warning",
  "in-emergency": "danger",
};

const AVAILABILITY_LABELS = {
  available: "Available",
  offline: "Offline",
  "on-leave": "On Leave",
  "in-emergency": "In Emergency",
};

const DoctorCell = ({ doctor }) => {
  const displayName =
    [doctor.first_name, doctor.last_name].filter(Boolean).join(" ") ||
    doctor.username;
  const headshotUrl = getMediaUrl(doctor.headshot);
  return (
    <div className="flex items-center gap-3">
      {headshotUrl ? (
        <img
          src={headshotUrl}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-600 shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center ring-2 ring-teal-100 dark:ring-teal-800/50 shrink-0">
          <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <span className="font-medium text-neutral-900 dark:text-white truncate">
        {displayName}
      </span>
    </div>
  );
};

const ExploreDoctors = () => {
  const { openModal } = useModal();
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

  const allDoctorsColumns = useMemo(
    () => [
      {
        key: "doctor",
        label: "Doctor",
        render: (_, row) => <DoctorCell doctor={row} />,
        className: "min-w-[200px]",
      },
      {
        key: "specialist_type_display",
        label: "Type",
        render: (val, row) =>
          row.specialist_type_display || row.specialist_type || "Specialist",
      },
      {
        key: "availability_status",
        label: "Status",
        render: (val, row) => {
          const status = row.availability_status || "offline";
          const variant = AVAILABILITY_VARIANTS[status] || "info";
          const label = AVAILABILITY_LABELS[status] || status;
          return <StatusCapsule label={label} variant={variant} size="sm" />;
        },
      },
      {
        key: "actions",
        label: "Actions",
        render: (_, row) => {
          const displayName =
            [row.first_name, row.last_name].filter(Boolean).join(" ") ||
            row.username;
          const headshotUrl = getMediaUrl(row.headshot);
          const handleQuickLook = (e) => {
            e.preventDefault();
            openModal(
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight">
                  {displayName}
                </h3>
                <div className="flex items-center gap-5">
                  {headshotUrl ? (
                    <img
                      src={headshotUrl}
                      alt={displayName}
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-600 shadow-md shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center ring-2 ring-teal-100 dark:ring-teal-800/50 shadow-md shrink-0">
                      <span className="text-2xl font-semibold text-teal-700 dark:text-teal-400">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-base font-medium text-neutral-700 dark:text-neutral-300">
                      {row.specialist_type_display || row.specialist_type || "Specialist"}
                    </p>
                    <div className="mt-2">
                      <StatusCapsule
                        label={AVAILABILITY_LABELS[row.availability_status || "offline"]}
                        variant={AVAILABILITY_VARIANTS[row.availability_status] || "info"}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
                {row.email && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    {row.email}
                  </p>
                )}
              </div>,
              { width: "400px" }
            );
          };
          return (
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#"
                onClick={handleQuickLook}
                className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 underline hover:text-teal-700 dark:hover:text-teal-300 text-sm"
              >
                Quick look
              </a>
              <Link
                to={`/profile/doctor/${row.id}`}
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                Profile
              </Link>
            </div>
          );
        },
        className: "whitespace-nowrap",
      },
    ],
    [openModal]
  );

  const yourDoctorsColumns = useMemo(
    () => [
      {
        key: "doctor",
        label: "Doctor",
        render: (_, row) => <DoctorCell doctor={row} />,
        className: "min-w-[160px]",
      },
      {
        key: "specialist_type_display",
        label: "Type",
        render: (val, row) =>
          row.specialist_type_display || row.specialist_type || "Specialist",
      },
      {
        key: "availability_status",
        label: "Status",
        render: (val, row) => {
          const status = row.availability_status || "offline";
          const variant = AVAILABILITY_VARIANTS[status] || "info";
          const label = AVAILABILITY_LABELS[status] || status;
          return <StatusCapsule label={label} variant={variant} size="sm" />;
        },
      },
    ],
    []
  );

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
          <div className="space-y-4 lg:space-y-6">
            <section
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden min-h-0 flex flex-col"
              aria-labelledby="all-doctors-heading"
            >
              <Table
                columns={allDoctorsColumns}
                data={otherDoctors}
                keyProp="id"
                title="All Doctors"
                subtitle="Browse and book appointments"
                emptyMessage="No other doctors to show."
                className="flex-1 min-h-0 flex flex-col rounded-xl"
              />
            </section>

            <section
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden min-h-0 flex flex-col"
              aria-labelledby="your-doctors-heading"
            >
              <Table
                columns={yourDoctorsColumns}
                data={yourDoctors}
                keyProp="id"
                title="Your Doctors"
                subtitle="Doctors you have appointments with"
                emptyMessage="No appointments yet. Book from the list above."
                className="flex-1 min-h-0 flex flex-col rounded-xl"
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreDoctors;
