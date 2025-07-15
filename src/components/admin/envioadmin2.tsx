'use client';

import {
  Table, TableBody, TableCell, TableHeader, TableRow
} from "../ui/table";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from "@/components/form/Select";
import { PencilIcon, TrashIcon, PackagePlusIcon, PlaneIcon, ShipIcon } from "lucide-react";
import { CheckCircleIcon } from "@/icons";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DatePicker from "@/components/form/date-picker";
import Badge from "../ui/badge/Badge";

interface Envio {
  numero: number;
  tipo: string;
  estado: string;
  fechasalida: Date;
  fechallegada?: Date | null;
  origen: {
    ciudad: string;
    estado: string;
    pais: string;
  };
  destino: {
    ciudad: string;
    estado: string;
    pais: string;
  };
  paquetes: {
    id: number;
    descripcion: string;
    cliente: {
      p_nombre: string;
      p_apellido: string;
    };
  }[];
}

interface Almacen {
  id: number;
  ciudad: string;
  estado: string;
  pais: string;
}

interface Paquete {
  id: number;
  descripcion: string;
  clienteId: number;
  cliente: {
    p_nombre: string;
    p_apellido: string;
  };
}

export default function EnvioTabla() {
  const { user } = useAuth();
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [paquetesDisponibles, setPaquetesDisponibles] = useState<Paquete[]>([]);
  const [clientesConPaquetes, setClientesConPaquetes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const [showAsociarModal, setShowAsociarModal] = useState(false);
  const [envioSeleccionado, setEnvioSeleccionado] = useState<number | null>(null);

  // Formulario de envío
  const [formData, setFormData] = useState({
    tipo: 'barco',
    origenCodigo: 0,
    destinoCodigo: 0,
    fechasalida: new Date(),
    fechallegada: null as Date | null,
    estado: 'en puerto de salida'
  });

  // Formulario de asociación de paquetes
  const [asociacionData, setAsociacionData] = useState<{
    clienteId: number | null;
    paquetesSeleccionados: number[];
  }>({
    clienteId: null,
    paquetesSeleccionados: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener envíos con sus relaciones
      const enviosRes = await fetch('/api/envioAdmin2?include=origen,destino,paquetes,paquetes.cliente');
      if (!enviosRes.ok) throw new Error('Error al obtener envíos');
      const enviosData = await enviosRes.json();
      setEnvios(enviosData);

      // Obtener almacenes
      const almacenesRes = await fetch('/api/almacen');
      if (!almacenesRes.ok) throw new Error('Error al obtener almacenes');
      const almacenesData = await almacenesRes.json();
      setAlmacenes(almacenesData);
      
      // Establecer valores por defecto para origen y destino
      if (almacenesData.length > 0) {
        setFormData(prev => ({
          ...prev,
          origenCodigo: almacenesData[0].id,
          destinoCodigo: almacenesData.length > 1 ? almacenesData[1].id : almacenesData[0].id
        }));
      }

      // Obtener paquetes disponibles (sin envío)
      const paquetesRes = await fetch('/api/paquete?disponibles=true&include=cliente');
      if (!paquetesRes.ok) throw new Error('Error al obtener paquetes disponibles');
      const paquetesData = await paquetesRes.json();
      setPaquetesDisponibles(paquetesData);

      // Agrupar clientes con paquetes disponibles
      const clientesMap = new Map();
      paquetesData.forEach((paquete: Paquete) => {
        if (!clientesMap.has(paquete.clienteId)) {
          clientesMap.set(paquete.clienteId, {
            id: paquete.clienteId,
            nombre: `${paquete.cliente.p_nombre} ${paquete.cliente.p_apellido}`,
            paquetes: []
          });
        }
        clientesMap.get(paquete.clienteId).paquetes.push(paquete);
      });
      setClientesConPaquetes(Array.from(clientesMap.values()));

    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name: string, dates: Date[]) => {
  if (dates.length > 0) {
    setFormData({ ...formData, [name]: dates[0] });
  } else {
    setFormData({ ...formData, [name]: null });
  }
};

  const resetForm = () => {
    setFormData({
      tipo: 'barco',
      origenCodigo: almacenes[0]?.id || 0,
      destinoCodigo: almacenes.length > 1 ? almacenes[1].id : almacenes[0]?.id || 0,
      fechasalida: new Date(),
      fechallegada: null,
      estado: 'en puerto de salida'
    });
  };

  const handleOpenCreate = () => {
    resetForm();
    openModal();
  };

  const handleOpenEdit = (envio: Envio) => {
    setFormData({
      tipo: envio.tipo,
      origenCodigo: almacenes.find(a => a.ciudad === envio.origen.ciudad && a.pais === envio.origen.pais)?.id || 0,
      destinoCodigo: almacenes.find(a => a.ciudad === envio.destino.ciudad && a.pais === envio.destino.pais)?.id || 0,
      fechasalida: new Date(envio.fechasalida),
      fechallegada: envio.fechallegada ? new Date(envio.fechallegada) : null,
      estado: envio.estado
    });
    openModal();
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        EmpleadoId: user?.id
      };

      const res = await fetch('/api/envioAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!res.ok) throw new Error('Error al guardar el envío');

      alert("Envío guardado correctamente");
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error al guardar envío:", error);
      alert("Error al guardar el envío");
    }
  };

  const handleDelete = (numero: number) => {
    setDeleteId(numero);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/envioAdmin/${deleteId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error al eliminar el envío');

      alert("Envío eliminado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al eliminar envío:", error);
      alert("Error al eliminar el envío");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleOpenAsociar = (numero: number) => {
    setEnvioSeleccionado(numero);
    setAsociacionData({
      clienteId: null,
      paquetesSeleccionados: []
    });
    setShowAsociarModal(true);
  };

  const handleClienteChange = (clienteId: number) => {
    setAsociacionData({
      clienteId,
      paquetesSeleccionados: []
    });
  };

  const handlePaqueteToggle = (paqueteId: number) => {
    setAsociacionData(prev => {
      const newSelected = prev.paquetesSeleccionados.includes(paqueteId)
        ? prev.paquetesSeleccionados.filter(id => id !== paqueteId)
        : [...prev.paquetesSeleccionados, paqueteId];
      
      return {
        ...prev,
        paquetesSeleccionados: newSelected
      };
    });
  };

  const handleAsociarSubmit = async () => {
    if (!envioSeleccionado || !asociacionData.clienteId || asociacionData.paquetesSeleccionados.length === 0) {
      alert("Debe seleccionar un cliente y al menos un paquete");
      return;
    }

    try {
      // Asociar paquetes al envío
      const res = await fetch(`/api/envioAdmin/${envioSeleccionado}/asociar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paqueteIds: asociacionData.paquetesSeleccionados,
          clienteId: asociacionData.clienteId
        })
      });

      if (!res.ok) throw new Error('Error al asociar paquetes');

      alert("Paquetes asociados correctamente y factura generada");
      fetchData();
      setShowAsociarModal(false);
    } catch (error) {
      console.error("Error al asociar paquetes:", error);
      alert("Error al asociar paquetes");
    }
  };

  const handleEstadoChange = async (numero: number, nuevoEstado: string) => {
    if (!confirm(`¿Está seguro de cambiar el estado a "${nuevoEstado}"? Esto también actualizará el estado de los paquetes asociados.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/envio/${numero}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!res.ok) throw new Error('Error al actualizar estado');

      alert("Estado actualizado correctamente");
      fetchData();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar estado");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="p-6">
        <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Envíos</h2>
          {user?.rol === "admin" && (
            <Button 
              onClick={handleOpenCreate} 
              size="sm" 
              variant="primary" 
              startIcon={<CheckCircleIcon />}
            >
              Crear Envío
            </Button>
          )}
        </div>

        {/* Modal Crear/Editar */}
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-3xl">
          <div className="p-6 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {formData.tipo === 'barco' ? (
                <div className="flex items-center gap-2">
                  <ShipIcon className="w-6 h-6" /> Envío Marítimo
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PlaneIcon className="w-6 h-6" /> Envío Aéreo
                </div>
              )}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Envío*</Label>
                <Select
                  options={[
                    { value: 'barco', label: 'Barco ($25 por pie cúbico)' },
                    { value: 'avion', label: 'Avión ($7 por libra o volumen)' }
                  ]}
                  value={formData.tipo}
                  onChange={(value) => setFormData({ ...formData, tipo: value })}
                />
              </div>
              <div>
                <Label>Estado*</Label>
                <Select
                  options={[
                    { value: 'en puerto de salida', label: 'En puerto de salida' },
                    { value: 'en transito', label: 'En tránsito' },
                    { value: 'en destino', label: 'En destino' }
                  ]}
                  value={formData.estado}
                  onChange={(value) => setFormData({ ...formData, estado: value })}
                />
              </div>
              <div>
                <Label>Almacén Origen*</Label>
                <Select
                  options={almacenes.map(almacen => ({
                    value: almacen.id.toString(),
                    label: `${almacen.ciudad}, ${almacen.estado} (${almacen.pais})`
                  }))}
                  value={formData.origenCodigo.toString()}
                  onChange={(value) => setFormData({ ...formData, origenCodigo: parseInt(value) })}
                />
              </div>
              <div>
                <Label>Almacén Destino*</Label>
                <Select
                  options={almacenes.map(almacen => ({
                    value: almacen.id.toString(),
                    label: `${almacen.ciudad}, ${almacen.estado} (${almacen.pais})`
                  }))}
                  value={formData.destinoCodigo.toString()}
                  onChange={(value) => setFormData({ ...formData, destinoCodigo: parseInt(value) })}
                />
              </div>
              <div>
                <Label>Fecha de Salida*</Label>
                <DatePicker
                    id="fecha-salida"
                    mode="single"
                    onChange={(dates) => handleDateChange('fechasalida', dates)}
                    defaultDate={formData.fechasalida}
                    label="Fecha de Salida*"
                />
              </div>
              <div>
                <Label>Fecha de Llegada (estimada)</Label>
                <DatePicker
                    id="fecha-llegada"
                    mode="single"
                    onChange={(dates) => handleDateChange('fechallegada', dates)}
                    label="Fecha de Llegada (estimada)"
                    defaultDate={formData.fechallegada || undefined}
                    placeholder="Seleccione fecha de llegada"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                Guardar Envío
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal Asociar Paquetes */}
        <Modal isOpen={showAsociarModal} onClose={() => setShowAsociarModal(false)} className="max-w-4xl">
          <div className="p-6 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              Asociar Paquetes al Envío #{envioSeleccionado}
            </h3>

            <div className="space-y-4">
              <div>
                <Label>Seleccionar Cliente*</Label>
                <Select
                  options={clientesConPaquetes.map(cliente => ({
                    value: cliente.id.toString(),
                    label: cliente.nombre
                  }))}
                  value={asociacionData.clienteId?.toString() || ''}
                  onChange={(value) => handleClienteChange(parseInt(value))}
                  placeholder="Seleccione un cliente"
                />
              </div>

              {asociacionData.clienteId && (
                <div>
                  <Label>Paquetes Disponibles del Cliente</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seleccionar</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                        {clientesConPaquetes
                          .find(c => c.id === asociacionData.clienteId)?.paquetes
                          .map((paquete: Paquete) => (
                            <tr key={paquete.id}>
                              <td className="px-6 py-4 whitespace-nowrap">PKG-{paquete.id.toString().padStart(4, '0')}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{paquete.descripcion}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={asociacionData.paquetesSeleccionados.includes(paquete.id)}
                                  onChange={() => handlePaqueteToggle(paquete.id)}
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAsociarModal(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleAsociarSubmit}
                disabled={!asociacionData.clienteId || asociacionData.paquetesSeleccionados.length === 0}
              >
                Asociar Paquetes y Generar Factura
              </Button>
            </div>
          </div>
        </Modal>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="text-center">
                <TableCell isHeader>#</TableCell>
                <TableCell isHeader>Tipo</TableCell>
                <TableCell isHeader>Origen → Destino</TableCell>
                <TableCell isHeader>Fechas</TableCell>
                <TableCell isHeader>Estado</TableCell>
                <TableCell isHeader>Paquetes</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {envios.map((envio, index) => (
                <TableRow key={envio.numero} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <TableCell className="font-semibold">ENV-{envio.numero}</TableCell>
                  <TableCell>
                    <Badge 
                      color={envio.tipo === 'barco' ? 'info' : 'warning'}
                      size="sm"
                    >
                      {envio.tipo === 'barco' ? 'Marítimo' : 'Aéreo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{envio.origen.ciudad}, {envio.origen.pais}</p>
                      <p className="text-sm text-gray-500">→</p>
                      <p className="font-medium">{envio.destino.ciudad}, {envio.destino.pais}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p>Salida: {new Date(envio.fechasalida).toLocaleDateString('es-ES')}</p>
                      {envio.fechallegada && (
                        <p className="text-sm text-gray-500">
                            Llegada: {new Date(envio.fechallegada).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      options={[
                        { value: 'en puerto de salida', label: 'En puerto' },
                        { value: 'en transito', label: 'En tránsito' },
                        { value: 'en destino', label: 'En destino' }
                      ]}
                      value={envio.estado}
                      onChange={(value) => handleEstadoChange(envio.numero, value)}
                      
                    />
                  </TableCell>
                  <TableCell>
                    {envio.paquetes.length > 0 ? (
                      <div className="text-sm">
                        <p>{envio.paquetes.length} paquete(s)</p>
                        <p className="text-gray-500">
                          {envio.paquetes.slice(0, 2).map(p => `PKG-${p.id}`).join(', ')}
                          {envio.paquetes.length > 2 && '...'}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin paquetes</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleOpenAsociar(envio.numero)}
                        startIcon={<PackagePlusIcon className="w-4 h-4" />}
                      />
                      {user?.rol === 'admin' && (
                        <>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleOpenEdit(envio)}
                            startIcon={<PencilIcon className="w-4 h-4" />}
                          />
                          <Button
                            variant="outline"
                            color="danger"
                            size="xs"
                            onClick={() => handleDelete(envio.numero)}
                            startIcon={<TrashIcon className="w-4 h-4" />}
                            disabled={isDeleting}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Confirmación Eliminar */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} className="max-w-md">
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
          <p>¿Estás seguro que deseas eliminar este envío? Esta acción no se puede deshacer.</p>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleDeleteConfirm}
              loading={isDeleting}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}