import { useState, createContext, useEffect } from "react";
import { verifyaccessToken, verifyrefreshToken } from "./services/auth.api.js";
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
          console.log("New user data after refresh:", newUserData);
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

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
