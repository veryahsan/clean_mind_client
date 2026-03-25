/**
 * Generic data-fetching hook for non-paginated API requests.
 *
 * Works with the standard envelope: { success, data, message }
 *
 * @example
 *   const { data, loading, error, refetch } = useQuery(dashboardApi, "/");
 *
 *   // With query params
 *   const filters = useMemo(() => ({ status: "active" }), []);
 *   const { data } = useQuery(adminApi, "members/", { params: filters });
 *
 *   // Skip initial fetch (call refetch manually)
 *   const { data, refetch } = useQuery(moodApi, "today/", { enabled: false });
 */

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * @param {import("axios").AxiosInstance} apiClient  – preconfigured axios instance
 * @param {string}  endpoint   – relative URL (appended to apiClient.baseURL)
 * @param {object}  [options]
 * @param {object}  [options.params]   – query parameters (changing them triggers refetch)
 * @param {boolean} [options.enabled]  – if false, skip the automatic fetch (default: true)
 * @returns {{ data: any, loading: boolean, error: string|null, refetch: () => Promise<void> }}
 */
const useQuery = (apiClient, endpoint, options = {}) => {
  const { params = {}, enabled = true } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  // Keep a stable reference to the latest params for the dep array.
  const paramsKey = JSON.stringify(params);

  // Abort controller ref so in-flight requests are cancelled on re-render.
  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancel any previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(endpoint, {
        params,
        signal: controller.signal,
      });

      const body = response.data;

      // Standard envelope: { success, data, message }
      if (body && typeof body === "object" && "success" in body) {
        if (body.success) {
          setData(body.data);
        } else {
          setError(body.message || "Request failed");
        }
      } else {
        // Non-enveloped response (e.g. third-party endpoints)
        setData(body);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return;
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "An unexpected error occurred";
      setError(msg);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiClient, endpoint, paramsKey]);

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

  return { data, loading, error, refetch: fetchData };
};

export default useQuery;
