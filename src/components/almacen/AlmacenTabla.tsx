import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { PlusIcon } from "@/icons";
import Link from "next/link"

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
 
export default function AlmacenTabla() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
           Casillero
          </h3>
        </div>

        <div className="flex items-center gap-3">

          <Link
  href="/agregar_almacen"
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
            
          </Link>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver todo
          </button>
          
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-900 text-start text-theme-xs dark:text-gray-200"
              >
                # De Almacen
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-900 text-start text-theme-xs dark:text-gray-200"
              >
                Direccion
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-900 text-start text-theme-xs dark:text-gray-200"
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