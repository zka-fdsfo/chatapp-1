import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";

import {
  login,
  signup,
  getallusers,
  verifyaccessToken,
  verifyrefreshToken,
  changeinfocurrentuserApi,
} from "../services/auth.api.js";

export const useAuth = () => {
  const AuthContextValue = useContext(AuthContext);

  const {
    user,
    setUser,
    loading,
    setLoading,
    authReady,
  } = AuthContextValue;
const currentusernameimg = {
  name: user?.name,
  avatar: user?.avatar,
};
  // LOGIN
  const handleLogin = async (email, password) => {
    setLoading(true);

    try {
      const userData = await login(email, password);

      setUser(userData.user);
    } catch (error) {
    console.error("Login failed:", error);

    throw error; // <-- IMPORTANT
  } finally {
    setLoading(false);
  }
  };

  // SIGNUP
  const handleSignup = async (name, email, password) => {
    setLoading(true);

    try {
      const userData = await signup(name, email, password);

      setUser(userData.user);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // FIXED
  const fetchAllUsers = async () => {
    try {
      const users = await getallusers();

      return users;
    } catch (error) {
      console.error("Failed to fetch users:", error);

      return [];
    }
  };

  // VERIFY ACCESS TOKEN
  // const handleVerifyaccessToken = async () => {
  //   setLoading(true);

  //   try {
  //     const userData = await verifyaccessToken();

  //     setUser(userData);
  //   } catch (error) {
  //     try {
  //       await verifyrefreshToken();
  //       await handleVerifyaccessToken();
  //     } catch (refreshError) {
  //       console.error("Token refresh failed:", refreshError);

  //       setUser(null);
  //     }
  //     finally {

  //     console.error("Token verification failed:", error);

  //     setUser(null);
  //     setLoading(false);
  //   }}

  // };
  const handleVerifyaccessToken = async () => {
  setLoading(true);

  try {
    const userData = await verifyaccessToken();

    setUser(userData.user);
  } catch (error) {
    try {
      await verifyrefreshToken();

      const userData = await verifyaccessToken();

      setUser(userData.user);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);

      setUser(null);
    }
  } finally {
    setLoading(false);
  }
};

  // REFRESH TOKEN
  const refreshUserToken = async () => {
    setLoading(true);

    try {
      await verifyrefreshToken();
    } catch (error) {
      console.error("Token refresh failed:", error);

      setUser(null);
    } finally {
      
      setLoading(false);
    }
  };

const changeinfocurrentuser = async (formData) => {
  setLoading(true);

  try {
    const updatedUser = await changeinfocurrentuserApi(formData);

    console.log(updatedUser);

    setUser(updatedUser);

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user info:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  return {
    user,
    currentusernameimg,
    setUser,
    loading,
    setLoading,
    authReady,
    handleLogin,
    handleSignup,
    fetchAllUsers,
    handleVerifyaccessToken,
    refreshUserToken,
    changeinfocurrentuser,
  };
};