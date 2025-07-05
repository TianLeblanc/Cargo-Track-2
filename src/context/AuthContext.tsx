"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

type UserRole = 'admin' | 'empleado' | 'cliente';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // Solo para desarrollo, no debería estar en producción
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
  }) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmpleado: boolean;
  isCliente: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios de prueba para desarrollo

const mockUsers: User[] = [
  {id: "31216675", name: "Saul Goodman", email: "saul@gmail.com", role: 'admin', password:"12345678"},
  {id: "31667720", name: "Sebas Leblanc", email: "sebacho@gmail.co", role: 'admin', password:"12345678"},
  {id: "30414491", name: "Diego Cacorrazo", email: "diego@cacorro.com", role: 'empleado', password:"12345678"},
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user data", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función para verificar roles
  const hasRole = useCallback((roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  }, [user]);

  // Redirección automática basada en autenticación y roles
  useEffect(() => {
    if (isLoading) return; // Esperar hasta que termine la carga inicial

    const authPages = ["/signin", "/signup", "/reset-password"];
    const isAuthPage = authPages.includes(pathname);

    // Si no hay usuario y no está en página de auth → redirigir a login
    if (!user && !isAuthPage) {
      router.push("/signin");
      return;
    }

    // Si hay usuario y está en página de auth → redirigir según rol
    if (user && isAuthPage) {
      const rolePaths: Record<UserRole, string> = {
        admin: "",
        empleado: "/Facturas",
        cliente: "/Paquetes"
      };
      router.push(rolePaths[user.role] || "/");
    }
  }, [user, pathname, isLoading, router]);

  // Función de login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      return await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Determinar rol basado en el email (para desarrollo)
          
          const mockUser = mockUsers.find(u => u.email === email);
          if (mockUser && password === mockUser.password) {
            const authenticatedUser: User = {
              id: Math.random().toString(36).substr(2, 9),
              email,
              name: mockUser.name,
              role: mockUser.role,
              password: mockUser.password // Solo para desarrollo, no debería estar en producción
            };
            
            setUser(authenticatedUser);
            localStorage.setItem("user", JSON.stringify(authenticatedUser));
            resolve();
          } else {
            reject(new Error("Credenciales incorrectas"));
          }
        }, 500);
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función de registro
  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
  }) => {
    setIsLoading(true);
    try {
      return await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (!userData.email || !userData.password) {
            reject(new Error("Email y contraseña son requeridos"));
            return;
          }

          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email: userData.email,
            name: userData.name,
            role: userData.role || 'cliente'
          };

          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));
          resolve();
        }, 500);
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/signin");
  };

  // Propiedades calculadas
  const isAuthenticated = !!user;
  const isAdmin = hasRole(['admin']);
  const isEmpleado = hasRole(['empleado']);
  const isCliente = hasRole(['cliente']);

  // Valor del contexto
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
    isCliente
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};