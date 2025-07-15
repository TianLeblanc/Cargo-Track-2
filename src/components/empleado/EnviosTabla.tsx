'use client';

import {
  Table, TableBody, TableCell, TableHeader, TableRow
} from "../ui/table";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import { useEffect, useState } from "react";
import { EnvioService } from "@/services/envioService";
import { EyeIcon, DownloadIcon } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

interface Envio {
  numero: number;
  tipo: string;
  estado: string;
  factura?: {
    numero: number;
    estado: boolean;
    metodoPago: string;
    monto: number;
    cantidadPiezas: number;
    pdf?: string;
    cliente: {
      p_nombre: string;
      p_apellido: string;
    };
    detalles: {
      numero: number;
      monto: number;
      paquete: {
        descripcion: string;
      };
    }[];
  };
}

export default function EnviosTabla() {
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [selectedFactura, setSelectedFactura] = useState<Envio['factura'] | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth(); // usuario logueado

  useEffect(() => {
    const fetchEnvios = async () => {
      if (!user) return;
      try {
        const data = await EnvioService.getAll(user.id);
        setEnvios(data);
      } catch (error) {
        console.error("Error al cargar envíos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnvios();
  }, [user]);

  const handleViewFactura = (envio: Envio) => {
    if (envio.factura) {
      setSelectedFactura(envio.factura);
      openModal();
    } else {
      alert('Este envío no tiene factura asociada.');
    }
  };

  if (loading) return <div>Cargando envíos...</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Mis Envíos</h3>
      </div>

      {/* Modal de Factura */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[650px] m-4">
        <div className="relative w-full max-h-[650px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-10">
          {selectedFactura ? (
            <>
              <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                Factura #{selectedFactura.numero}
              </h4>
              <p><strong>Cliente:</strong> {selectedFactura.cliente.p_nombre} {selectedFactura.cliente.p_apellido}</p>
              <p><strong>Estado:</strong> {selectedFactura.estado ? 'Pagada' : 'Pendiente'}</p>
              <p><strong>Método de pago:</strong> {selectedFactura.metodoPago}</p>
              <p><strong>Monto total:</strong> ${selectedFactura.monto.toFixed(2)}</p>
              <p><strong>Cantidad de piezas:</strong> {selectedFactura.cantidadPiezas}</p>

              {selectedFactura.pdf && (
                <a
                  href={selectedFactura.pdf}
                  download
                  className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Descargar PDF
                </a>
              )}

              <div className="mt-5">
                <h5 className="font-semibold">Detalle de paquetes:</h5>
                <ul className="list-disc list-inside mt-2">
                  {selectedFactura.detalles.map((detalle) => (
                    <li key={detalle.numero}>
                      {detalle.paquete.descripcion} - ${detalle.monto.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p>No hay factura seleccionada.</p>
          )}
        </div>
      </Modal>

      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader>#</TableCell>
              <TableCell isHeader>Tipo</TableCell>
              <TableCell isHeader>Estado</TableCell>
              <TableCell isHeader>Factura</TableCell>
              <TableCell isHeader>Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {envios.map((envio) => (
              <TableRow key={envio.numero}>
                <TableCell>{envio.numero}</TableCell>
                <TableCell>{envio.tipo}</TableCell>
                <TableCell>{envio.estado}</TableCell>
                <TableCell>
                  {envio.factura ? `#${envio.factura.numero}` : 'Sin factura'}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewFactura(envio)}
                    size="xs"
                    variant="outline"
                    startIcon={<EyeIcon className="w-4 h-4" />}
                  >
                    Ver Factura
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
