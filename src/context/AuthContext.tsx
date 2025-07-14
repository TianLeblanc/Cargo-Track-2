'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type UserRole = 'admin' | 'empleado' | 'cliente';

interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
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
    nombre: string;
    apellido: string;
    telefono: string;
    rol?: UserRole;
  }) => Promise<void>;
  logout: () => void;
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
  const pathname = usePathname();

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error cargando usuario', error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar rol
  const hasRole = useCallback((roles: UserRole[]): boolean => {
    return user ? roles.includes(user.rol) : false;
  }, [user]);

  // Redirección automática según login y rol
  useEffect(() => {
    if (isLoading) return;

    const authPages = ['/signin', '/signup', '/reset-password'];
    const isAuthPage = authPages.includes(pathname);

    if (!user && !isAuthPage) {
      router.push('/signin');
    } else if (user && isAuthPage) {
      const rolePaths: Record<UserRole, string> = {
        admin: '',
        empleado: '/Facturas',
        cliente: '/Paquetes'
      };
      router.push(rolePaths[user.rol] || '/');
    }
  }, [user, pathname, isLoading, router]);

  // 🔐 Login usando base de datos
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'login', email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en login');

      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  // 📝 Registro usando base de datos
  const register = async ({
    email,
    password,
    cedula,
    nombre,
    apellido,
    telefono,
    rol = 'cliente',
  }: {
    email: string;
    password: string;
    cedula: string;
    nombre: string;
    apellido: string;
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
          nombre,
          apellido,
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

  const isAuthenticated = !!user;
  const isAdmin = hasRole(['admin']);
  const isEmpleado = hasRole(['empleado']);
  const isCliente = hasRole(['cliente']);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated,
    isAdmin,
    isEmpleado,
    isCliente,
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
