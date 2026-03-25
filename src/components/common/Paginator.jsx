/**
 * Reusable pagination control component.
 *
 * Receives the pagination meta object returned by usePaginatedQuery and
 * renders page navigation controls. Fully stateless — page changes are
 * delegated to the parent via onPageChange / onPageSizeChange callbacks.
 *
 * @example
 *   <Paginator
 *     pagination={pagination}
 *     onPageChange={setPage}
 *     onPageSizeChange={setPageSize}
 *   />
 */

import React, { useMemo } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

/** Matches API cap: at most 10 items per page */
const PAGE_SIZE_OPTIONS = [5, 10];

/**
 * Build the array of page numbers to display.
 * Always shows first, last, current ±1, with "..." ellipsis gaps.
 */
const buildPageNumbers = (current, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages]);

  for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
    pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }

  return result;
};

/**
 * @param {object}   props
 * @param {object}   props.pagination       – { page, pageSize, total, totalPages, hasNext, hasPrev }
 * @param {function} props.onPageChange     – (pageNumber: number) => void
 * @param {function} [props.onPageSizeChange] – (newSize: number) => void  (hides selector if omitted)
 * @param {string}   [props.className]      – extra wrapper classes
 */
const Paginator = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  className = "",
}) => {
  const { page, pageSize, total, totalPages, hasNext } = pagination || {};

  /** Fallback when API omits totalPages but sends total + pageSize */
  const effectiveTotalPages =
    total > 0 && pageSize > 0
      ? Math.max(
          1,
          totalPages && totalPages > 0
            ? totalPages
            : Math.ceil(total / pageSize),
        )
      : totalPages || 0;

  const pageNumbers = useMemo(
    () => buildPageNumbers(page, effectiveTotalPages),
    [page, effectiveTotalPages],
  );

  if (!total || total < 1) return null;
  /** Hide when everything fits on a single page (works for any pageSize, e.g. explore @ 5) */
  if (effectiveTotalPages <= 1) return null;

  const rangeStart = (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 ${className}`}
    >
      {/* Left: summary + page size */}
      <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
        <span>
          {rangeStart}–{rangeEnd} of {total}
        </span>

        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt} / page
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Right: page navigation */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeftIcon fontSize="small" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((entry, idx) =>
          entry === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center text-neutral-400 dark:text-neutral-500 text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? "page" : undefined}
              className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                entry === page
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}
            >
              {entry}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= effectiveTotalPages && !hasNext}
          aria-label="Next page"
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRightIcon fontSize="small" />
        </button>
      </nav>
    </div>
  );
};

export default Paginator;
