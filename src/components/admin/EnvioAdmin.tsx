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
import { PencilIcon, TrashIcon, PackagePlusIcon, PlaneIcon, ShipIcon, PlusIcon } from "lucide-react";
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
}

interface Usuario {
  id: number;
  p_nombre: string;
  p_apellido: string;
  email: string;
  rol: string;
}

export default function EnvioTabla() {
  const { user } = useAuth();
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [paquetesDisponibles, setPaquetesDisponibles] = useState<Paquete[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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
    
    const [enviosRes, almacenesRes, paquetesRes, usuariosRes] = await Promise.all([
      fetch('/api/envioAdmin?include=origen,destino,paquetes,paquetes.cliente'),
      fetch('/api/almacen'),
      fetch('/api/paquete?disponibles=true'),
      fetch('/api/usuarios')
    ]);

    if (!enviosRes.ok || !almacenesRes.ok || !paquetesRes.ok || !usuariosRes.ok) {
      throw new Error('Error al cargar datos');
    }

    const [enviosData, almacenesData, paquetesData, usuariosData] = await Promise.all([
      enviosRes.json(),
      almacenesRes.json(),
      paquetesRes.json(),
      usuariosRes.json()
    ]);

    setEnvios(enviosData);
    setAlmacenes(almacenesData);
    setPaquetesDisponibles(paquetesData);
    setUsuarios(usuariosData);

  } catch (error) {
    console.error("Error al cargar datos:", error);
    alert("Error al cargar datos. Por favor recarga la página.");
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
    setEnvioSeleccionado(null);
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
    setEnvioSeleccionado(envio.numero);
    openModal();
  };

 const handleSubmit = async () => {
  try {
    // Validar que origen y destino son diferentes
    if (formData.origenCodigo === formData.destinoCodigo) {
      alert("El origen y el destino no pueden ser el mismo");
      return;
    }

    // Validar fecha de llegada si existe
    if (formData.fechallegada && formData.fechallegada < formData.fechasalida) {
      alert("La fecha de llegada no puede ser anterior a la fecha de salida");
      return;
    }

    const dataToSend = {
      ...formData,
      fechasalida: formData.fechasalida.toISOString(),
      fechallegada: formData.fechallegada ? formData.fechallegada.toISOString() : null,
      EmpleadoId: user?.id
    };

    let res;
    let estadoAnterior = null;
    if (envioSeleccionado) {
      // Obtener el estado anterior del envío
      const envioAnt = envios.find(e => e.numero === envioSeleccionado);
      estadoAnterior = envioAnt?.estado;
      // Editar
      res = await fetch(`/api/envioAdmin/${envioSeleccionado}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
    } else {
      // Crear
      res = await fetch('/api/envioAdmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Manejo seguro si la respuesta no es JSON
      throw new Error(errorData.message || 'Error al guardar el envío');
    }

    const responseData = await res.json();
    console.log(envioSeleccionado ? 'Envío editado:' : 'Envío creado:', responseData);

    // Si se editó y el estado cambió, actualizar paquetes
    if (envioSeleccionado && estadoAnterior && estadoAnterior !== formData.estado) {
      let estadoPaquete = '';
      if (formData.estado === 'en puerto de salida') {
        estadoPaquete = 'En almacén';
      } else if (formData.estado === 'en transito') {
        estadoPaquete = 'En tránsito';
      } else if (formData.estado === 'en destino') {
        estadoPaquete = 'Disponible para despacho';
      }
      const envioNumero = typeof envioSeleccionado === 'string' ? parseInt(envioSeleccionado) : envioSeleccionado;
      console.log('Llamando a /api/paquete/actualizar-estado-masivo desde handleSubmit con:', { envioNumero, estado: estadoPaquete });
      const resp = await fetch(`/api/paquete/actualizar-estado-masivo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ envioNumero, estado: estadoPaquete })
      });
      let respData = null;
      try {
        respData = await resp.json();
      } catch (e) {
        respData = { error: 'No JSON response' };
      }
      console.log('Respuesta actualizar-estado-masivo (handleSubmit):', resp.status, respData);
      if (!resp.ok) {
        alert(`Error al actualizar paquetes: ${respData?.message || resp.status}`);
      }
    }

    alert(envioSeleccionado ? "Envío editado correctamente" : "Envío creado correctamente");
    await fetchData();
    closeModal();
    resetForm();
    setEnvioSeleccionado(null);
  } catch (error) {
    console.error("Error al guardar envío:", error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al guardar el envío';
    alert(`Error al guardar el envío: ${errorMessage}`);
    try {
      await fetchData();
    } catch (fetchError) {
      console.error("Error al recargar datos:", fetchError);
    }
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
      const bodyToSend = {
        paqueteIds: asociacionData.paquetesSeleccionados,
        clienteId: asociacionData.clienteId
      };
      console.log('Datos enviados a /api/envioAdmin/[id]/asociar:', bodyToSend);
      const res = await fetch(`/api/envioAdmin/${envioSeleccionado}/asociar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyToSend)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Respuesta error /api/envioAdmin/[id]/asociar:', errorText);
        throw new Error('Error al asociar paquetes');
      }

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
      // Actualizar el estado del envío
      const res = await fetch(`/api/envioAdmin/${numero}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!res.ok) throw new Error('Error al actualizar estado');

      // Determinar el estado de los paquetes según el estado del envío
      let estadoPaquete = '';
      if (nuevoEstado === 'en puerto de salida') {
        estadoPaquete = 'En almacén';
      } else if (nuevoEstado === 'en transito') {
        estadoPaquete = 'En tránsito';
      } else if (nuevoEstado === 'en destino') {
        estadoPaquete = 'Disponible para despacho';
      }

      // Asegurar que envioNumero es number
      const envioNumero = typeof numero === 'string' ? parseInt(numero) : numero;

      // Actualizar el estado de los paquetes asociados al envío
      console.log('Llamando a /api/paquete/actualizar-estado-masivo con:', { envioNumero, estado: estadoPaquete });
      const resp = await fetch(`/api/paquete/actualizar-estado-masivo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ envioNumero, estado: estadoPaquete })
      });
      console.log('Llamada a /api/paquete/actualizar-estado-masivo finalizada');

      let respData = null;
      try {
        respData = await resp.json();
      } catch (e) {
        respData = { error: 'No JSON response' };
      }
      console.log('Respuesta actualizar-estado-masivo:', resp.status, respData);

      if (!resp.ok) {
        alert(`Error al actualizar paquetes: ${respData?.message || resp.status}`);
        throw new Error(respData?.message || 'Error al actualizar paquetes');
      }

      alert("Estado actualizado correctamente\n" + JSON.stringify(respData, null, 2));
      fetchData();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar estado: " + (error instanceof Error ? error.message : error));
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
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestión de Envíos</h2>
          {user?.rol === "admin" && (
            <Button 
              onClick={handleOpenCreate}
              className="hover:bg-sky-500 hover:text-white"
              size="sm" 
              variant="outline" 
              startIcon={<PlusIcon />}
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
                />
              </div>
              <div>
                <Label>Fecha de Llegada (estimada)</Label>
                <DatePicker
                    id="fecha-llegada"
                    mode="single"
                    onChange={(dates) => handleDateChange('fechallegada', dates)}
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
                options={usuarios.map(usuario => ({
                  value: usuario.id.toString(),
                  label: `${usuario.p_nombre} ${usuario.p_apellido} (${usuario.email})`
                }))}
                value={asociacionData.clienteId?.toString() || ''}
                onChange={(value) => handleClienteChange(parseInt(value))}
                placeholder="Seleccione un cliente"
              />
              </div>

              {asociacionData.clienteId && (
                <div>
                  <Label>Paquetes Disponibles</Label>
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
                        {paquetesDisponibles.map((paquete: Paquete) => (
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
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow className="text-sm text-left">
                <TableCell isHeader className="py-3">#</TableCell>
                <TableCell isHeader className="py-3">Tipo</TableCell>
                <TableCell isHeader className="py-3">Origen → Destino</TableCell>
                <TableCell isHeader className="py-3">Fechas</TableCell>
                <TableCell isHeader className="py-3">Estado</TableCell>
                <TableCell isHeader className="py-3">Paquetes</TableCell>
                <TableCell isHeader className="py-3">Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="text-left divide-y divide-gray-200">
              {envios.map((envio, index) => (
                <TableRow key={envio.numero} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-800'}>
                  <TableCell className="text-sm font-semibold">ENV-{envio.numero}</TableCell>
                  <TableCell>
                    <div className="flex items-left justify-left mx-1 h-full min-h-[32px]">
                      {envio.tipo === 'barco' ? (
                        <ShipIcon className="w-5 h-5" />
                      ) : (
                        <PlaneIcon className="w-5 h-5" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium space-y-1 my-2">
                      <p>{envio.origen.ciudad}, {envio.origen.pais}</p>
                      <p>{envio.destino.ciudad}, {envio.destino.pais}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <p>Salida: {new Date(envio.fechasalida).toLocaleDateString('es-ES')}</p>
                      {envio.fechallegada && (
                        <p>
                            Llegada: {new Date(envio.fechallegada).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{envio.estado}</p>
                  </TableCell>
                  <TableCell className="text-sm">
                    {envio.paquetes.length > 0 ? (
                      <div>
                        <p>{envio.paquetes.length} paquete(s)</p>
                        <p className="text-gray-500">
                          {envio.paquetes.slice(0, 2).map(p => `PKG-${p.id}`).join(', ')}
                          {envio.paquetes.length > 2 && '...'}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-600">Sin paquetes</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-left gap-2">
                      <Button
                        className="hover:bg-teal-500 hover:text-white"
                        variant="outline"
                        size="xs"
                        onClick={() => handleOpenAsociar(envio.numero)}
                        startIcon={<PackagePlusIcon className="w-4 h-4" />}
                      />
                      {user?.rol === 'admin' && (
                        <>
                          <Button
                            className="hover:bg-yellow-500 hover:text-white"
                            variant="outline"
                            size="xs"
                            onClick={() => handleOpenEdit(envio)}
                            startIcon={<PencilIcon className="w-4 h-4" />}
                          />
                          <Button
                            className="hover:bg-red-500 hover:text-white"
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