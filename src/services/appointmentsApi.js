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
 * Fetch pending appointment requests for the current user.
 * @returns {Promise<{ data: { data: Array } }>}
 */
export const getAppointmentRequests = () => appointmentsApi.get("requests/");

/**
 * Fetch upcoming appointments for the current user.
 * @returns {Promise<{ data: { data: Array } }>}
 */
export const getUpcomingAppointments = () => appointmentsApi.get("upcoming/");

/**
 * Fetch past appointments for the current user.
 * @returns {Promise<{ data: { data: Array } }>}
 */
export const getPastAppointments = () => appointmentsApi.get("past/");

/**
 * Create an appointment request (member sends to specialist).
 * @param {Object} payload - {
 *   specialist: number,
 *   appointment_type: string,
 *   duration_minutes: number,
 *   proposed_start_at: string (ISO),
 *   proposed_end_at: string (ISO),
 *   proposed_fee?: string|number
 * }
 * @returns {Promise<{ data: Object }>}
 */
export const createAppointment = (payload) => appointmentsApi.post("", payload);

/**
 * Update an appointment (e.g. status change).
 * @param {number} id
 * @param {Object} payload
 * @returns {Promise<{ data: Object }>}
 */
export const updateAppointment = (id, payload) =>
  appointmentsApi.patch(`${id}/`, payload);

/**
 * Delete an appointment.
 * @param {number} id
 * @returns {Promise<void>}
 */
export const deleteAppointment = (id) => appointmentsApi.delete(`${id}/`);

/**
 * Create a negotiation proposal for an appointment.
 * @param {number} appointmentId
 * @param {{ proposed_start_at: string, proposed_end_at: string, proposed_fee?: string|number }} payload
 * @returns {Promise<{ data: Object }>}
 */
export const createNegotiation = (appointmentId, payload) =>
  appointmentsApi.post(`${appointmentId}/negotiations/`, payload);

export default appointmentsApi;
