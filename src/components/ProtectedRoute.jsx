import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}
