'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
//import Badge from "../ui/badge/Badge";
//import Image from "next/image";
//import { PlusIcon } from "@/icons";
import Link from "next/link"
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import Label from '@/components/form/Label';
import TextArea from "@/components/form/input/TextArea";
import Input from '@/components/form/input/InputField';
import PhoneInput from "@/components/form/group-input/PhoneInput";
import PlusIcon from "@/icons/plus.svg"

// Define the TypeScript interface for the table rows
interface Product {
  codigo: number; // Unique identifier for each product
  direccion: string; // Product name
  //variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  telefono: string; // Category of the product
  // status: string; // Status of the product
  
  //status: "Pendiente" | "Entregado" | "Cancelado"; // Status of the product
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    codigo: 1,
    direccion: "RR123456789UY",
    //variants: "1 Variant",
    telefono: "cafecito con pan",
    //status: "Pendiente"
  },
  {
    codigo: 2,
    direccion: "RR123454489UY",
    //variants: "1 Variant",
    telefono: "quesitos sin almendras",
  }
];
 
const countries = [
    { code: "US", label: "+1", example: "+1 555 1234567" },
    { code: "VE", label: "+58", example: "+58 4123456789" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };

export default function AlmacenTabla() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
           Almacenes
          </h3>
        </div>

        <div className="flex items-center gap-3">

          {/* <Button
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-lg border border-green-600 bg-green-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-green-600 hover:text-white dark:border-green-500 dark:bg-green-700 dark:text-white dark:hover:bg-green-600"
          >
          
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4V16"  // Línea vertical
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 10H16"  // Línea horizontal
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            Agregar
          </Button> */}
          <Button onClick={openModal} size="sm" variant="primary" startIcon={<PlusIcon />}>
            Agregar
          </Button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver todo
          </button>
          
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[650px] m-4">
        <div className="no-scrollbar relative w-full  max-h-[650px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
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
                    <Input type="text" defaultValue="" disabled />
                  </div>

                  <div className="col-span-2">
                    <Label>Telefono</Label>
                    <PhoneInput
                      selectPosition="start"
                      countries={countries}
                      onChange={handlePhoneNumberChange}
                    />
                  </div>

                  <h2 className=" font-medium text-gray-800 dark:text-white/90">
                    Dirección
                  </h2>

                  <div className="col-span-2">
                    <Label>Linea 1</Label>
                    <Input type="text" defaultValue="" />
                  </div>
                  <div className="col-span-2">
                    <Label>Linea 2</Label>
                    <Input type="text" defaultValue="" />
                  </div>
                  <div className="col-span-2">
                    <Label>Pais</Label>
                    <Input type="text" defaultValue="" />
                  </div>
                  <div className="col-span-2">
                    <Label>Estado</Label>
                    <Input type="text" defaultValue="" />
                  </div>
                  <div className="col-span-2">
                    <Label>Ciudad</Label>
                    <Input type="text" defaultValue="" />
                  </div>
                  <div className="col-span-2">
                    <Label>Codigo Postal</Label>
                    <Input type="text" defaultValue="" />
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
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200"
              >
                # De Almacen
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-large text-gray-900 text-start text-theme-xl dark:text-gray-200"
              >
                Direccion
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200"
              >
                Telefono
              </TableCell>

            </TableRow>

          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((product) => (
              <TableRow key={product.codigo } className="">

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.codigo}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.direccion}
                      </p>
                      <span className="text-gray-700 text-theme-xs dark:text-gray-400">
                        pepentin
                      </span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  {product.telefono}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}