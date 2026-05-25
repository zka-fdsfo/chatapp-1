
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // Token expired
    if (
      error.response?.status === 401 &&
      error.response?.data?.expired &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        // Refresh token route
        await api.post("/auth/refresh-token");

        // Retry old request
        return api(originalRequest);

      } catch (refreshError) {

        // Refresh token failed
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;