"use client";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/authTypes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
  redirectTo = "/signin",
}: ProtectedRouteProps) => {
  const { user, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo);
      } else if (!hasRole(allowedRoles)) {
        router.push("/error-503");
      }
    }
  }, [user, isLoading, allowedRoles, hasRole, redirectTo, router]);

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  // No renderizar nada si no está autorizado (el efecto ya redirigirá)
  if (!user || !hasRole(allowedRoles)) {
    return null;
  }

  // Renderizar children solo si está autorizado
  return <>{children}</>;
};