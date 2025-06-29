import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link"

// Define the TypeScript interface for the table rows
interface Usuario {
  cedula: string;
  nombre:string ; 
  nombre2: string; // Product name
  apellido: string; // Category of the product
  apellido2: string;
  rol: "admin" | "empleado" | "cliente"; // Status of the product
}
//js
const tableData: Usuario[] = [
  {
    cedula: "31667982",
    nombre: "San",
    nombre2: "Mujica",
    apellido: "lola",
    apellido2:"caca",
    rol: "empleado"
  },
  
  {
    cedula: "11111111",
    nombre: "Diego",
    nombre2: "Cabezeyensi",
    //variants: "1 Variant",
    apellido: "Tovar",
    apellido2:"Culoancho",
    rol :"cliente"
  }
];
 
export default function UsersTabla() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
           Listado de Usuarios
          </h3>
        </div>

        <div className="flex items-center gap-3">

          <Link
            href="/agregar_usuario"
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
            Ver Clientes
          </button>
          
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver Empleados
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver Administradores
          </button>
          
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
                className="py-3 font-medium text-gray-900 text-start text-theme-md dark:text-gray-200"
              >
                N° Cédula
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-900 text-start text-theme-md dark:text-gray-200"
              >
                Primer Nombre
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-900 text-start text-theme-md dark:text-gray-200"
              >
                Segundo Nombre
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-900 text-start text-theme-md dark:text-gray-200"
              >
                Primer Apellido
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-900 text-start text-theme-md dark:text-gray-200"
              >
                Segundo Apellido
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-900 text-start text-theme-md dark:text-gray-200"
              >
                Rol
              </TableCell>

            </TableRow>

          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {tableData.map((usuario) => (
              <TableRow key={usuario.nombre} className="">
                
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {usuario.cedula}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {usuario.nombre}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {usuario.nombre2}
                      </p>
                    </div>
                  </div>

                </TableCell>
                 

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {usuario.apellido}
                      </p>
                      
                    </div>
                  </div>
                </TableCell> 

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {usuario.apellido2}
                      </p>
                      
                    </div>
                  </div>
                </TableCell> 
                
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {usuario.rol}
                      </p>
                      
                    </div>
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