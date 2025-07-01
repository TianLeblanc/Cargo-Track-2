import type { Metadata } from "next";
import React from "react";
import UsersTabla from "@/components/admin/UsersTabla";
import UsersTablaPrueba from "@/components/admin/UsersTabla Prueba";

export const metadata: Metadata = {
  title: "Cargo Track",
  description: "Envíos Internacionales hasta la puerta de tu casa",
};

export default function Usuarios() {
  return (
    <div className="grid grid-rows-12 gap-4 md:gap-6">
      
      <div className="col-span-12 xl:col-span-7">
        <UsersTablaPrueba />
      </div>

    </div>
  );
}
