import { useAuth } from '../hook/hookauth';
import { Navigate } from "react-router-dom";
import AppSkeleton from '../components/AppSkeleton.jsx';

const Provider = ({ children }) => {
  const { user, loading, authReady } = useAuth();

  if (!authReady || loading) {
    return (
      <div className="h-full bg-zinc-950 p-2">
        <AppSkeleton />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default Provider;