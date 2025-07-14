
'use client';

import { useEffect, useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import { CasilleroService } from '@/services/casilleroService';
import { useAuth } from '@/context/AuthContext'; 
import {
  Table, TableBody, TableCell, TableHeader, TableRow
} from '../ui/table';

interface Paquete {
  id: number;
  descripcion: string;
}

interface Factura {
  numero: number;
  metodoPago: string;
  monto: number;
  cantidadPiezas: number;
  pdf?: string;
  envio: {
    numero: number;
    paquetes: Paquete[];
  };
  detalles: {
    paquete: Paquete;
  }[];
}

export default function CasilleroCliente() {
  const { user } = useAuth();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<Factura | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      cargarEnvios();
    }
  }, [user]);

  const cargarEnvios = async () => {
    try {
      const data = await CasilleroService.obtenerEnviosDelCliente(user.id);
      setFacturas(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar envíos');
    }
  };

  const abrirModal = (factura: Factura) => {
    setDetalleSeleccionado(factura);
    setIsOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Mis Envíos</h2>

      <div className="overflow-x-auto rounded-md border border-gray-300 bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="text-center bg-gray-100">
              <TableCell isHeader># Envío</TableCell>
              <TableCell isHeader># Factura</TableCell>
              <TableCell isHeader>Tracking (ID Paquete)</TableCell>
              <TableCell isHeader>Descripción</TableCell>
              <TableCell isHeader>Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {facturas.map((factura) => (
              <TableRow key={factura.numero}>
                <TableCell>{factura.envio.numero}</TableCell>
                <TableCell>{factura.numero}</TableCell>
                <TableCell>
                  {factura.envio.paquetes.map((p) => p.id).join(', ')}
                </TableCell>
                <TableCell>
                  {factura.envio.paquetes.map((p) => p.descripcion).join('; ')}
                </TableCell>


                <TableCell>
                  <Button onClick={() => abrirModal(factura)} size="xs" variant="primary">
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Factura */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-xl">
        {detalleSeleccionado && (
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-bold">Factura #{detalleSeleccionado.numero}</h3>
            <p><strong>Método de Pago:</strong> {detalleSeleccionado.metodoPago}</p>
            <p><strong>Monto:</strong> ${detalleSeleccionado.monto}</p>
            <p><strong>Piezas:</strong> {detalleSeleccionado.cantidadPiezas}</p>

            <h4 className="font-semibold mt-4">Paquetes:</h4>
            <ul className="list-disc pl-6">
              {detalleSeleccionado.envio.paquetes.map((p) => (
                <li key={p.id}><strong>ID:</strong> {p.id} - {p.descripcion}</li>
              ))}
            </ul>

            {detalleSeleccionado.pdf && (
              <div className="mt-4">
                <a
                  href={detalleSeleccionado.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Descargar PDF
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
