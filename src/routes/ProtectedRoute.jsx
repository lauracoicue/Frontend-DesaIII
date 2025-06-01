import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/log_in" replace />;

    // Normalizar roles para comparación
    const userRole = user.role?.toLowerCase();
    const normalizedRequiredRole = requiredRole?.toLowerCase();

    if (requiredRole && userRole !== normalizedRequiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;