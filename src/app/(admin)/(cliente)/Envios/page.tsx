'use client';
import type { Metadata } from "next";
import React from "react";
import EnviosTabla  from "@/components/empleado/EnviosTabla";
import EnviosAdmin from "@/components/admin/EnvioAdmin";
import { useAuth } from "@/context/AuthContext";

export default function Envios() {
    const user = useAuth();
    return (
        <div className="grid grid-rows-12 gap-4 md:gap-6">  
            <div className="col-span-12 xl:col-span-7">
                {(user?.role === "cliente") ? 
                <EnviosTabla /> : <EnviosAdmin />}
            </div>
        </div>
    );
}