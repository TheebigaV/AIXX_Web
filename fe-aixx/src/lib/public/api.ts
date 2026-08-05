import axios from "axios";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: false,
});

export default api;