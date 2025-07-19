'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

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

  const updateUser = (userData: Partial<Usuario>) => {
  if (!user) return;
  
  // Actualiza solo los campos proporcionados
  const updatedUser = { ...user, ...userData };
  
  // Actualiza el estado y el localStorage
  setUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser));
};

  // Verificar rol
  const hasRole = useCallback((roles: UserRole[]): boolean => {
    return user ? roles.includes(user.rol) : false;
  }, [user]);

  
  // Redirección automática según login y rol
  useEffect(() => {
    if (isLoading) return;

    const authPages = ['/signin', '/signup', '/reset-password'];
    // Normalizar pathname para evitar errores de coincidencia
    const cleanPath = pathname?.split('?')[0] || '';
    const isAuthPage = authPages.includes(cleanPath);

    // Solo redirigir a /signin si no estamos ya en /signin
    if (!user && !isAuthPage && cleanPath !== '/signin') {
      router.push('/signin');
    } else if (user && isAuthPage) {
      const rolePaths: Record<UserRole, string> = {
        admin: '',
        empleado: '',
        cliente: ''
      };
      router.push(rolePaths[user.rol] || '/');
    }
  }, [user, pathname, isLoading, router]);

  // 🔐 Login usando base de datos
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'login', email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setIsLoading(false);
      // Lanzar error con status para que el formulario lo capture
      const error = new Error(data.error || 'Error en login') as Error & { status: number };
      error.status = res.status;
      throw error;

    }

    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    setIsLoading(false);
  };

  // 📝 Registro usando base de datos
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
    updateUser,
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
