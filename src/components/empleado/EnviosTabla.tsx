'use client';

import {
  Table, TableBody, TableCell, TableHeader, TableRow
} from "../ui/table";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import { useEffect, useState } from "react";
import Pagination from "@/components/tables/Pagination";
import { EnvioService } from "@/services/envioService";
import { EyeIcon, DownloadIcon, CreditCard, Banknote, Landmark } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

import { EnvioCompleto } from '@/types/modelsTypes';

export default function EnviosTabla() {
  const [envios, setEnvios] = useState<EnvioCompleto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedFactura, setSelectedFactura] = useState<EnvioCompleto['factura'] | null>(null);
  const [selectedEnvio, setSelectedEnvio] = useState<EnvioCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [metodoPago, setMetodoPago] = useState<string>('');
  const [detallePago, setDetallePago] = useState<string>('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Modals
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isPagoOpen, openModal: openPagoModal, closeModal: closePagoModal } = useModal();
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnvios = async () => {
      if (!user) return;
      try {
        const data = await EnvioService.getAll(user.id);
        setEnvios(data);
      } catch (error) {
        showNotification('Error al cargar envíos', 'error');
        console.error("Error al cargar envíos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnvios();
  }, [user]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({message, type});
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewFactura = (envio: EnvioCompleto) => {
    if (envio.factura) {
      setSelectedFactura(envio.factura);
      setSelectedEnvio(envio);
      openModal();
    } else {
      showNotification('Este envío no tiene factura asociada', 'error');
    }
  };

  const handleOpenPagoModal = () => {
    setMetodoPago('');
    setDetallePago('');
    closeModal();
    openPagoModal();
  };

  const handleProcesarPago = async () => {
  if (!selectedEnvio?.numero || !selectedFactura?.numero || !metodoPago) return;
  
  try {
    setProcessingPayment(true);
    
    // Llamar al backend para procesar el pago
    const resultado = await EnvioService.procesarPago(
      selectedFactura.numero, // Usamos el número de factura como ID
      metodoPago,
      detallePago
    );

    // Actualizar el estado local
    const updatedEnvios = envios.map(envio => {
      if (envio.numero === selectedEnvio.numero) {
        return {
          ...envio,
          estado: 'pagado', // Actualiza estado del envío
          factura: {
            ...envio.factura!,
            estado: true,
            metodoPago
          }
        };
      }
      return envio;
    });

    setEnvios(updatedEnvios);
    setSelectedFactura(resultado.factura);
    setSelectedEnvio(prev => prev ? { ...prev, estado: 'pagado' } : null);

    // Mostrar confirmación
    setNotification({
      message: 'Pago confirmado exitosamente',
      type: 'success'
    });
    
    closePagoModal();
    closeModal();

  } catch (error) {
    console.error("Error al procesar pago:", error);
    setNotification({
      message: error instanceof Error ? error.message : 'Error al procesar pago',
      type: 'error'
    });
  } finally {
    setProcessingPayment(false);
  }
};

  const getEstadoBadge = (estado: boolean) => {
    const className = estado 
      ? "bg-green-100 text-green-800" 
      : "bg-yellow-100 text-yellow-800";
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${className}`}>
        {estado ? 'Pagada' : 'Pendiente'}
      </span>
    );
  };

  // Paginación
  const totalPages = Math.ceil(envios.length / itemsPerPage) || 1;
  const paginatedEnvios = envios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
    // eslint-disable-next-line
  }, [envios.length]);

  if (loading) return <div className="p-4 text-center">Cargando envíos...</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Notificación simple */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Mis Envíos</h3>
      </div>

      {/* Modal de Factura */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[650px] m-4">
        <div className="relative w-full max-h-[650px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900">
          {selectedFactura ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className=" text-2xl font-bold text-gray-800">
                    Factura #{selectedFactura.numero}
                  </h4>
                  {getEstadoBadge(selectedFactura.estado)}
                  <p className="text-gray-600 dark:text-gray-400">
                    Fecha: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-300">Cliente</h5>
                  <p>
                    {selectedFactura.cliente.p_nombre} {selectedFactura.cliente.p_apellido}
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-700 dark:text-gray-300">Método de pago</h5>
                  <p>{selectedFactura.metodoPago || 'No especificado'}</p>
                  {selectedFactura.detallePago && (
                    <p className="text-sm text-gray-500">{selectedFactura.detallePago}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-lg text-gray-800 dark:text-white/90 mb-3">
                  Detalle de paquetes
                </h5>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Monto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedFactura.detalles.map((detalle) => (
                        <tr key={detalle.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {detalle.paquete.descripcion}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-800 dark:text-gray-200">
                            ${detalle.monto.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <div className="w-full md:w-1/2">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-medium">Subtotal:</span>
                    <span>${(selectedFactura.monto * 0.82).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-medium">IVA (18%):</span>
                    <span>${(selectedFactura.monto * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg">
                    <span>Total:</span>
                    <span>${selectedFactura.monto.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-between">
                {selectedFactura.pdf && (
                  <Button
                    onClick={() => window.open(selectedFactura.pdf, '_blank')}
                    variant="outline"
                    startIcon={<DownloadIcon className="w-4 h-4" />}
                  >
                    Descargar PDF
                  </Button>
                )}

                {!selectedFactura.estado && (
                  <Button
                    onClick={handleOpenPagoModal}
                    className="ml-auto"
                  >
                    Procesar Pago
                  </Button>
                )}
              </div>
            </>
          ) : (
            <p>No hay factura seleccionada.</p>
          )}
        </div>
      </Modal>

      {/* Modal de Método de Pago */}
      <Modal isOpen={isPagoOpen} onClose={closePagoModal} className="max-w-md">
        <div className="p-6">
          <h4 className="text-xl font-bold mb-6 text-center">Seleccione método de pago</h4>
          
          <div className="space-y-4">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${metodoPago === 'efectivo' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => setMetodoPago('efectivo')}
            >
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-blue-500" />
                <div>
                  <h5 className="font-medium">Efectivo</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pago en efectivo al momento de la entrega</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${metodoPago === 'tarjeta' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => setMetodoPago('tarjeta')}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-blue-500" />
                <div>
                  <h5 className="font-medium">Tarjeta de crédito/débito</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pago con tarjeta</p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${metodoPago === 'transferencia' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}`}
              onClick={() => setMetodoPago('transferencia')}
            >
              <div className="flex items-center gap-3">
                <Landmark className="w-6 h-6 text-blue-500" />
                <div>
                  <h5 className="font-medium">Transferencia bancaria</h5>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Transferencia a nuestra cuenta</p>
                </div>
              </div>
            </div>

            {(metodoPago === 'tarjeta' || metodoPago === 'transferencia') && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  {metodoPago === 'tarjeta' ? 'Número de tarjeta' : 'Número de transacción'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={metodoPago === 'tarjeta' ? '1234 5678 9012 3456' : 'Número de referencia'}
                  value={detallePago}
                  onChange={(e) => setDetallePago(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={closePagoModal}>
              Cancelar
            </Button>
           <Button 
             onClick={handleProcesarPago} 
            disabled={!metodoPago || ((metodoPago === 'tarjeta' || metodoPago === 'transferencia') && !detallePago)}
             loading={processingPayment}  // Cambiado de isLoading a loading
>
  Confirmar Pago
</Button>
          </div>
        </div>
      </Modal>

      {/* Tabla de envíos */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-300 dark:border-gray-800">
            <TableRow className="text-sm text-left">
              <TableCell isHeader className="py-3">#</TableCell>
              <TableCell isHeader className="py-3">Tipo</TableCell>
              <TableCell isHeader className="py-3">Estado</TableCell>
              <TableCell isHeader className="py-3">Factura</TableCell>
              <TableCell isHeader className="py-3">Acciones</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-300 dark:divide-gray-800">
            {paginatedEnvios.map((envio, index) => (
              <TableRow key={envio.numero} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-800'}>
                <TableCell>{envio.numero}</TableCell>
                <TableCell>{envio.tipo}</TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                    envio.estado === 'entregado' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {envio.estado}
                  </span>
                </TableCell>
                <TableCell>
                  {envio.factura ? (
                    <div className="flex items-center gap-2">
                      <span>#{envio.factura.numero}</span>
                      {getEstadoBadge(envio.factura.estado)}
                    </div>
                  ) : (
                    'Sin factura'
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewFactura(envio)}
                    className="my-1"
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
      {/* Paginación */}
      <div className="flex justify-center mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}