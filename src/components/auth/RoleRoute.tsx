import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { UnauthorizedPage } from '../../pages/auth/UnauthorizedPage';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <UnauthorizedPage />;
  }

  return children ? <>{children}</> : <Outlet />;
};
