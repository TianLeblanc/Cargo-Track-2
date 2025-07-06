'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import { PackageSearchIcon, FilterIcon, EyeIcon } from "lucide-react";
import { useState } from "react";

interface Paquete {
  id: string;
  alto: number;
  ancho: number;
  desc: string;
  status: "Pendiente" | "Entregado" | "Cancelado";
  id_envio: string;
  id_almacen: string;
  id_empleado: number;
}

const tableData: Paquete[] = [
  {
    id: "PKG-2025-001",
    alto: 10,
    ancho: 20,
    desc: "Cafecito con pan",
    status: "Pendiente",
    id_envio: "CT-2023-001",
    id_almacen: "ALM-001",
    id_empleado: 31216675,
  },
  {
    id: "PKG-2025-002",
    alto: 10,
    ancho: 20,
    desc: "Quesitos sin almendras",
    status: "Entregado",
    id_envio: "CT-2023-002",
    id_almacen: "ALM-002",
    id_empleado: 31216675,
  },
];

export default function PaqueteCliente() {
  const [selected, setSelected] = useState<Paquete | null>(null);

  const openModal = (paquete: Paquete) => setSelected(paquete);
  const closeModal = () => setSelected(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            <PackageSearchIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Casillero
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Listado de paquetes asignados
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]">
            <FilterIcon className="h-4 w-4" />
            Filtrar
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]">
            Ver todo
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow> 
              <TableCell isHeader className="py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-400">
                # De Guía
              </TableCell>
              <TableCell isHeader className="py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-400">
                Descripción
              </TableCell>
              <TableCell isHeader className="py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-400">
                Estado del Envío
              </TableCell>
              <TableCell isHeader className="py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-400">
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>


          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((paquete) => (
              <TableRow key={paquete.id}>
                <TableCell className="py-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {paquete.id}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    pepentin
                  </span>
                </TableCell>

                <TableCell className="py-4 text-sm text-gray-700 dark:text-gray-300">
                  {paquete.desc}
                </TableCell>

                <TableCell className="py-4">
                  <Badge
                    size="sm"
                    color={
                      paquete.status === "Entregado"
                        ? "success"
                        : paquete.status === "Pendiente"
                        ? "warning"
                        : "error"
                    }
                  >
                    {paquete.status}
                  </Badge>
                </TableCell>

                <TableCell className="py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(paquete)}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de detalles */}
      <Modal isOpen={!!selected} onClose={closeModal} className="max-w-md m-4">
        {selected && (
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90 flex items-center gap-2">
              <PackageSearchIcon className="w-5 h-5" />
              Detalles del Paquete
            </h2>
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>ID:</strong> {selected.id}</p>
              <p><strong>Descripción:</strong> {selected.desc}</p>
              <p><strong>Dimensiones:</strong> {selected.alto}cm x {selected.ancho}cm</p>
              <p><strong>ID Envío:</strong> {selected.id_envio}</p>
              <p><strong>Almacén:</strong> {selected.id_almacen}</p>
              <p><strong>Empleado:</strong> {selected.id_empleado}</p>
              <p>
                <strong>Estado:</strong>{" "}
                <Badge
                  size="sm"
                  color={
                    selected.status === "Entregado"
                      ? "success"
                      : selected.status === "Pendiente"
                      ? "warning"
                      : "error"
                  }
                >
                  {selected.status}
                </Badge>
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="rounded-md bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
