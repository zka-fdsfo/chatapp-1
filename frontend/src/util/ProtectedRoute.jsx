import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, loading, children }) => {
  // Wait until token verification finishes
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;