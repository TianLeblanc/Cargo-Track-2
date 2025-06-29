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
import Select from "@/components/form/Select";
import PlusIcon from "@/icons/plus.svg"

// Define la interfaz TypeScript para las facturas
interface Factura {
  id: string;
  estado: "generado" | "pagado";
  montoTotal: number;
  metodoPago: string;
  cantidadPiezas: number;
  cantidadPaquetes: number;
  montoPorPaquete: number;
  pdfUrl: string;
  fecha: string;
}

// Datos de ejemplo para la tabla
const facturasData: Factura[] = [
  {
    id: "FAC-001",
    estado: "generado",
    montoTotal: 1250.50,
    metodoPago: "Transferencia",
    cantidadPiezas: 15,
    cantidadPaquetes: 3,
    montoPorPaquete: 416.83,
    pdfUrl: "/facturas/fac-001.pdf",
    fecha: "2023-05-15"
  },
  {
    id: "FAC-002",
    estado: "pagado",
    montoTotal: 890.75,
    metodoPago: "Efectivo",
    cantidadPiezas: 8,
    cantidadPaquetes: 2,
    montoPorPaquete: 445.38,
    pdfUrl: "/facturas/fac-002.pdf",
    fecha: "2023-05-18"
  },
  {
    id: "FAC-003",
    estado: "generado",
    montoTotal: 3420.00,
    metodoPago: "Tarjeta",
    cantidadPiezas: 25,
    cantidadPaquetes: 5,
    montoPorPaquete: 684.00,
    pdfUrl: "/facturas/fac-003.pdf",
    fecha: "2023-05-20"
  }
];

const metodosPago = [
  { value: "transferencia", label: "Transferencia" },
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta", label: "Tarjeta" },
  { value: "cheque", label: "Cheque" }
];

export default function FacturasTabla() {
  const { isOpen, openModal, closeModal } = useModal();
  
  const handleSave = () => {
    console.log("Guardando factura...");
    closeModal();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Facturas
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={openModal} size="sm" variant="primary" startIcon={<PlusIcon />}>
            Nueva Factura
          </Button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver todo
          </button>
        </div>
      </div>

      {/* Modal para nueva factura */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[650px] m-4">
        <div className="relative flex h-full max-h-[650px] flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-4 lg:p-11">

          {/* Header */}
          <div className="px-2 pr-14 flex-shrink-0">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Nueva Factura
            </h4>
            <p className="mb-6 text-md text-gray-500 dark:text-gray-400 lg:mb-7">
              Complete los datos de la factura.
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-3">
            <form className="flex flex-col">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Información de Factura
                </h5>

                <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Estado</Label>
                    <Select
                      options={[
                        { value: "generado", label: "Generado" },
                        { value: "pagado", label: "Pagado" },
                      ]}
                      placeholder="Seleccione estado"
                      onChange={(option) => {
                        console.log("Estado seleccionado:", option)
                      }}
                    />
                  </div>

                  <div>
                    <Label>Método de Pago</Label>
                    <Select
                      options={metodosPago}
                      placeholder="Seleccione método"
                      onChange={(option) => {
                        console.log("Metodo de Pago", option)
                      }}
                    />
                  </div>

                  <div>
                    <Label>Monto Total</Label>
                    <Input type="number" />
                  </div>

                  <div>
                    <Label>Fecha</Label>
                    <Input type="date" />
                  </div>

                  <div>
                    <Label>Cantidad de Piezas</Label>
                    <Input type="number" />
                  </div>

                  <div>
                    <Label>Cantidad de Paquetes</Label>
                    <Input type="number" />
                  </div>

                  <div className="col-span-2">
                    <Label>Notas</Label>
                    <TextArea rows={3} />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-2 mt-6 flex items-center gap-3 lg:justify-end">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave}>
              Guardar Factura
            </Button>
          </div>
        </div>
      </Modal>


      {/* Tabla de facturas */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                ID Factura
              </TableCell>
              
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                Estado
              </TableCell>
              
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                Monto Total
              </TableCell>
              
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                Método Pago
              </TableCell>
              
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                Piezas/Paquetes
              </TableCell>
              
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                Monto x Paquete
              </TableCell>
              
              <TableCell isHeader className="py-3 font-large text-gray-900 text-start text-theme-xs dark:text-gray-200">
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {facturasData.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {factura.id}
                  </p>
                  <span className="text-gray-700 text-theme-xs dark:text-gray-400">
                    {factura.fecha}
                  </span>
                </TableCell>
                
                <TableCell className="py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    factura.estado === "pagado" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {factura.estado === "pagado" ? "Pagado" : "Generado"}
                  </span>
                </TableCell>
                
                <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  ${factura.montoTotal.toFixed(2)}
                </TableCell>
                
                <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  {factura.metodoPago}
                </TableCell>
                
                <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  {factura.cantidadPiezas} / {factura.cantidadPaquetes}
                </TableCell>
                
                <TableCell className="py-3 text-gray-700 text-theme-sm dark:text-gray-400">
                  ${factura.montoPorPaquete.toFixed(2)}
                </TableCell>
                
                <TableCell className="py-3">
                  <div className="flex gap-2">
                    <Link 
                      href={factura.pdfUrl}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Ver PDF
                    </Link>
                    <button 
                      onClick={openModal}
                      className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Editar
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}