'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import Label from '@/components/form/Label';
import Select from "@/components/form/Select";
import Input from '@/components/form/input/InputField';
import { ChevronDownIcon } from "@/icons";

interface Usuario {
  id: string;
  cedula: string;
  nombre: string;
  nombre2: string;
  apellido: string;
  apellido2: string;
  rol: 'admin' | 'empleado' | 'cliente';
}

export default function UsersTabla() {
  // Estado para los datos de usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      cedula: "31667982",
      nombre: "San",
      nombre2: "Mujica",
      apellido: "Lola",
      apellido2: "Perez",
      rol: "empleado"
    },
    {
      id: "2",
      cedula: "11111111",
      nombre: "Diego",
      nombre2: "Cabezeyensi",
      apellido: "Tovar",
      apellido2: "Gomez",
      rol: "cliente"
    },
    {
      id: "3",
      cedula: "22222222",
      nombre: "Admin",
      nombre2: "User",
      apellido: "System",
      apellido2: "Root",
      rol: "admin"
    }
  ]);

  // Estados para el modal y filtros
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'admin' | 'empleado' | 'cliente'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState<Omit<Usuario, 'id'> & { id?: string }>({
    cedula: "",
    nombre: "",
    nombre2: "",
    apellido: "",
    apellido2: "",
    rol: "cliente"
  });

  // Opciones para los selects
  const rolesUsuario = [
    { value: "admin", label: "Administrador" },
    { value: "empleado", label: "Empleado" },
    { value: "cliente", label: "Cliente" }
  ];

  // Filtrar datos según selección
  const filteredData = filter === 'all' 
    ? usuarios 
    : usuarios.filter(usuario => usuario.rol === filter);

  // Manejadores de eventos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNuevoUsuario(prev => ({ ...prev, rol: value as 'admin' | 'empleado' | 'cliente' }));
  };

  const handleAgregarUsuario = () => {
    if (nuevoUsuario.id) {
      // Editar usuario existente
      setUsuarios(usuarios.map(u => 
        u.id === nuevoUsuario.id ? { ...nuevoUsuario, id: u.id } as Usuario : u
      ));
    } else {
      // Agregar nuevo usuario
      setUsuarios([...usuarios, {
        ...nuevoUsuario,
        id: Date.now().toString()
      }]);
    }
    setIsModalOpen(false);
    setNuevoUsuario({
      cedula: "",
      nombre: "",
      nombre2: "",
      apellido: "",
      apellido2: "",
      rol: "cliente"
    });
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setNuevoUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleEliminarUsuario = (id: string) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Encabezado con botones */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Gestión de Usuarios
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Administra los usuarios del sistema
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => setIsModalOpen(true)} size="sm" variant="primary">
            Nuevo Usuario
          </Button>
          
          {/* Filtro desplegable */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filtrar
            </button>
            
            {showFilterDropdown && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800">
                <button
                  onClick={() => {
                    setFilter("admin");
                    setShowFilterDropdown(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Administradores
                </button>
                <button
                  onClick={() => {
                    setFilter("empleado");
                    setShowFilterDropdown(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Empleados
                </button>
                <button
                  onClick={() => {
                    setFilter("cliente");
                    setShowFilterDropdown(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Clientes
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setFilter("all")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Ver todo
          </button>
        </div>
      </div>

      {/* Indicador de filtro activo */}
      {filter !== "all" && (
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Mostrando: {filter === "admin" ? "Administradores" : filter === "empleado" ? "Empleados" : "Clientes"}
        </div>
      )}

      {/* Modal para agregar/editar usuario */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[700px] max-h-[650px] m-4">
        <div className="relative flex h-full max-h-[650px] flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-4 lg:p-11">

          {/* Header */}
          <div className="px-2 pr-14 flex-shrink-0">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {nuevoUsuario.id ? "Editar Usuario" : "Nuevo Usuario"}
            </h4>
            <p className="mb-6 text-md text-gray-500 dark:text-gray-400 lg:mb-7">
              {nuevoUsuario.id ? "Modifique los datos del usuario" : "Complete los datos del nuevo usuario"}
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-3">
            <form className="flex flex-col">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Información Personal
                </h5>
                
                <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Cédula</Label>
                    <Input 
                      type="text"
                      name="cedula"
                    
                      onChange={handleInputChange}
                      placeholder="Ej: 12345678"
                    />
                  </div>
                  
                  <div>
                    <Label>Primer Nombre</Label>
                    <Input 
                      type="text"
                      name="nombre"
                     
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label>Segundo Nombre</Label>
                    <Input 
                      type="text"
                      name="nombre2"
                      
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label>Primer Apellido</Label>
                    <Input 
                      type="text"
                      name="apellido"
                     
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label>Segundo Apellido</Label>
                    <Input 
                      type="text"
                      name="apellido2"
                      
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label>Rol</Label>
                    <Select
                      options={rolesUsuario}
                      placeholder="Seleccione un rol"
                      
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-2 mt-6 flex items-center gap-3 lg:justify-end">
            <Button size="sm" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleAgregarUsuario}>
              {nuevoUsuario.id ? "Guardar Cambios" : "Agregar Usuario"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Tabla de usuarios */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 text-start">
                Cédula
              </TableCell>
              <TableCell isHeader className="py-3 text-start">
                Nombre Completo
              </TableCell>
              <TableCell isHeader className="py-3 text-start">
                Rol
              </TableCell>
              <TableCell isHeader className="py-3 text-start">
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredData.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="py-3 font-medium">
                  {usuario.cedula}
                </TableCell>
                
                <TableCell className="py-3">
                  {usuario.nombre} {usuario.nombre2} {usuario.apellido} {usuario.apellido2}
                </TableCell>
                
                <TableCell className="py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    usuario.rol === "admin" 
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" 
                      : usuario.rol === "empleado"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}>
                    {usuario.rol === "admin" ? "Administrador" : 
                     usuario.rol === "empleado" ? "Empleado" : "Cliente"}
                  </span>
                </TableCell>
                
                <TableCell className="py-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditarUsuario(usuario)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleEliminarUsuario(usuario.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Eliminar
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