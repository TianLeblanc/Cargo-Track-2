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
import PlusIcon from "@/icons/plus.svg";
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
  const [loading, setLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const fetchAlmacenes = async () => {
      try {
        const data = await AlmacenService.getAll();
        setAlmacenes(data);
      } catch (error) {
        console.error("Error al cargar almacenes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlmacenes();
  }, []);

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setFormData({ ...formData, telefono: phoneNumber });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
   
    try {
      const nuevoAlmacen = await AlmacenService.create(formData);
      setAlmacenes([...almacenes, nuevoAlmacen]);
      closeModal();
      setFormData({
        telefono: '',
        linea1: '',
        linea2: '',
        pais: '',
        estado: '',
        ciudad: '',
        codpostal: ''
      });
    } catch (error) {
      console.error("Error al crear almacén:", error);
    }
  };

  if (loading) return <div>Cargando almacenes...</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Almacenes</h3>
        <div className="flex items-center gap-3">
          <Button onClick={openModal} size="sm" variant="primary" startIcon={<PlusIcon />}>
            Agregar
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[650px] m-4">
        <div className="relative w-full max-h-[650px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Registro de Almacén</h4>
          <p className="mb-6 text-md text-gray-500 dark:text-gray-400 lg:mb-7">
            Llene los datos solicitados para registrar un nuevo almacén.
          </p>

          <form className="flex flex-col">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2">
                <Label>Teléfono</Label>
                <PhoneInput
                  selectPosition="start"
                  countries={countries}
                  onChange={handlePhoneNumberChange}
                />
              </div>

              <div className="col-span-2">
                <Label>Línea 1</Label>
                <Input name="linea1" value={formData.linea1} onChange={handleInputChange} />
              </div>

              <div className="col-span-2">
                <Label>Línea 2</Label>
                <Input name="linea2" value={formData.linea2 || ''} onChange={handleInputChange} />
              </div>

              <div className="col-span-2">
                <Label>País</Label>
                <Input name="pais" value={formData.pais} onChange={handleInputChange} />
              </div>

              <div className="col-span-2">
                <Label>Estado</Label>
                <Input name="estado" value={formData.estado} onChange={handleInputChange} />
              </div>

              <div className="col-span-2">
                <Label>Ciudad</Label>
                <Input name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
              </div>

              <div className="col-span-2">
                <Label>Código Postal</Label>
                <Input name="codpostal" value={formData.codpostal} onChange={handleInputChange} />
              </div>
            </div>
          </form>

          <div className="flex items-center gap-3 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button size="sm" onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      </Modal>

      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-y border-gray-100 dark:border-gray-800">
            <TableRow>
              <TableCell isHeader>#</TableCell>
              <TableCell isHeader>Dirección</TableCell>
              <TableCell isHeader>Teléfono</TableCell>
              <TableCell isHeader>Ubicación</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {almacenes.map((almacen) => (
              <TableRow key={almacen.id}>
                <TableCell>{almacen.id}</TableCell>
                <TableCell>
                  {almacen.linea1}<br />
                  <small>{almacen.linea2 || 'Sin línea 2'}</small>
                </TableCell>
                <TableCell>{almacen.telefono}</TableCell>
                <TableCell>{almacen.ciudad}, {almacen.estado}, {almacen.pais}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
