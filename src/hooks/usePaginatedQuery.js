/**
 * Generic data-fetching hook for paginated API requests.
 *
 * Works with the standard paginated envelope:
 *   { success, data: [], pagination: { page, pageSize, total, totalPages, hasNext, hasPrev } }
 *
 * @example
 *   const {
 *     data,
 *     pagination,
 *     loading,
 *     error,
 *     setPage,
 *     setPageSize,
 *     refetch,
 *   } = usePaginatedQuery(adminApi, "members/", {
 *     page: 1,
 *     pageSize: 10,
 *     filters: { status: "active" },
 *   });
 */

import { useState, useEffect, useCallback, useRef } from "react";

const EMPTY_PAGINATION = Object.freeze({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0,
  hasNext: false,
  hasPrev: false,
});

/**
 * Normalize pagination from API (supports camelCase and snake_case).
 * Fills in totalPages when the server sends total + pageSize but omits totalPages.
 */
function normalizePagination(raw, fallbackPage, fallbackPageSize) {
  if (!raw || typeof raw !== "object") {
    return { ...EMPTY_PAGINATION, page: fallbackPage, pageSize: fallbackPageSize };
  }

  const pageSize =
    raw.pageSize ?? raw.page_size ?? fallbackPageSize;
  const page = raw.page ?? fallbackPage;
  const total = raw.total ?? 0;

  let totalPages = raw.totalPages ?? raw.total_pages;
  if ((!totalPages || totalPages < 1) && total > 0 && pageSize > 0) {
    totalPages = Math.max(1, Math.ceil(total / pageSize));
  }
  if (!totalPages || totalPages < 1) {
    totalPages = 0;
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: Boolean(raw.hasNext ?? raw.has_next ?? false),
    hasPrev: Boolean(raw.hasPrev ?? raw.has_prev ?? false),
  };
}

/**
 * @param {import("axios").AxiosInstance} apiClient – preconfigured axios instance
 * @param {string}  endpoint   – relative URL
 * @param {object}  [options]
 * @param {number}  [options.page]       – initial page (1-indexed, default 1)
 * @param {number}  [options.pageSize]   – initial page size (default 10, max 10 on API)
 * @param {object}  [options.filters]    – additional query params (changing triggers refetch)
 * @param {boolean} [options.enabled]    – if false, skip automatic fetch (default: true)
 * @returns {{
 *   data: any[],
 *   pagination: typeof EMPTY_PAGINATION,
 *   loading: boolean,
 *   error: string|null,
 *   page: number,
 *   pageSize: number,
 *   setPage: (n: number) => void,
 *   setPageSize: (n: number) => void,
 *   refetch: () => Promise<void>,
 * }}
 */
const usePaginatedQuery = (apiClient, endpoint, options = {}) => {
  const {
    page: initialPage = 1,
    pageSize: initialPageSize = 10,
    filters = {},
    enabled = true,
  } = options;

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);
  const abortRef = useRef(null);

  // Reset to page 1 when filters or pageSize change
  const prevFiltersKey = useRef(filtersKey);
  const prevPageSize = useRef(pageSize);

  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey || prevPageSize.current !== pageSize) {
      prevFiltersKey.current = filtersKey;
      prevPageSize.current = pageSize;
      setPage(1);
    }
  }, [filtersKey, pageSize]);

  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(endpoint, {
        params: { page, page_size: pageSize, ...filters },
        signal: controller.signal,
      });

      const body = response.data;

      if (body && body.success) {
        const rows = Array.isArray(body.data) ? body.data : [];
        setData(rows);

        let meta = normalizePagination(body.pagination, page, pageSize);

        // Legacy: envelope had no `pagination` key — infer from this page only
        if (
          body.pagination == null &&
          rows.length > 0 &&
          meta.total === 0
        ) {
          const ps = meta.pageSize || pageSize;
          meta = {
            ...meta,
            total: rows.length,
            totalPages: Math.max(1, Math.ceil(rows.length / ps)),
            hasNext: rows.length >= ps,
            hasPrev: page > 1,
          };
        }

        setPagination(meta);
      } else if (body && body.success === false) {
        setError(body.message || "Request failed");
        setData([]);
        setPagination(EMPTY_PAGINATION);
      } else {
        // Non-enveloped — treat the whole body as data array
        setData(Array.isArray(body) ? body : []);
        setPagination(EMPTY_PAGINATION);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return;
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "An unexpected error occurred";
      setError(msg);
      setData([]);
      setPagination(EMPTY_PAGINATION);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiClient, endpoint, page, pageSize, filtersKey]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchData();

    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchData, enabled]);

  return {
    data,
    pagination,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    refetch: fetchData,
  };
};

export default usePaginatedQuery;
