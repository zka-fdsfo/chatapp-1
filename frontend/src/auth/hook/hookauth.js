import { useContext } from "react";
import { useEffect, useState } from "react"
import { AuthContext } from "../auth.context.jsx";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import {
  login,
  signup,
  getallusers,
  verifyaccessToken,
  verifyrefreshToken,
  changeinfocurrentuserApi,
  googleAuthApi ,
  searchUsersApi,
} from "../services/auth.api.js";

// Provides authentication state and all auth-related actions for the app.
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

  // Logs in with email and password, then stores the authenticated user.
  const handleLogin = async (email, password ,fcmToken) => {
    setLoading(true);

    try {
      const userData = await login(email, password,fcmToken);

      setUser(userData.user);
    } catch (error) {
    console.error("Login failed:", error);

    throw error; // <-- IMPORTANT
  } finally {
    setLoading(false);
  }
  };

  // Creates a new account and saves the returned user in auth state.
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

  // Fetches the full user list from the backend for the sidebar and chat selection.
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
  // Verifies the current access token and falls back to refresh-token recovery.
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

  // Requests a fresh access token using the refresh-token endpoint.
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

// Updates the current user's profile information and stores the updated user.
const changeinfocurrentuser = async (formData) => {
  setLoading(true);

  try {
    const updatedUser = await changeinfocurrentuserApi(formData);

    setUser(updatedUser);

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user info:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  // Signs in with Google, exchanges the Firebase token with the backend, and stores the user.
  const loginWithGoogle = async () => {
    try {
      // Open Google popup
      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      // Firebase token
      const idToken = await result.user.getIdToken();

      // Send to backend
      const data = await googleAuthApi(idToken);
      setUser(data.user)
      return data;
    } catch (error) {
      console.error("GOOGLE AUTH ERROR:", error);
      console.error(error);
      throw error;
    }
  };
const useSearchUser = () => {
  const [searchUsers, setSearchUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUser = async (query) => {
    if (!query.trim()) {
      setSearchUsers([]);
      return;
    }

    try {
      setLoading(true);

      const data = await searchUsersApi(query);

      setSearchUsers(data);
      return data;
    } catch (error) {
      console.error("Search User Error:", error);
      setSearchUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    searchUsers,
    loading,
    searchUser,
  };
};
  return {
    user,
    currentusernameimg,
    setUser,
    loginWithGoogle,
    useSearchUser,
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