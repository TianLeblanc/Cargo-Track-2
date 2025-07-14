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
import { PencilIcon, TrashIcon } from "lucide-react";
import { CheckCircleIcon } from "@/icons";
import { useEffect, useState } from "react";
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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Almacenes</h2>
          <Button 
            onClick={handleOpenCreate} 
            size="sm" 
            variant="primary" 
            startIcon={<CheckCircleIcon />}
          >
            Agregar Almacén
          </Button>
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
              {almacenes.map((almacen, index) => (
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
                        variant="outline"
                        size="xs"
                        onClick={() => handleOpenEdit(almacen)}
                        startIcon={<PencilIcon className="w-4 h-4" />}
                      >
                      </Button>
                      <Button
                        variant="outline"
                        color="danger"
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
