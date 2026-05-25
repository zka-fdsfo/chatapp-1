import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const login = async (email, password) => {
  console.log(email, password, "from api");
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(
  error.response?.data?.message || "Login failed"
);
  }
};

export const signup = async (name, email, password) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
throw new Error(
  error.response?.data?.message || "Login failed"
);
  }
};

export const getallusers = async () => {
    try {
        const response = await api.get("/users/allusers");
        return response.data;
    } catch (error) {
        throw new Error(
  error.response?.data?.message || "Login failed"
);
    }
};
export const verifyaccessToken = async () => {
  try {
    const response = await api.get("/auth/verify-token");
    return response.data;
  } catch (error) {
    throw new Error(
  error.response?.data?.message || "unauthorized"
);
  }
}

export const verifyrefreshToken = async () => {
  try {
 await api.get("/auth/refresh-token");
  } catch (error) {
    throw new Error(
  error.response?.data?.message || "unauthorized"
);
  }
}