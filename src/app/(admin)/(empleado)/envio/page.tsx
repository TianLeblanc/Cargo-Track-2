import EnvioTabla from "@/components/admin/EnvioAdmin";
import type { Metadata } from "next";
import React from "react";
import { ProtectedRoute } from "@/components/ProteccionRutas/ProteccionRuta";

export const metadata: Metadata = {
  title: "Cargo Track",
  description: "Envíos Internacionales hasta la puerta de tu casa",
};

export default function Envio() {
  return (
    <ProtectedRoute allowedRoles={["admin", "empleado"]}>
    <div className="grid grid-rows-12 gap-4 md:gap-6">
      
      <div className="col-span-12 xl:col-span-7">
        <EnvioTabla/>
      </div>

    </div>
    </ProtectedRoute>

  );
}