import PaquetesTabla from "@/components/empleado/PaquetesTabla";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cargo Track",
  description: "Envíos Internacionales hasta la puerta de tu casa",
};

export default function Paquetes() {
  return (


    <div className="grid grid-rows-12 gap-4 md:gap-6">
      
      <div className="col-span-12 xl:col-span-7">
        <PaquetesTabla />
      </div>

    </div>

  );
}
