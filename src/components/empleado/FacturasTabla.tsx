'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

interface Factura {
  numero: number;
  estado: boolean;
  metodoPago: string;
  monto: number;
  cantidadPiezas: number;
  pdf?: string;
  createdAt: string;
}

export default function FacturasTabla() {
  const { user } = useAuth();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      if (!user) return;

        console.log("[DEBUG] clienteId desde AuthContext:", user.id);
        
      try {
        const res = await fetch(`/api/facturas?clienteId=${user.id}`);
        if (!res.ok) throw new Error("Error al cargar facturas");

        const data = await res.json();
        setFacturas(data);
      } catch (error) {
        console.error("Error al cargar facturas:", error);
        alert("No se pudieron cargar las facturas.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, [user]);

  if (loading) {
    return <div className="p-4">Cargando facturas...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Mis Facturas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualización de tus facturas emitidas
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader>ID</TableCell>
              <TableCell isHeader>Estado</TableCell>
              <TableCell isHeader>Monto</TableCell>
              <TableCell isHeader>Método Pago</TableCell>
              
              <TableCell isHeader>PDF</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {facturas.map((factura) => (
              <TableRow key={factura.numero}>
                <TableCell className="py-3 font-medium">
                  FAC-{factura.numero.toString().padStart(4, '0')}
                </TableCell>
                <TableCell className="py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    factura.estado
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {factura.estado ? "Pagado" : "Generado"}
                  </span>
                </TableCell>
                <TableCell className="py-3">${factura.monto.toFixed(2)}</TableCell>
                <TableCell className="py-3">{factura.metodoPago}</TableCell>
                
                <TableCell className="py-3">
                  {factura.pdf ? (
                    <Link
                      href={factura.pdf}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Ver PDF
                    </Link>
                  ) : (
                    <span className="text-gray-400 text-sm">Sin PDF</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
