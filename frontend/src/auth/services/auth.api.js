import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Don't intercept refresh-token request itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        await api.get("/auth/refresh-token");

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export const login = async (email, password) => {
  console.log(email, password, "from api");
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
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

export const sendMessage = async (receiverId, content) => {
  try {
    const response = await api.post("/messages/send", {
      receiver: receiverId,
      text: content,
    });
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