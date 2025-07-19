import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
