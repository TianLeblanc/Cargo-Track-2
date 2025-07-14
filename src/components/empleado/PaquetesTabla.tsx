'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { useTheme } from 'next-themes';
import Badge from '../ui/badge/Badge';
import { Modal } from '../ui/modal';
import Button from '@/components/ui/button/Button';
import { PackageSearchIcon, FilterIcon, PlusIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

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
    </div>
  );
}
