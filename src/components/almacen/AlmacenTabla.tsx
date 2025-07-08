'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link"
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import Label from '@/components/form/Label';
import TextArea from "@/components/form/input/TextArea";
import Input from '@/components/form/input/InputField';
import PhoneInput from "@/components/form/group-input/PhoneInput";
import PlusIcon from "@/icons/plus.svg"
import { useEffect, useState } from "react";
import { AlmacenService } from "@/lib/bd";

// Define la interfaz TypeScript para las filas de la tabla
interface Almacen {
  codigo: number;
  telefono: string;
  linea1: string;
  linea2?: string;
  pais: string;
  estado: string;
  ciudad: string;
  codigoPostal: string;
}

const countries = [
  { code: "US", label: "+1", example: "+1 555 1234567" },
  { code: "VE", label: "+58", example: "+58 4123456789" },
];

export default function AlmacenTabla() {
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [formData, setFormData] = useState<Omit<Almacen, 'codigo'>>({
    telefono: '',
    linea1: '',
    linea2: '',
    pais: '',
    estado: '',
    ciudad: '',
    codigoPostal: ''
  });
  const [loading, setLoading] = useState(true);
  const { isOpen, openModal, closeModal } = useModal();

  // Cargar almacenes al montar el componente
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
      // Resetear el formulario
      setFormData({
        telefono: '',
        linea1: '',
        linea2: '',
        pais: '',
        estado: '',
        ciudad: '',
        codigoPostal: ''
      });
    } catch (error) {
      console.error("Error al crear almacén:", error);
    }
  };

  if (loading) {
    return <div>Cargando almacenes...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Almacenes
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={openModal} size="sm" variant="primary" startIcon={<PlusIcon />}>
            Agregar
          </Button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver todo
          </button>
        </div>
      </div>
      
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[650px] m-4">
        <div className="no-scrollbar relative w-full max-h-[650px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Registro de Almacen
            </h4>
            <p className="mb-6 text-md text-gray-500 dark:text-gray-400 lg:mb-7">
              Llene los datos solicitados para registrar un nuevo almacen.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[550px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Info de Almacen
                </h5>
                <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2">
                    <Label>Codigo</Label>
                    <Input type="text" defaultValue="Auto-generado" disabled />
                  </div>

                  <div className="col-span-2">
                    <Label>Telefono</Label>
                    <PhoneInput
                      selectPosition="start"
                      countries={countries}
                      onChange={handlePhoneNumberChange}
                    />
                  </div>

                  <h2 className="font-medium text-gray-800 dark:text-white/90">
                    Dirección
                  </h2>

                  <div className="col-span-2">
                    <Label>Linea 1</Label>
                    <Input 
                      type="text" 
                      name="linea1"
                      value={formData.linea1}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Linea 2</Label>
                    <Input 
                      type="text" 
                      name="linea2"
                      value={formData.linea2 || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Pais</Label>
                    <Input 
                      type="text" 
                      name="pais"
                      value={formData.pais}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Estado</Label>
                    <Input 
                      type="text" 
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Ciudad</Label>
                    <Input 
                      type="text" 
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Codigo Postal</Label>
                    <Input 
                      type="text" 
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                # De Almacen
              </TableCell>
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xl dark:text-gray-200">
                Dirección
              </TableCell>
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                Teléfono
              </TableCell>
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                Ciudad
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {almacenes.map((almacen) => (
              <TableRow key={almacen.codigo} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {almacen.codigo}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {almacen.linea1}
                      </p>
                      <span className="text-gray-700 text-theme-xs dark:text-gray-400">
                        {almacen.linea2 || 'Sin línea 2'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  {almacen.telefono}
                </TableCell>

                <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  {almacen.ciudad}, {almacen.estado}, {almacen.pais}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}