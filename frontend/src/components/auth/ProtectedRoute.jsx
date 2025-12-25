import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0) {
    const userRoles = user?.roles || (user?.role ? [user.role] : []);
    const allowed = userRoles.some((r) => roles.includes(r));
    if (!allowed) return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
