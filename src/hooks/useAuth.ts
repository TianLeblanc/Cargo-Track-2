import { useAuth as useAuthContext } from '../context/AuthContext';
import { UserRole } from '../types/authTypes';

export const useAuth = () => {
  const context = useAuthContext();
  
  const hasRole = (roles: UserRole[]) => {
    if (!context.user) return false;
    return roles.includes(context.user.role);
  };

  const isAdmin = hasRole(['admin']);
  const isEmpleado = hasRole(['empleado']);
  const isCliente = hasRole(['cliente']);
  
  return {
    ...context,
    hasRole, 
    isAdmin,
    isEmpleado,
    isCliente
  };
};