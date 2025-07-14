'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";

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

export default function FacturasTabla() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Facturas
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Visualización de facturas registradas
          </p>
        </div>
      </div>

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
                PDF
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
                
                <TableCell className="py-3">
                  <Link 
                    href={factura.pdfUrl}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Ver
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}