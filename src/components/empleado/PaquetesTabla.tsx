'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useTheme } from 'next-themes';
import { Modal } from "../ui/modal";
import Badge from '../ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { PackageSearchIcon, FilterIcon, PlusIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/context/AuthContext';
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";


// Tipos
import { PaqueteCompleto, Almacen } from '@/types/modelsTypes';

export default function PaquetesTabla() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [paquetes, setPaquetes] = useState<PaqueteCompleto[]>([]);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PaqueteCompleto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const successModal = useModal();
  const errorModal = useModal();
  const filterModal = useModal();

  const [formData, setFormData] = useState({
    descripcion: '',
    largo: 0,
    ancho: 0,
    alto: 0,
    peso: 0,
    volumen: 0,
    estado: 'recibido en almacen',
    almacenCodigo: 0,
    empleadoId: user?.id || 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const paquetesResponse = await fetch('/api/paquete?include=almacen,envio,empleado');
        if (!paquetesResponse.ok) throw new Error('Error al obtener paquetes');
        const paquetesData: PaqueteCompleto[] = await paquetesResponse.json();
        setPaquetes(paquetesData);

        const almacenesResponse = await fetch('/api/almacen');
        if (!almacenesResponse.ok) throw new Error('Error al obtener almacenes');
        const almacenesData: Almacen[] = await almacenesResponse.json();
        setAlmacenes(almacenesData);

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
  }, []);

  useEffect(() => {
    const { largo, ancho, alto } = formData;
    setFormData(prev => ({
      ...prev,
      volumen: (largo * ancho * alto) / 1000000
    }));
  }, [formData.largo, formData.ancho, formData.alto]);

  const openDetailsModal = (paquete: PaqueteCompleto) => {
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
      empleadoId: paquete.empleadoId
    });
    setIsCreating(false);
  };

  const openCreateModal = () => {
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
      empleadoId: user?.id || 0
    });
    setIsCreating(true);
  };

  const openDeleteModal = (paquete: PaqueteCompleto) => {
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

      successModal.openModal();
      closeModal();
    } catch (error) {
      console.error("Error al guardar paquete:", error);
      errorModal.openModal();
    }
  };

  const columns = useMemo<MRT_ColumnDef<PaqueteCompleto>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        Cell: ({ cell }) => `PKG-${cell.getValue<number>().toString().padStart(4, '0')}`,
      },
      {
        accessorKey: 'descripcion',
        header: 'Descripción',
        
      },
      {
        accessorKey: 'almacen',
        header: 'Ubicación',
        Cell: ({ row }) => {
          const a = row.original.almacen;
          return `${a.ciudad}, ${a.estado}`;
        },
      },
      {
        accessorKey: 'envio',
        header: 'Envío',
        Cell: ({ row }) => row.original.envio ? `ENV-${row.original.envio.numero}` : 'No asignado',
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        Cell: ({ cell }) => {
          const estado = cell.getValue<string>();
          const color =
            estado === 'despachado' ? 'success' :
            estado === 'en tránsito' ? 'info' :
            estado === 'disponible para despacho' ? 'warning' :
            'primary';
          return <Badge size="sm" color={color}>{estado}</Badge>;
        },
      },
      {
        header: 'Acciones',
        id: 'acciones',
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={() => openDetailsModal(row.original)}
              startIcon={<PencilIcon className="w-4 h-4" />}
            />
            <Button
              variant="outline"
              size="xs"
              color="danger"
              onClick={() => openDeleteModal(row.original)}
              startIcon={<TrashIcon className="w-4 h-4" />}
            />
          </div>
        ),
      },
    ],
    [openDetailsModal, openDeleteModal]
  );

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
              Listado completo de paquetes del sistema
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={filterModal.openModal}
            startIcon={<FilterIcon className="h-4 w-4" />}
          >
            Filtrar
          </Button>
          <Button 
            size="sm" 
            onClick={openCreateModal}
            startIcon={<PlusIcon className="h-4 w-4" />}
          >
            Nuevo Paquete
          </Button>
        </div>
      </div>

      <MaterialReactTable
        columns={columns}
        data={paquetes}
        enableColumnFilters={true}
        enablePagination
        enableSorting
        enableTopToolbar
        muiTableProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden',
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            fontWeight: 'bold',
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
          },
        }}
      />
      {/* Modal de creación/edición */}
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
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Largo (cm)</label>
                              <Input
                                type="number"
                                name="largo"
                                value={formData.largo}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ancho (cm)</label>
                              <Input
                                type="number"
                                name="ancho"
                                value={formData.ancho}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alto (cm)</label>
                              <Input
                                type="number"
                                name="alto"
                                value={formData.alto}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso (kg)</label>
                              <Input
                                type="number"
                                name="peso"
                                value={formData.peso}
                                onChange={handleInputChange}
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volumen (m³)</label>
                              <Input
                                type="number"
                                name="volumen"
                                value={formData.volumen}
                                disabled
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
                    <Button variant="outline" onClick={closeModal}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary">
                      {isCreating ? 'Crear Paquete' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </form>
              </div>
            </Modal>
    </div>
    
  );
}
