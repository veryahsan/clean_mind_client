import axios from "axios";

const appointmentsApi = axios.create({
  baseURL: "/api/appointments/",
  headers: {
    "Content-Type": "application/json",
  },
});

appointmentsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch appointments for the current user (member or specialist).
 * @returns {Promise<{ data: { data: Array } }>}
 */
export const getAppointments = () => appointmentsApi.get("");

/**
 * Create an appointment request (member sends to specialist).
 * @param {Object} payload - { specialist: number, scheduled_at: string (ISO), appointment_type?: string, duration_minutes?: number }
 * @returns {Promise<{ data: Object }>}
 */
export const createAppointment = (payload) => appointmentsApi.post("", payload);

export default appointmentsApi;
