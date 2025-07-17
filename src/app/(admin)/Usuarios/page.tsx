import type { Metadata } from "next";
import React from "react";
import UsersTabla from "@/components/admin/UsersTabla";
import { ProtectedRoute } from "@/components/ProteccionRutas/ProteccionRuta";

export const metadata: Metadata = {
  title: "Cargo Track",
  description: "Envíos Internacionales hasta la puerta de tu casa",
};

export default function Usuarios() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="grid grid-rows-12 gap-4 md:gap-6">
        
        <div className="col-span-12 xl:col-span-7">
            <UsersTabla />
        </div>

      </div>
    </ProtectedRoute>
  );
}
