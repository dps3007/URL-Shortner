import axios from "axios";

export const BACKEND_URL = "https:url-shortner-backend-irr2.onrender.com";

const axiosInstance = axios.create({ baseURL: BACKEND_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
