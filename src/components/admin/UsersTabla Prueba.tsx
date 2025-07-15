'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "@/services/usuarioService";
import { PencilIcon, TrashIcon, PlusIcon, FilterIcon, ListIcon } from "lucide-react";

type Rol = 'admin' | 'empleado' | 'cliente';

interface Usuario {
  id: number;
  cedula: string;
  p_nombre : string;
  s_nombre?  :string;
  p_apellido : string;
  s_apellido? :string;
  email : string;
  telefono : string;
  password : string;
  rol : Rol;
}

export default function UsersTabla() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | Rol>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState<Partial<Usuario>>({
    cedula: "",
    p_nombre: "",
    s_nombre: "",
     p_apellido: "",
    s_apellido: "",
    email: "",
    telefono: "",
    password: "",
    rol: "cliente",
  });

  const rolesUsuario = [
    { value: "admin", label: "Administrador" },
    { value: "empleado", label: "Empleado" },
    { value: "cliente", label: "Cliente" },
  ];

  const loadUsuarios = async () => {
    const data = await obtenerUsuarios();
    setUsuarios(data);
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const filteredData = filter === 'all'
    ? usuarios
    : usuarios.filter(usuario => usuario.rol === filter);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNuevoUsuario(prev => ({ ...prev, rol: value as Rol }));
  };

  const handleAgregarUsuario = async () => {
  try {
    console.log("Enviando usuario:", nuevoUsuario);

    if (nuevoUsuario.id) {
      const actualizado = await actualizarUsuario(nuevoUsuario.id, nuevoUsuario);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === actualizado.id ? actualizado : u))
      );
    } else {
      const creado = await crearUsuario(nuevoUsuario as Omit<Usuario, "id">);
      setUsuarios((prev) => [...prev, creado]);
    }

    setIsModalOpen(false);
    setNuevoUsuario({
      cedula: "",
      p_nombre: "",
      s_nombre: "",
      p_apellido: "",
      s_apellido: "",
      email: "",
      telefono: "",
      password: "",
      rol: "cliente",
    });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
  }
};


  const handleEditarUsuario = (usuario: Usuario) => {
    setNuevoUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleEliminarUsuario = async (id: number) => {
  try {
    await eliminarUsuario(id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
  }
};


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Encabezado */}
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
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="hover:text-white hover:bg-green-600" 
            variant="outline"  
            size="sm"
            startIcon={<PlusIcon className="w-5 h-5"/>}
          >
            Nuevo Usuario
          </Button>

          {/* Filtro */}
          <div className="relative">
            <Button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              variant="outline"
              className="hover:bg-sky-500 hover:text-white"
              startIcon={<FilterIcon className="w-5 h-5"/>}
            >
              Filtrar
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {rolesUsuario.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      setFilter(role.value as Rol);
                      setShowFilterDropdown(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={() => setFilter("all")}
            variant="outline"
            className="hover:bg-gray-500 hover:text-white"
            startIcon={<ListIcon className="w-5 h-5"/>}
          >
            Ver todo
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[700px] max-h-[650px] m-4">
        <div className="relative flex h-full max-h-[650px] flex-col overflow-hidden rounded-3xl bg-white p-4 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800">
              {nuevoUsuario.id ? "Editar Usuario" : "Nuevo Usuario"}
            </h4>
            <p className="mb-6 text-md text-gray-500">
              {nuevoUsuario.id ? "Modifique los datos del usuario" : "Complete los datos del nuevo usuario"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-3">
            <form className="flex flex-col">
              <div className="mt-7 grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Cédula</Label>
                  <Input name="cedula" value={nuevoUsuario.cedula || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Primer Nombre</Label>
                  <Input name="p_nombre" value={nuevoUsuario.p_nombre || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Segundo Nombre</Label>
                  <Input name="s_nombre" value={nuevoUsuario.s_nombre || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Primer Apellido</Label>
                  <Input name="p_apellido" value={nuevoUsuario.p_apellido || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Segundo Apellido</Label>
                  <Input name="s_apellido" value={nuevoUsuario.s_apellido || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input name="email" value={nuevoUsuario.email || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input name="telefono" value={nuevoUsuario.telefono || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Contraseña</Label>
                  <Input name="password" value={nuevoUsuario.password || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select
                    options={rolesUsuario}
                    placeholder="Seleccione un rol"
                    onChange={handleSelectChange}
                    defaultValue={nuevoUsuario.rol}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="flex-shrink-0 px-2 mt-6 flex items-center gap-3 justify-end">
            <Button size="sm" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="hover-bg" variant="outline" size="sm" onClick={handleAgregarUsuario}>
              {nuevoUsuario.id ? "Guardar Cambios" : "Agregar Usuario"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Tabla */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 text-start">Cédula</TableCell>
              <TableCell isHeader className="py-3 text-start">Nombre</TableCell>
              <TableCell isHeader className="py-3 text-start">Rol</TableCell>
              <TableCell isHeader className="py-3 text-start">Acciones</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {filteredData.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="py-3">{usuario.cedula}</TableCell>
                <TableCell className="py-3">
                  {usuario.p_nombre} {usuario.s_nombre} {usuario.p_apellido} {usuario.s_apellido}
                </TableCell>
                <TableCell className="py-3 capitalize">{usuario.rol}</TableCell>
                <TableCell className="py-3">
                  <div className="flex gap-2">
                    <Button
                        className="hover:bg-yellow-500 hover:text-white"
                        variant="outline"
                        size="xs"
                        onClick={() => handleEditarUsuario(usuario)}
                        startIcon={<PencilIcon className="w-4 h-4" />}
                      >
                      </Button>
                      <Button
                        className="hover:bg-red-500 hover:text-white"
                        variant="outline"
                        size="xs"
                        onClick={() => handleEliminarUsuario(usuario.id)}
                        startIcon={<TrashIcon className="w-4 h-4" />}
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
  );
}

