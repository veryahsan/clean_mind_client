import React from "react";
import StatusCapsule from "../../../components/common/StatusCapsule";
import { getMediaUrl } from "../../../utils/imageUtils";

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

const StarRating = ({ rating, max = 5 }) => {
  if (rating == null) return null;

  const rounded = Math.round(Number(rating));

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: max }, (_, idx) => (
          <svg
            key={idx}
            className={`w-4 h-4 ${
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
      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );
};

const DoctorCard = ({ doctor, selected, onSelect }) => {
  const displayName =
    [doctor.first_name, doctor.last_name].filter(Boolean).join(" ") ||
    doctor.username ||
    "Doctor";

  const specialistType =
    doctor.specialist_type_display || doctor.specialist_type || "Specialist";

  const availabilityStatus = doctor.availability_status || "offline";
  const statusVariant = AVAILABILITY_VARIANTS[availabilityStatus] || "info";
  const statusLabel = AVAILABILITY_LABELS[availabilityStatus] || availabilityStatus;

  const headshotUrl = getMediaUrl(doctor.headshot);

  // Optional fields if backend provides them
  const rating =
    doctor.reviews_summary?.average_rating ?? doctor.average_rating ?? null;

  const feeText =
    doctor.fee_range_display ||
    doctor.consultation_fee_display ||
    doctor.price_range_display ||
    null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-xl transition-all px-3 py-3 sm:px-3.5 sm:py-3 bg-white dark:bg-neutral-900 flex gap-3 items-stretch ${
        selected
          ? "border border-teal-500 shadow-sm"
          : "border border-neutral-200 dark:border-neutral-800 hover:border-teal-200 dark:hover:border-teal-700 hover:shadow-sm"
      }`}
    >
      <div className="shrink-0 flex items-start">
        {headshotUrl ? (
          <img
            src={headshotUrl}
            alt={displayName}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-600"
          />
        ) : (
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center ring-2 ring-teal-100 dark:ring-teal-800/60">
            <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[13px] sm:text-sm font-semibold text-neutral-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="mt-0.5 text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {specialistType}
            </p>
          </div>
          {rating != null && (
            <div className="hidden sm:flex flex-col items-end gap-0.5">
              <StarRating rating={rating} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <StatusCapsule
            label={statusLabel}
            variant={statusVariant}
            size="sm"
            className="px-1.5 py-0.5 text-[11px]"
          />
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
            {doctor.has_existing_appointment && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Existing patient
              </span>
            )}
            {feeText && (
              <span className="font-medium text-neutral-700 dark:text-neutral-200">
                {feeText}
              </span>
            )}
          </div>
        </div>

        {doctor.email && (
          <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400 truncate">
              {doctor.email}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

export default DoctorCard;

