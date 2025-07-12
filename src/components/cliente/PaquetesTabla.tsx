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
import { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { Prisma } from '@prisma/client';
import { useAuth } from "@/context/AuthContext";

// Tipo basado en tu modelo Prisma
type PaqueteWithRelations = Prisma.PaqueteGetPayload<{
  include: {
    almacen: true;
    envio: {
      include: {
        origen: true;
        destino: true;
      }
    };
    empleado: true;
  }
}>;

export default function PaqueteCliente() {
  const { user } = useAuth();
  const [paquetes, setPaquetes] = useState<PaqueteWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PaqueteWithRelations | null>(null);
  const { isOpen: isFilterOpen, openModal: openFilterModal, closeModal: closeFilterModal } = useModal();

  useEffect(() => {
    const fetchPaquetes = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/paquetes?empleadoId=${user.id}`);
        if (!response.ok) throw new Error('Error al obtener paquetes');
        const data = await response.json();
        setPaquetes(data);
      } catch (error) {
        console.error("Error al cargar paquetes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaquetes();
  }, [user?.id]); // Se ejecuta cuando user.id cambie

  const openDetailsModal = (paquete: PaqueteWithRelations) => setSelected(paquete);
  const closeDetailsModal = () => setSelected(null);

  if (loading) return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-center items-center h-64">
        <p>Cargando paquetes...</p>
      </div>
    </div>
  );

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
              Mis Paquetes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Listado de paquetes asignados
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openFilterModal}
            startIcon={<FilterIcon className="h-4 w-4" />}
          >
            Filtrar
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow> 
              <TableCell isHeader className="py-3 text-left">
                ID</TableCell>
              <TableCell isHeader className="py-3 text-left">
                Descripción</TableCell>
              <TableCell isHeader className="py-3 text-left">
                Ubicación</TableCell>
              <TableCell isHeader className="py-3 text-left">
                Envío</TableCell>
              <TableCell isHeader className="py-3 text-left">
                Estado</TableCell>
              <TableCell isHeader className="py-3 text-left">
                Acciones</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paquetes.map((paquete) => (
              <TableRow key={paquete.id}>
                <TableCell className="font-medium">
                  PKG-{paquete.id.toString().padStart(4, '0')}
                </TableCell>

                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                  {paquete.descripcion}
                </TableCell>

                <TableCell>
                  {paquete.almacen.ciudad}, {paquete.almacen.estado}
                </TableCell>

                <TableCell>
                  {paquete.envio 
                    ? `ENV-${paquete.envio.numero}` 
                    : 'No asignado'}
                </TableCell>

                <TableCell>
                  <Badge
                    size="sm"
                    color={
                      paquete.envio?.estado === "Entregado"
                        ? "success"
                        : paquete.envio?.estado === "EnTransito"
                        ? "info"
                        : "warning"
                    }
                  >
                    {paquete.envio?.estado || 'Pendiente'}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDetailsModal(paquete)}
                    startIcon={<EyeIcon className="w-4 h-4" />}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de detalles */}
      <Modal isOpen={!!selected} onClose={closeDetailsModal} className="max-w-2xl">
        {selected && (
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90 flex items-center gap-2">
              <PackageSearchIcon className="w-5 h-5" />
              Detalles del Paquete PKG-{selected.id.toString().padStart(4, '0')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Información del Paquete</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Descripción:</span>
                      <span>{selected.descripcion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Dimensiones:</span>
                      <span>{selected.largo} × {selected.ancho} × {selected.alto} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Peso:</span>
                      <span>{selected.peso} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Volumen:</span>
                      <span>{selected.volumen} m³</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ubicación Actual</h3>
                  <div className="text-sm space-y-2">
                    <p>{selected.almacen.linea1}</p>
                    {selected.almacen.linea2 && <p>{selected.almacen.linea2}</p>}
                    <p>{selected.almacen.ciudad}, {selected.almacen.estado}, {selected.almacen.pais}</p>
                    <p>Código Postal: {selected.almacen.codpostal}</p>
                    <p>Teléfono: {selected.almacen.telefono}</p>
                  </div>
                </div>
              </div>

              {selected.envio && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Información de Envío</h3>
                    <div className="text-sm space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Número:</span>
                        <span>ENV-{selected.envio.numero}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Estado:</span>
                        <Badge
                          size="sm"
                          color={
                            selected.envio.estado === "Entregado"
                              ? "success"
                              : selected.envio.estado === "EnTransito"
                              ? "info"
                              : "warning"
                          }
                        >
                          {selected.envio.estado}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Origen:</span>
                        <span>{selected.envio.origen.ciudad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Destino:</span>
                        <span>{selected.envio.destino.ciudad}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Fecha salida:</span>
                        <span>{new Date(selected.envio.fechasalida).toLocaleDateString()}</span>
                      </div>
                      {selected.envio.fechallegada && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Fecha llegada:</span>
                          <span>{new Date(selected.envio.fechallegada).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-6">
              <Button variant="outline" onClick={closeDetailsModal}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}