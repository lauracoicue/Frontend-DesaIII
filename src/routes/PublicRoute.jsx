import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  // Si ya está logueado, redirige al Home
  if (user) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;