
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
import { PackageSearchIcon, FilterIcon, PlusIcon, TrashIcon, PencilIcon, ListIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useModal } from "@/hooks/useModal";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Pagination from "@/components/tables/Pagination";

import { PaqueteCompleto, Almacen, Envio } from '@/types/modelsTypes';


export default function PaquetesTabla() {
  // Estado para bloquear botones de formularios
  const [procesando, setProcesando] = useState(false);
  const { user } = useAuth();
  const [paquetes, setPaquetes] = useState<PaqueteCompleto[]>([]);
  const [filteredPaquetes, setFilteredPaquetes] = useState<PaqueteCompleto[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<{ id: number; cedula: string }[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PaqueteCompleto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const successModal = useModal();
  const errorModal = useModal();
  const filterModal = useModal();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredPaquetes.length / itemsPerPage);
  const paginatedPaquetes = filteredPaquetes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const [formData, setFormData] = useState({
    descripcion: '',
    largo: 0, // pulgadas
    ancho: 0, // pulgadas
    alto: 0,  // pulgadas
    peso: 0,  // libras
    volumen: 0, // pies cúbicos
    estado: 'recibido en almacen',
    almacenCodigo: 0,
    empleadoId: user?.id || 0,
    envioNumero: null as number | null
  });

  // Determinar si el usuario es cliente
  const isCliente = user?.rol === 'cliente';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let paquetesData: PaqueteCompleto[] = [];
        let usuariosData: { id: number; cedula: string }[] = [];
        if (isCliente && user?.id) {
          // Obtener solo los paquetes del cliente
          const paquetesResponse = await fetch(`/api/paquete/cliente/${user.id}`);
          if (!paquetesResponse.ok) throw new Error('Error al obtener paquetes del cliente');
          paquetesData = await paquetesResponse.json();
          setPaquetes(paquetesData);
          setFilteredPaquetes(paquetesData);
        } else {
          // Obtener todos los paquetes (admin/empleado)
          const paquetesResponse = await fetch('/api/paquete?include=almacen,envio,empleado');
          if (!paquetesResponse.ok) throw new Error('Error al obtener paquetes');
          paquetesData = await paquetesResponse.json();
          setPaquetes(paquetesData);
          setFilteredPaquetes(paquetesData);
          // Obtener usuarios para búsqueda por cédula
          const usuariosResponse = await fetch('/api/usuarios');
          if (usuariosResponse.ok) {
            usuariosData = await usuariosResponse.json();
            setUsuarios(usuariosData);
          }
        }

        // Obtener almacenes
        const almacenesResponse = await fetch('/api/almacen');
        if (!almacenesResponse.ok) throw new Error('Error al obtener almacenes');
        const almacenesData: Almacen[] = await almacenesResponse.json();
        setAlmacenes(almacenesData);

        // Establecer almacén por defecto
        if (almacenesData.length > 0 && formData.almacenCodigo === 0) {
          setFormData(prev => ({ ...prev, almacenCodigo: almacenesData[0].id }));
        }

      } catch (error) {
        console.error("Error al cargar datos:", error);
        errorModal.openModal();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    // Calcular volumen automáticamente en pies cúbicos
    const { largo, ancho, alto } = formData;
    setFormData(prev => ({
      ...prev,
      volumen: Math.round((largo * ancho * alto / 1728) * 1000) / 1000 // 3 decimales
    }));
  }, [formData.largo, formData.ancho, formData.alto]);

  const openDetailsModal = (paquete: PaqueteCompleto) => {
    if (isCliente) return; // No permitir edición para clientes
    
    setSelected(paquete);
    setFormData({
      descripcion: paquete.descripcion,
      largo: paquete.largo,
      ancho: paquete.ancho,
      alto: paquete.alto,
      peso: paquete.peso,
      volumen: paquete.volumen,
      estado: paquete.estado,
      almacenCodigo: paquete.almacenCodigo,
      empleadoId: paquete.empleadoId,
      envioNumero: paquete.envioNumero ?? null
    });
    setIsCreating(false);
  };

  const openCreateModal = () => {
    if (isCliente) return; // No permitir creación para clientes
    
    setSelected(null);
    setFormData({
      descripcion: '',
      largo: 0,
      ancho: 0,
      alto: 0,
      peso: 0,
      volumen: 0,
      estado: 'En almacen',
      almacenCodigo: almacenes[0]?.id || 0,
      empleadoId: user?.id || 0,
      envioNumero: null
    });
    setIsCreating(true);
  };

  const openDeleteModal = (paquete: PaqueteCompleto) => {
    if (isCliente) return; // No permitir eliminación para clientes
    
    setSelected(paquete);
    setIsDeleting(true);
  };

  const closeModal = () => {
    setSelected(null);
    setIsCreating(false);
    setIsDeleting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'descripcion' || name === 'estado' 
        ? value 
        : parseFloat(value) || 0
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'almacenCodigo' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcesando(true);
    try {
      let response;
      if (isCreating) {
        response = await fetch('/api/paquete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else if (selected) {
        response = await fetch(`/api/paquete/${selected.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (!response?.ok) throw new Error('Error al guardar el paquete');

      const updatedPaquete = await response.json();
      // Actualizar lista de paquetes
      const paquetesResponse = await fetch('/api/paquete?include=almacen,envio,empleado');
      if (!paquetesResponse.ok) throw new Error('Error al actualizar lista de paquetes');
      const paquetesData = await paquetesResponse.json();
      setPaquetes(paquetesData);

      // Filtrar nuevamente si es cliente
      if (isCliente) {
        const filtered = paquetesData.filter((paquete: PaqueteCompleto) => paquete.clienteId === user?.id);
        setFilteredPaquetes(filtered);
      } else {
        setFilteredPaquetes(paquetesData);
      }

      successModal.openModal();
      closeModal();
    } catch (error) {
      console.error("Error al guardar paquete:", error);
      errorModal.openModal();
    } finally {
      setProcesando(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setProcesando(true);
    try {
      const response = await fetch(`/api/paquete/${selected.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar el paquete');

      // Actualizar lista después de eliminar
      const paquetesResponse = await fetch('/api/paquete?include=almacen,envio,empleado');
      if (!paquetesResponse.ok) throw new Error('Error al actualizar lista de paquetes');
      const paquetesData = await paquetesResponse.json();
      setPaquetes(paquetesData);

      // Filtrar nuevamente si es cliente
      if (isCliente) {
       const filtered = paquetesData.filter((paquete: PaqueteCompleto) => paquete.clienteId === user?.id);
        setFilteredPaquetes(filtered);
      } else {
        setFilteredPaquetes(paquetesData);
      }

      successModal.openModal();
      closeModal();
    } catch (error) {
      console.error("Error al eliminar paquete:", error);
      errorModal.openModal();
    } finally {
      setProcesando(false);
    }
  };

  if (loading) return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex justify-center items-center h-64">
        <p>Cargando paquetes...</p>
      </div>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 pb-6 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            <PackageSearchIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Gestión de Paquetes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isCliente ? 'Tus paquetes' : 'Listado completo de paquetes del sistema'}
            </p>
          </div>
        </div>

        {/* Navbar de búsqueda por cédula solo para admin/empleado */}
        {!isCliente && (
          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 max-w-full">
            <div className="relative flex items-center gap-2">
              {showSearch && (
                <input
                  ref={searchInputRef}
                  type="text"
                  className="ml-2 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  placeholder="Buscar por cédula..."
                  value={searchTerm}
                  onChange={async (e) => {
                    setSearchTerm(e.target.value);
                    const cedula = e.target.value.trim();
                    if (cedula.length === 0) {
                      setFilteredPaquetes(paquetes);
                      return;
                    }
                    // Buscar usuario por coincidencia exacta de cédula
                    const usuarioEncontrado = usuarios.find(u => u.cedula === cedula);
                    if (usuarioEncontrado) {
                      try {
                        const res = await fetch(`/api/paquete/cliente/${usuarioEncontrado.id}`);
                        if (res.ok) {
                          const data = await res.json();
                          setFilteredPaquetes(data);
                        } else {
                          setFilteredPaquetes([]);
                        }
                      } catch {
                        setFilteredPaquetes([]);
                      }
                    } else {
                      setFilteredPaquetes([]);
                    }
                  }}
                  style={{ minWidth: 180, maxWidth: 250 }}
                />
              )}
              <Button
                onClick={() => {
                  setShowSearch((prev) => !prev);
                  setTimeout(() => {
                    if (!showSearch && searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }, 100);
                }}
                size="xs"
                variant="outline"
                className="hover:bg-sky-500 hover:text-white whitespace-nowrap"
                startIcon={<PackageSearchIcon className="w-5 h-5"/>}
              >
              </Button>
            </div>
            <Button 
              onClick={openCreateModal}
              className="hover:bg-green-500 hover:text-white whitespace-nowrap" 
              size="xs"
              variant="outline" 
              startIcon={<PlusIcon className="w-5 h-5"/>}
            >
              Agregar Paquete
            </Button>
            <Button
              onClick={() => {
                setSearchTerm("");
                setShowSearch(false);
                setFilteredPaquetes(paquetes);
              }}
              size="xs"
              variant="outline"
              className="hover:bg-gray-500 hover:text-white whitespace-nowrap"
              startIcon={<ListIcon className="w-5 h-5"/>}
            >
              Ver todo
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-300 dark:border-gray-800">
            <TableRow className="text-sm text-left"> 
              <TableCell isHeader className="py-3">ID</TableCell>
              <TableCell isHeader className="py-3">Descripción</TableCell>
              <TableCell isHeader className="py-3">Ubicación</TableCell>
              <TableCell isHeader className="py-3">Envío</TableCell>
              <TableCell isHeader className="py-3">Estado</TableCell>
              {!isCliente && <TableCell isHeader className="py-3">Acciones</TableCell>}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-300 dark:divide-gray-800">
            {paginatedPaquetes.map((paquete, index) => (
              <TableRow key={paquete.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-800'}>
                <TableCell className="text-sm font-semibold">
                  <div className="my-2">PAQ-{paquete.id.toString().padStart(4, '0')}</div>
                </TableCell>
                <TableCell className="text-sm text-gray-800 dark:text-gray-300">
                  {paquete.descripcion}
                </TableCell>
                <TableCell className="text-sm">
                  {paquete.almacen.ciudad}, {paquete.almacen.estado}
                </TableCell>
                <TableCell className="text-sm">
                  {paquete.envio ? `ENV-${paquete.envio.numero}` : 'NO ASIGNADO'}
                </TableCell>
                <TableCell>
                  <Badge
                    size="sm"
                    color={
                      paquete.estado === "despachado"
                        ? "success"
                        : paquete.estado === "en tránsito"
                        ? "info"
                        : paquete.estado === "disponible para despacho"
                        ? "warning"
                        : "primary"
                    }
                  >
                    {paquete.estado}
                  </Badge>
                </TableCell>
                {!isCliente && (
                  <TableCell>
                    <div className="flex gap-2 my-1">
                      <Button
                        className="hover:bg-yellow-500 hover:text-white"
                        variant="outline"
                        size="xs"
                        onClick={() => openDetailsModal(paquete)}
                        startIcon={<PencilIcon className="w-4 h-4" />}
                      >
                      </Button>
                      <Button
                        className="hover:bg-red-500 hover:text-white"
                        variant="outline"
                        size="xs"
                        onClick={() => openDeleteModal(paquete)}
                        startIcon={<TrashIcon className="w-4 h-4" />}
                      >
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

      </div>

      {/* Modal de creación/edición - Solo para no clientes */}
      {!isCliente && (
        <>
          <Modal isOpen={!!selected || isCreating} onClose={closeModal} className="max-w-2xl">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90 flex items-center gap-2">
                <PackageSearchIcon className="w-5 h-5" />
                {isCreating ? 'Nuevo Paquete' : `Editar Paquete PKG-${selected?.id.toString().padStart(4, '0')}`}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Información del Paquete</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                          <Input
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col justify-end h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Largo (pulgadas)</label>
                            <Input
                              type="number"
                              name="largo"
                              value={formData.largo}
                              onChange={handleInputChange}
                              min="0"
                              step={0.01}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col justify-end h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ancho (pulgadas)</label>
                            <Input
                              type="number"
                              name="ancho"
                              value={formData.ancho}
                              onChange={handleInputChange}
                              min="0"
                              step={0.01}
                              className="w-full"
                            />
                          </div>
                          <div className="flex flex-col justify-end h-full">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alto (pulgadas)</label>
                            <Input
                              type="number"
                              name="alto"
                              value={formData.alto}
                              onChange={handleInputChange}
                              min="0"
                              step={0.01}
                              className="w-full"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (libras)</label>
                            <Input
                              type="number"
                              name="peso"
                              value={formData.peso}
                              onChange={handleInputChange}
                              min="0"
                              step={0.01}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volumen (ft³)</label>
                            <Input
                              type="number"
                              name="volumen"
                              value={formData.volumen}
                              disabled
                              step={0.01}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ubicación y Estado</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Almacén</label>
                          <Select
                            options={almacenes.map(almacen => ({
                              value: almacen.id.toString(),
                              label: `${almacen.id}, ${almacen.pais}`
                            }))}
                            value={formData.almacenCodigo.toString()}
                            onChange={(value) => handleSelectChange('almacenCodigo', value)}
                          />
                        </div>
                        {!isCreating && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Estado
                            </label>
                            <Select
                              options={[
                                { value: 'recibido en almacen', label: 'Recibido en almacén' },
                                { value: 'en transito', label: 'En tránsito' },
                                { value: 'disponible para despacho', label: 'Disponible para despacho' },
                                { value: 'despachado', label: 'Despachado' },
                              ]}
                              value={formData.estado}
                              onChange={(value) => handleSelectChange('estado', value)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-6">
                  <Button variant="outline" onClick={closeModal} disabled={procesando}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary" disabled={procesando}>
                    {procesando
                      ? (
                        <span className="flex items-center gap-2 justify-center">
                          <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                          Procesando...
                        </span>
                      )
                      : (isCreating ? 'Crear Paquete' : 'Guardar Cambios')
                    }
                  </Button>
                </div>
              </form>
            </div>
          </Modal>

          {/* Modal de confirmación de eliminación */}
          <Modal isOpen={isDeleting} onClose={closeModal} className="max-w-md">
            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
                Confirmar Eliminación
              </h2>
              <p className="mb-6">
                ¿Estás seguro que deseas eliminar el paquete PKG-{selected?.id.toString().padStart(4, '0')}? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeModal} disabled={procesando}>
                  Cancelar
                </Button>
                <Button variant="primary" color="danger" onClick={handleDelete} disabled={procesando}>
                  {procesando
                    ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin h-4 w-4 text-gray-400" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                        Procesando...
                      </span>
                    )
                    : 'Eliminar'
                  }
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}

      <Modal isOpen={successModal.isOpen} onClose={successModal.closeModal} className="max-w-[600px] p-5 lg:p-10">
        <div className="text-center">
          <div className="relative flex items-center justify-center z-1 mb-7">
            <svg className="fill-success-50 dark:fill-success-500/15" width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z" fill="" fillOpacity=""/>
            </svg>
            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <svg className="fill-success-600 dark:fill-success-500" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.9375 19.0004C5.9375 11.7854 11.7864 5.93652 19.0014 5.93652C26.2164 5.93652 32.0653 11.7854 32.0653 19.0004C32.0653 26.2154 26.2164 32.0643 19.0014 32.0643C11.7864 32.0643 5.9375 26.2154 5.9375 19.0004ZM19.0014 2.93652C10.1296 2.93652 2.9375 10.1286 2.9375 19.0004C2.9375 27.8723 10.1296 35.0643 19.0014 35.0643C27.8733 35.0643 35.0653 27.8723 35.0653 19.0004C35.0653 10.1286 27.8733 2.93652 19.0014 2.93652ZM24.7855 17.0575C25.3713 16.4717 25.3713 15.522 24.7855 14.9362C24.1997 14.3504 23.25 14.3504 22.6642 14.9362L17.7177 19.8827L15.3387 17.5037C14.7529 16.9179 13.8031 16.9179 13.2173 17.5037C12.6316 18.0894 12.6316 19.0392 13.2173 19.625L16.657 23.0647C16.9383 23.346 17.3199 23.504 17.7177 23.504C18.1155 23.504 18.4971 23.346 18.7784 23.0647L24.7855 17.0575Z" fill=""/>
              </svg>
            </span>
          </div>
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Operación Exitosa!
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            La operación se ha completado correctamente.
          </p>
          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button type="button" onClick={successModal.closeModal} className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-success-500 shadow-theme-xs hover:bg-success-600 sm:w-auto">
              Aceptar
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={errorModal.isOpen} onClose={errorModal.closeModal} className="max-w-[600px] p-5 lg:p-10">
        <div className="text-center">
          <div className="relative flex items-center justify-center z-1 mb-7">
            <svg className="fill-error-50 dark:fill-error-500/15" width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z" fill="" fillOpacity=""/>
            </svg>
            <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
              <svg className="fill-error-600 dark:fill-error-500" width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z" fill=""/>
              </svg>
            </span>
          </div>
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
            Error!
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Ha ocurrido un error al procesar la solicitud.
          </p>
          <div className="flex items-center justify-center w-full gap-3 mt-7">
            <button type="button" onClick={errorModal.closeModal} className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600 sm:w-auto">
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}