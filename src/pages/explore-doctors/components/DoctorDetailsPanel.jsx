import React, { useEffect, useMemo, useState } from "react";
import { getDoctorPublicProfile } from "../../../services/exploreApi";
import { getMediaUrl } from "../../../utils/imageUtils";
import Loader from "../../../components/common/Loader";
import ErrorMessage from "../../../components/common/ErrorMessage";
import StatusCapsule from "../../../components/common/StatusCapsule";
import { useModal } from "../../../context/ModalContext";
import AppointmentRequestModal from "./AppointmentRequestModal";

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

const StarRating = ({ rating, max = 5, size = "md" }) => {
  if (rating == null) return null;
  const rounded = Math.round(Number(rating));
  const sizeClass =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";

  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: max }, (_, idx) => (
        <svg
          key={idx}
          className={`${sizeClass} ${
            idx < rounded
              ? "text-amber-500"
              : "text-neutral-200 dark:text-neutral-700"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Chip = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200">
    {children}
  </span>
);

const Section = ({ title, children }) => (
  <section className="pt-2">
    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
      {title}
    </h3>
    <div className="mt-3">{children}</div>
  </section>
);

const DoctorDetailsPanel = ({ doctorId }) => {
  const { openModal, closeModal } = useModal();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      if (!doctorId) return;
      setProfile(null);
      setLoading(true);
      setError(null);
      try {
        const res = await getDoctorPublicProfile(doctorId);
        const data = res?.data?.data ?? res?.data ?? null;
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Could not load doctor profile."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  const displayName = useMemo(() => {
    if (!profile) return "Doctor";
    return (
      profile.full_name ||
      [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      profile.username ||
      "Doctor"
    );
  }, [profile]);

  const specialistType = useMemo(() => {
    if (!profile) return "Specialist";
    return (
      profile.specialist_type_display || profile.specialist_type || "Specialist"
    );
  }, [profile]);

  const availabilityStatus = profile?.availability_status || "offline";
  const statusVariant = AVAILABILITY_VARIANTS[availabilityStatus] || "info";
  const statusLabel = AVAILABILITY_LABELS[availabilityStatus] || availabilityStatus;
  const headshotUrl = profile ? getMediaUrl(profile.headshot) : null;

  const reviews = profile?.reviews || [];
  const reviewsSummary =
    profile?.reviews_summary || { average_rating: null, total_count: 0 };

  const handleBook = () => {
    if (!profile) return;
    openModal(
      <AppointmentRequestModal
        doctor={profile}
        onSuccess={closeModal}
        onClose={closeModal}
      />,
      { width: "720px" }
    );
  };

  if (!doctorId) {
    return (
      <div className="flex flex-1 items-center justify-center text-center px-6">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Select a doctor from the list to see details here.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[320px]">
        <Loader />
      </div>
    );
  }

  if (error || !profile) {
    return <ErrorMessage message={error || "Doctor not found."} />;
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* Header / hero */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            <div className="shrink-0">
              {headshotUrl ? (
                <img
                  src={headshotUrl}
                  alt={displayName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-600 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center ring-2 ring-teal-100 dark:ring-teal-800/60 shadow-md">
                  <span className="text-4xl font-semibold text-teal-700 dark:text-teal-400">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                    {displayName}
                  </h2>
                  <p className="mt-1 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                    {specialistType}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <StatusCapsule label={statusLabel} variant={statusVariant} size="md" />
                    {reviewsSummary?.total_count > 0 && (
                      <div className="flex items-center gap-2">
                        <StarRating
                          rating={Math.round(reviewsSummary.average_rating)}
                          size="sm"
                        />
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {reviewsSummary.average_rating}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          ({reviewsSummary.total_count})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBook}
                  className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
                >
                  Book an appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      {profile.bio && (
        <Section title="About">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
            {profile.bio}
          </p>
        </Section>
      )}

      {/* Education / Certificates / Specialty procedures (best-effort based on available fields) */}
      {(profile.education || profile.certificate || profile.speciality_procedures || profile.specialty_procedures) && (
        <Section title="Credentials">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {profile.education && (
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50/60 dark:bg-neutral-800/30">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Education
                </p>
                <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                  {profile.education}
                </p>
              </div>
            )}
            {profile.certificate && (
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 bg-neutral-50/60 dark:bg-neutral-800/30">
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                  Certificate
                </p>
                <p className="mt-1 text-neutral-800 dark:text-neutral-200">
                  {profile.certificate}
                </p>
              </div>
            )}
          </div>
          {(profile.speciality_procedures || profile.specialty_procedures) && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                Specialty procedures
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {String(profile.speciality_procedures || profile.specialty_procedures)
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Contact */}
      {(profile.phone || profile.address || profile.email) && (
        <Section title="Contact">
          <div className="space-y-2 text-sm">
            {profile.email && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-neutral-500 dark:text-neutral-400 w-16 shrink-0">
                  Email
                </span>
                <span className="text-neutral-800 dark:text-neutral-200 break-all">
                  {profile.email}
                </span>
              </div>
            )}
            {profile.phone && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-neutral-500 dark:text-neutral-400 w-16 shrink-0">
                  Phone
                </span>
                <span className="text-neutral-800 dark:text-neutral-200">
                  {profile.phone}
                </span>
              </div>
            )}
            {profile.address && (
              <div className="flex items-start gap-2">
                <span className="text-neutral-500 dark:text-neutral-400 w-16 shrink-0">
                  Address
                </span>
                <span className="text-neutral-800 dark:text-neutral-200 whitespace-pre-line">
                  {profile.address}
                </span>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Reviews */}
      <Section title={`Reviews${reviewsSummary?.total_count ? ` (${reviewsSummary.total_count})` : ""}`}>
        {reviewsSummary?.total_count > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <StarRating rating={Math.round(reviewsSummary.average_rating)} size="lg" />
              <span className="text-xl font-semibold text-neutral-900 dark:text-white">
                {reviewsSummary.average_rating}
              </span>
            </div>
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="border-t border-neutral-100 dark:border-neutral-800 pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={r.rating} size="sm" />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {r.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No reviews yet.
          </p>
        )}
      </Section>
    </div>
  );
};

export default DoctorDetailsPanel;

