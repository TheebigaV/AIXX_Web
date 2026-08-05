import axios from "axios";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  // Increase timeout for slower local/back-end responses
  // to reduce spurious Axios timeout errors during development.
  timeout: 30000,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = window.localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      window.localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export default api;
