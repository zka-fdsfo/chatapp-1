import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip auth endpoints
    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/verify-token");
      

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get("/auth/refresh-token");

        processQueue(null);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        // clear local state if needed
        localStorage.clear();

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
export const login = async (email, password,fcmToken) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
      fcmToken
    });

    return response.data;
 } catch (error) {
    console.log("API ERROR:", error.response?.status);

    throw {
      status: error.response?.status,
      message:
        error.response?.data?.message || "Login failed",
    };
  }
};

export const signup = async (formData) => {
  try {
    const response = await api.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const getallusers = async () => {
  try {
    const response = await api.get("/users/allusers");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
export const verifyaccessToken = async () => {
  try {
    const response = await api.get("/auth/verify-token");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "unauthorized");
  }
};

export const verifyrefreshToken = async () => {
  try {
    await api.get("/auth/refresh-token");
  } catch (error) {
    throw new Error(error.response?.data?.message || "unauthorized");
  }
};

export const getallchatusers = async (userId) => {
  try {
    const response = await api.get("/messages/chatusers", {
      params: {
        userId,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch messages",
    );
  }
};

export const sendMessage = async (formData) => {
  try {
    console.log("working")
    const response = await api.post("/messages/send",
      formData
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to send message");
  }
};

export const markAsSeen = async (senderId) => {
  try {
    const response = await api.put("/messages/seen", { senderId });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to mark message as seen",
    );
  }
};

export const changeinfocurrentuserApi = async (formData) => {
  try {
    const response = await api.put("/users/changecurrentuserinfo", formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update user information",
    );
  }
};

export const getImageMessagesApi = async (selectedUserId) => {
  try {
    const response = await api.get("/messages/image-messages", {
      params: {
        selectedUserId,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch image messages",
    );
  }
};

export const googleAuthApi = async (idToken) => {
  const response = await api.post(
    "/auth/google",
    { idToken },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const Fcmtokenget = async (token) => {
  const response = await api.put("/users/getFcmToken", {
    token,
  });

  return response;
};