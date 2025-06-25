import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import PaqueteCliente from "@/components/paquete/PaqueteCliente";

export const metadata: Metadata = {
  title: "Cargo Track",
  description: "Envíos Internacionales hasta la puerta de tu casa",
};

export default function Paquet() {
  return (
    <div className="grid grid-rows-12 gap-4 md:gap-6">
      
      <div className="col-span-12 xl:col-span-7">
        <PaqueteCliente />
      </div>

    </div>
  );
}
