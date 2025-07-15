'use client';

import {
  Table, TableBody, TableCell, TableHeader, TableRow
} from "../ui/table";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import PhoneInput from "@/components/form/group-input/PhoneInput";
import { PencilIcon, TrashIcon, PlusIcon, FilterIcon, ListIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { AlmacenService } from "@/services/almacenService";

interface Almacen {
  id: number;
  telefono: string;
  linea1: string;
  linea2?: string | null;
  pais: string;
  estado: string;
  ciudad: string;
  codpostal: string;
}

const countries = [
  { code: "US", label: "+1", example: "+1 555 1234567" },
  { code: "VE", label: "+58", example: "+58 4123456789" },
];

export default function AlmacenTabla() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [formData, setFormData] = useState({
    telefono: '',
    linea1: '',
    linea2: '',
    pais: '',
    estado: '',
    ciudad: '',
    codpostal: ''
  });
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    fetchAlmacenes();
  }, []);

  const fetchAlmacenes = async () => {
    try {
      setLoading(true);
      const data = await AlmacenService.getAll();
      setAlmacenes(data);
    } catch (error) {
      alert("Error al cargar almacenes");
      console.error("Error al cargar almacenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setFormData({ ...formData, telefono: phoneNumber });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      telefono: '',
      linea1: '',
      linea2: '',
      pais: '',
      estado: '',
      ciudad: '',
      codpostal: ''
    });
    setCurrentId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    openModal();
  };

  const handleOpenEdit = (almacen: Almacen) => {
    setFormData({
      telefono: almacen.telefono,
      linea1: almacen.linea1,
      linea2: almacen.linea2 || '',
      pais: almacen.pais,
      estado: almacen.estado,
      ciudad: almacen.ciudad,
      codpostal: almacen.codpostal
    });
    setCurrentId(almacen.id);
    openModal();
  };

  const handleSubmit = async () => {
    try {
      if (currentId) {
        await AlmacenService.update(currentId, formData);
        alert("Almacén actualizado correctamente");
      } else {
        await AlmacenService.create(formData);
        alert("Almacén creado correctamente");
      }
      fetchAlmacenes();
      closeModal();
      resetForm();
    } catch (error) {
      alert("Error al guardar el almacén");
      console.error("Error al guardar:", error);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await AlmacenService.delete(deleteId);
      alert("Almacén eliminado correctamente");
      fetchAlmacenes();
    } catch (error) {
      alert("Error al eliminar el almacén");
      console.error("Error al eliminar:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  // Filtrado por término de búsqueda
  const almacenesFiltrados = almacenes.filter((almacen) => {
    const term = searchTerm.toLowerCase();
    return (
      almacen.linea1.toLowerCase().includes(term) ||
      (almacen.linea2 && almacen.linea2.toLowerCase().includes(term)) ||
      almacen.ciudad.toLowerCase().includes(term) ||
      almacen.estado.toLowerCase().includes(term) ||
      almacen.pais.toLowerCase().includes(term) ||
      almacen.telefono.toLowerCase().includes(term) ||
      almacen.codpostal.toLowerCase().includes(term)
    );
  });

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
        <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestión de Almacenes</h2>
          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 max-w-full">
            <Button 
              onClick={handleOpenCreate}
              className="hover:bg-green-500 hover:text-white whitespace-nowrap" 
              size="sm"
              variant="outline" 
              startIcon={<PlusIcon className="w-5 h-5"/>}
            >
              Agregar Almacén
            </Button>

            {/* Filtro y barra de búsqueda */}
            <div className="relative flex items-center gap-2">
              <Button
                onClick={() => {
                  setShowSearch((prev) => !prev);
                  setTimeout(() => {
                    if (!showSearch && searchInputRef.current) {
                      searchInputRef.current.focus();
                    }
                  }, 100);
                }}
                size="sm"
                variant="outline"
                className="hover:bg-sky-500 hover:text-white whitespace-nowrap"
                startIcon={<FilterIcon className="w-5 h-5"/>}
              >
                Filtrar
              </Button>
              {showSearch && (
                <input
                  ref={searchInputRef}
                  type="text"
                  className="ml-2 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  placeholder="Buscar almacén..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ minWidth: 180, maxWidth: 250 }}
                />
              )}
            </div>

            <Button
              onClick={() => {
                setSearchTerm("");
                setShowSearch(false);
              }}
              size="sm"
              variant="outline"
              className="hover:bg-gray-500 hover:text-white whitespace-nowrap"
              startIcon={<ListIcon className="w-5 h-5"/>}
            >
              Ver todo
            </Button>
          </div>
        </div>

        {/* Modal Crear/Editar */}
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-3xl">
          <div className="p-6 space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {currentId ? "Editar Almacén" : "Registrar Nuevo Almacén"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Teléfono*</Label>
                <PhoneInput
                  selectPosition="start"
                  countries={countries}
                  onChange={handlePhoneNumberChange}
                  value={formData.telefono}
                />
              </div>
              <div>
                <Label>Línea 1*</Label>
                <Input name="linea1" value={formData.linea1} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Línea 2</Label>
                <Input name="linea2" value={formData.linea2} onChange={handleInputChange} />
              </div>
              <div>
                <Label>País*</Label>
                <Input name="pais" value={formData.pais} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Estado/Provincia*</Label>
                <Input name="estado" value={formData.estado} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Ciudad*</Label>
                <Input name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Código Postal*</Label>
                <Input name="codpostal" value={formData.codpostal} onChange={handleInputChange} />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { closeModal(); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {currentId ? "Guardar Cambios" : "Guardar"}
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
                <TableCell isHeader>Dirección</TableCell>
                <TableCell isHeader>Teléfono</TableCell>
                <TableCell isHeader>Ubicación</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {almacenesFiltrados.map((almacen, index) => (
                <TableRow key={almacen.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                  <TableCell className="font-semibold">{almacen.id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{almacen.linea1}</p>
                      {almacen.linea2 && <p className="text-sm text-gray-900">{almacen.linea2}</p>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">{almacen.telefono}</TableCell>
                  <TableCell>
                    <p>{almacen.ciudad}, {almacen.estado}</p>
                    <p className="text-sm text-gray-500">{almacen.pais} {almacen.codpostal}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        className="hover:bg-yellow-500 hover:text-white"
                        variant="outline"
                        size="xs"
                        onClick={() => handleOpenEdit(almacen)}
                        startIcon={<PencilIcon className="w-4 h-4" />}
                      >
                      </Button>
                      <Button
                        className="hover:bg-red-500 hover:text-white"
                        variant="outline"
                        size="xs"
                        onClick={() => handleDelete(almacen.id)}
                        startIcon={<TrashIcon className="w-4 h-4" />}
                        disabled={isDeleting}
                      >
                      </Button>
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
          <p>¿Estás seguro que deseas eliminar este almacén? Esta acción no se puede deshacer.</p>
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
