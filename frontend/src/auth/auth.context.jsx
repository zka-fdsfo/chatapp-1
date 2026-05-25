import {
  useState,
  createContext,
  useEffect,
  useMemo,
} from "react";

import {
  verifyaccessToken,
  verifyrefreshToken,
} from "./services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const userData = await verifyaccessToken();

        setUser(userData.user);
      } catch (error) {
        try {
          await verifyrefreshToken();

          const newUserData = await verifyaccessToken();

          setUser(newUserData.user);
        } catch (error) {
          console.error("Token verification failed:", error);

          setUser(null);
        }
      } finally {
        setAuthReady(true);
       
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  // FIX
  const value = useMemo(() => ({
    user,
    setUser,
    loading,
    setLoading,
    authReady,
  }), [user, loading, authReady]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};