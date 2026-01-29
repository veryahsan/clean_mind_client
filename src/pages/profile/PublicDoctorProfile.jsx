import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDoctorPublicProfile } from "../../services/exploreApi";
import { getMediaUrl } from "../../utils/imageUtils";
import Loader from "../../components/common/Loader";
import StatusCapsule from "../../components/common/StatusCapsule";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import AppointmentRequestModal from "../explore-doctors/components/AppointmentRequestModal";

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
  const sizeClass = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          className={`${sizeClass} ${i < rating ? "text-amber-500" : "text-neutral-200 dark:text-neutral-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-4 py-4 text-left font-medium text-neutral-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset rounded-lg"
      aria-expanded={isOpen}
    >
      <span className="pr-2">{faq.question}</span>
      <svg
        className={`shrink-0 w-5 h-5 text-neutral-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div className="pb-4 pl-0 pr-8 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
        {faq.answer}
      </div>
    )}
  </div>
);

const PublicDoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openModal, closeModal } = useModal();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFaqId, setOpenFaqId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDoctorPublicProfile(id);
        if (!cancelled && res?.data?.data) {
          setProfile(res.data.data);
        } else if (!cancelled && res?.data) {
          setProfile(res.data);
        }
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
    if (id) fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center">
          <p className="text-red-700 dark:text-red-300 font-medium">
            {error || "Doctor not found."}
          </p>
          <Link
            to={isAuthenticated ? "/explore-doctors" : "/"}
            className="mt-4 inline-block text-teal-600 dark:text-teal-400 hover:underline font-medium"
          >
            ← Back to {isAuthenticated ? "Explore Doctors" : "Home"}
          </Link>
        </div>
      </div>
    );
  }

  const displayName =
    profile.full_name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    "Doctor";
  const specialistType =
    profile.specialist_type_display || profile.specialist_type || "Specialist";
  const availabilityStatus = profile.availability_status || "offline";
  const variant = AVAILABILITY_VARIANTS[availabilityStatus] || "info";
  const statusLabel =
    AVAILABILITY_LABELS[availabilityStatus] || availabilityStatus;
  const headshotUrl = getMediaUrl(profile.headshot);
  const joinedDate = profile.date_joined
    ? new Date(profile.date_joined).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null;
  const faqs = profile.profile_faqs || [];
  const documents = profile.public_documents || [];
  const reviews = profile.reviews || [];
  const reviewsSummary = profile.reviews_summary || { average_rating: null, total_count: 0 };

  const handleGetAppointment = () => {
    if (!isAuthenticated) {
      navigate(`/login?next=/profile/doctor/${profile.id}`);
      return;
    }
    openModal(
      <AppointmentRequestModal
        doctor={profile}
        onSuccess={closeModal}
        onClose={closeModal}
      />,
      { width: "520px" }
    );
  };

  const handleMessage = () => {
    if (isAuthenticated) {
      navigate("/messages");
    } else {
      navigate(`/login?next=/profile/doctor/${profile.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <Link
        to={isAuthenticated ? "/explore-doctors" : "/"}
        className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium mb-6"
      >
        <span aria-hidden>←</span>
        Back to {isAuthenticated ? "Explore Doctors" : "Home"}
      </Link>

      {/* Hero / Header */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden mb-8">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            <div className="shrink-0">
              {headshotUrl ? (
                <img
                  src={headshotUrl}
                  alt={displayName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-2 ring-neutral-200 dark:ring-neutral-600 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center ring-2 ring-teal-100 dark:ring-teal-800/50 shadow-md">
                  <span className="text-4xl sm:text-5xl font-semibold text-teal-700 dark:text-teal-400">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                {displayName}
              </h1>
              <p className="mt-1 text-lg text-neutral-600 dark:text-neutral-400">
                {specialistType}
              </p>
              <div className="mt-3">
                <StatusCapsule label={statusLabel} variant={variant} size="md" />
              </div>
              {joinedDate && (
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Member since {joinedDate}
                </p>
              )}
              {/* CTA Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGetAppointment}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 shadow-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Get appointment
                </button>
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleMessage}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & location (phone and/or address) */}
      {(profile.phone || profile.address) && (
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact & location
            </h2>
            <div className="space-y-3">
              {profile.phone && (
                <p className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                  <span className="text-neutral-500 dark:text-neutral-400 text-sm font-medium w-14 shrink-0">Phone</span>
                  <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="text-teal-600 dark:text-teal-400 hover:underline">
                    {profile.phone}
                  </a>
                </p>
              )}
              {profile.address && (
                <p className="text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                  <span className="text-neutral-500 dark:text-neutral-400 text-sm font-medium w-14 shrink-0">Address</span>
                  <span className="whitespace-pre-line leading-relaxed">{profile.address}</span>
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bio */}
      {profile.bio && (
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
              About
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden mb-8">
        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Reviews
            {reviewsSummary.total_count != null && reviewsSummary.total_count > 0 && (
              <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400 ml-2">
                ({reviewsSummary.total_count} {reviewsSummary.total_count === 1 ? "review" : "reviews"})
              </span>
            )}
          </h2>
          {reviewsSummary.total_count > 0 ? (
            <>
              <div className="flex items-center gap-3 mb-6">
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
                      <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                        {r.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              No reviews yet.
            </p>
          )}
        </div>
      </section>

      {/* Profile FAQs */}
      {faqs.length > 0 && (
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {faqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openFaqId === faq.id}
                  onToggle={() =>
                    setOpenFaqId((prev) => (prev === faq.id ? null : faq.id))
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Documents gallery */}
      {documents.length > 0 && (
        <section className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documents & credentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 p-4 hover:border-teal-300 dark:hover:border-teal-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                      <svg className="w-5 h-5 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900 dark:text-white text-sm">
                        {doc.document_type_display}
                      </p>
                      {doc.document_file_url && (
                        <a
                          href={doc.document_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium"
                        >
                          View document
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PublicDoctorProfile;
