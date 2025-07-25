'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';

type UserRole = 'admin' | 'empleado' | 'cliente';

interface Usuario {
  id: number;
  cedula: string;
  p_nombre: string;
  s_nombre: string;
  p_apellido: string;
  s_apellido: string;
  email: string;
  telefono: string;
  rol: UserRole;
}

interface AuthContextType {
  user: Usuario | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    cedula: string;
    p_nombre: string;
    s_nombre: string;
    p_apellido: string;
    s_apellido: string;
    telefono: string;
    rol?: UserRole;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<Usuario>) => void;
  hasRole: (roles: UserRole[]) => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmpleado: boolean;
  isCliente: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ✅ Cargar desde localStorage (solo en cliente)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Error leyendo localStorage:', err);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = (userData: Partial<Usuario>) => {
    if (!user) return;
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const hasRole = useCallback(
    (roles: UserRole[]): boolean => !!user && roles.includes(user.rol),
    [user]
  );

  // ✅ Redirección segura por rol y autenticación
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;

    const currentPath = window.location.pathname;
    const authPages = ['/signin', '/signup', '/reset-password'];
    const isAuthPage = authPages.includes(currentPath);

    if (!user && !isAuthPage) {
      router.replace('/signin');
    }

    if (user && isAuthPage) {
      const rolePaths: Record<UserRole, string> = {
        admin: '/Almacenes',
        empleado: '/Paquete',
        cliente: '/Envios',
      };
      const target = rolePaths[user.rol] || '/';
      if (currentPath !== target) {
        router.replace(target);
      }
    }
  }, [user, isLoading, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'login', email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data.error || 'Error en login') as Error & {
          status: number;
        };
        error.status = res.status;
        throw error;
      }

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async ({
    email,
    password,
    cedula,
    p_nombre,
    s_nombre,
    p_apellido,
    s_apellido,
    telefono,
    rol = 'cliente',
  }: {
    email: string;
    password: string;
    cedula: string;
    p_nombre: string;
    s_nombre: string;
    p_apellido: string;
    s_apellido: string;
    telefono: string;
    rol?: UserRole;
  }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'register',
          email,
          password,
          cedula,
          p_nombre,
          s_nombre,
          p_apellido,
          s_apellido,
          telefono,
          rol,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en registro');

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/signin');
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAuthenticated: !!user,
    isAdmin: hasRole(['admin']),
    isEmpleado: hasRole(['empleado']),
    isCliente: hasRole(['cliente']),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
