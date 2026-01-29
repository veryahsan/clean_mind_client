import axios from "axios";

const exploreApi = axios.create({
  baseURL: "/api/auth/",
  headers: {
    "Content-Type": "application/json",
  },
});

exploreApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch all doctors/specialists for the explore section.
 * @returns {Promise<{ data: Array }>} Response with data array of specialist profiles
 */
export const getDoctors = () => exploreApi.get("explore-doctors/");

/**
 * Fetch public profile for a single doctor/specialist.
 * @param {number|string} doctorId - The doctor's user ID
 * @returns {Promise<{ data: object }>} Response with public profile data
 */
export const getDoctorPublicProfile = (doctorId) =>
  exploreApi.get(`profile/${doctorId}/`);

export default exploreApi;
