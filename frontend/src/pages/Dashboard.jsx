import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, getDefaultRouteForUser } = useAuth();

  useEffect(() => {
    navigate(getDefaultRouteForUser(user), { replace: true });
  }, [navigate, user, getDefaultRouteForUser]);

  return null;
};

export default Dashboard;
