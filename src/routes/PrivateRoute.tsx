import { Navigate, ReactNode } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spin } from 'antd';

interface PrivateRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireVIP?: boolean;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requireAuth = false,
  requireVIP = false,
  requireAdmin = false
}) => {
  const { user, loading, isLogin, isVIP, isAdmin } = useAuth();

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (requireAuth && !isLogin) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  if (requireVIP && !isVIP) {
    return <Navigate to="/no-permission" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/no-permission" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;