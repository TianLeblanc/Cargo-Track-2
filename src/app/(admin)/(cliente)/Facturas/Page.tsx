import type { Metadata } from "next";
import React from "react";
import FacturasTabla from "@/components/cliente/FacturasTabla";

export const metadata: Metadata = {
  title: "Cargo Track",
  description: "Envíos Internacionales hasta la puerta de tu casa",
};

export default function Facturas() {
  return (
    <div className="grid grid-rows-12 gap-4 md:gap-6">
      <div className="col-span-12 xl:col-span-7">
        <FacturasTabla />
      </div>
    </div>
  );
}
