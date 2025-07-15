'use client';

import { useState } from 'react';
import { PackageService } from '@/services/packageService';
import { Modal } from '../ui/modal';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Tabs, Tab } from "@/components/ui/tabs";

interface PackageDetails {
  id: number;
  descripcion: string;
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  volumen: number;
  estado: string;
  almacen: {
    id: number;
    linea1: string;
    ciudad: string;
    estado: string;
    pais: string;
  };
  empleado: {
    id: number;
    p_nombre: string;
    p_apellido: string;
  };
  envio?: {
    numero: number;
    estado: string;
    origen: {
      id: number;
      ciudad: string;
    };
    destino: {
      id: number;
      ciudad: string;
    };
    factura?: {
      numero: number;
      metodoPago: string;
      monto: number;
      cliente: {
        p_nombre: string;
        p_apellido: string;
      };
    };
  };
  detalles?: Array<{
    factura: {
      numero: number;
      metodoPago: string;
      monto: number;
      cliente: {
        p_nombre: string;
        p_apellido: string;
      };
    };
  }>;
  historial?: Array<{
    fecha: Date;
    estado: string;
    ubicacion: {
      ciudad: string;
    };
    empleado: {
      p_nombre: string;
    };
  }>;
}

export default function Tracking() {
  const [packageId, setPackageId] = useState<string>('');
  const [packageData, setPackageData] = useState<PackageDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageId) return;
    
    try {
      setLoading(true);
      setError(null);
      setPackageData(null);
      
      const id = parseInt(packageId);
      if (isNaN(id)) throw new Error('ID inválido');
      
      const data = await PackageService.getById(id);
      setPackageData(data);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPackageData(null);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
      {/* Navbar de búsqueda */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Ingrese ID del paquete"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>
      </div>

      {/* Modal de resultados */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-4xl">
        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-red-500 mb-4">Error</h3>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <div className="mt-6">
                <Button onClick={closeModal}>Cerrar</Button>
              </div>
            </div>
          )}

          {packageData && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Paquete #{packageData.id}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Estado: <span className="font-semibold">{packageData.estado}</span>
                </p>
              </div>

              {/* Tabs de navegación */}
              <Tabs>
                <Tab 
                  active={activeTab === 'details'} 
                  onClick={() => setActiveTab('details')}
                >
                  Detalles
                </Tab>
                {packageData.envio && (
                  <Tab 
                    active={activeTab === 'shipping'} 
                    onClick={() => setActiveTab('shipping')}
                  >
                    Envío
                  </Tab>
                )}
                <Tab 
                  active={activeTab === 'history'} 
                  onClick={() => setActiveTab('history')}
                >
                  Historial
                </Tab>
                {(packageData.detalles?.length || packageData.envio?.factura) && (
                  <Tab 
                    active={activeTab === 'billing'} 
                    onClick={() => setActiveTab('billing')}
                  >
                    Facturación
                  </Tab>
                )}
              </Tabs>

              {/* Contenido de las tabs */}
              <div className="mt-6">
                {activeTab === 'details' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Información del paquete</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
                          <p>{packageData.descripcion}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Peso (kg)</p>
                            <p>{packageData.peso}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Volumen (m³)</p>
                            <p>{packageData.volumen}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Dimensiones</p>
                            <p>{packageData.largo}x{packageData.ancho}x{packageData.alto}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Ubicación actual</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Almacén</p>
                          <p>{packageData.almacen.linea1}, {packageData.almacen.ciudad}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Registrado por</p>
                          <p>{packageData.empleado.p_nombre} {packageData.empleado.p_apellido}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && packageData.envio && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Información de envío</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Número de envío</p>
                        <p>{packageData.envio.numero}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                        <p>{packageData.envio.estado}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Origen</h4>
                        <p>{packageData.envio.origen.ciudad}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Destino</h4>
                        <p>{packageData.envio.destino.ciudad}</p>
                      </div>
                    </div>

                    {packageData.envio.factura && (
                      <div>
                        <h4 className="font-medium mb-2">Información de pago</h4>
                        <p>Método: {packageData.envio.factura.metodoPago}</p>
                        <p>Monto: ${packageData.envio.factura.monto.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && packageData.historial && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Historial reciente</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableCell isHeader>Fecha</TableCell>
                            <TableCell isHeader>Estado</TableCell>
                            <TableCell isHeader>Ubicación</TableCell>
                            <TableCell isHeader>Responsable</TableCell>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {packageData.historial.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{new Date(item.fecha).toLocaleString()}</TableCell>
                              <TableCell>{item.estado}</TableCell>
                              <TableCell>{item.ubicacion.ciudad}</TableCell>
                              <TableCell>{item.empleado.p_nombre}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Información de facturación</h3>
                    {packageData.envio?.factura && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Factura #</p>
                          <p>{packageData.envio.factura.numero}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Método de pago</p>
                          <p>{packageData.envio.factura.metodoPago}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monto</p>
                          <p>${packageData.envio.factura.monto.toFixed(2)}</p>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                          <p>{packageData.envio.factura.cliente.p_nombre} {packageData.envio.factura.cliente.p_apellido}</p>
                        </div>
                      </div>
                    )}

                    {packageData.detalles?.map((detalle, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Factura #</p>
                          <p>{detalle.factura.numero}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Método de pago</p>
                          <p>{detalle.factura.metodoPago}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Monto</p>
                          <p>${detalle.factura.monto.toFixed(2)}</p>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                          <p>{detalle.factura.cliente.p_nombre} {detalle.factura.cliente.p_apellido}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end mt-6">
            <Button onClick={closeModal} variant="outline">
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}