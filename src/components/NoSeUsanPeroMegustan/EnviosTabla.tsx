'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "@/components/ui/button/Button";
import Label from '@/components/form/Label';
import Select from "@/components/form/Select";
import Input from '@/components/form/input/InputField';
import { ChevronDownIcon } from "@/icons";
import { EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext"; 

interface Envio {
  id: string;
  codigo: string;
  almacenOrigen: string;
  almacenDestino: string;
  fechaSalida: string;
  fechaLlegada: string | null;
  estado: 'en_puerto_salida' | 'en_transito' | 'en_destino';
  tipo: 'barco' | 'avion';
  paquetesCount: number;
}

const enviosData: Envio[] = [
  {
    id: "ENV-001",
    codigo: "CT-2023-001",
    almacenOrigen: "Orlando, Florida",
    almacenDestino: "La Guaira",
    fechaSalida: "2023-05-10",
    fechaLlegada: "2023-05-25",
    estado: "en_destino",
    tipo: "barco",
    paquetesCount: 15
  },
  {
    id: "ENV-002",
    codigo: "CT-2023-002",
    almacenOrigen: "Doral, Florida",
    almacenDestino: "Nueva Esparta",
    fechaSalida: "2023-05-15",
    fechaLlegada: null,
    estado: "en_transito",
    tipo: "avion",
    paquetesCount: 8
  },
  {
    id: "ENV-003",
    codigo: "CT-2023-003",
    almacenOrigen: "Orlando, Florida",
    almacenDestino: "Nueva Esparta",
    fechaSalida: "2023-05-20",
    fechaLlegada: null,
    estado: "en_puerto_salida",
    tipo: "barco",
    paquetesCount: 25
  }
];

const estadosEnvio = [
  { value: "en_puerto_salida", label: "En puerto de salida" },
  { value: "en_transito", label: "En tránsito" },
  { value: "en_destino", label: "En destino" }
];

const tiposEnvio = [
  { value: "barco", label: "Barco" },
  { value: "avion", label: "Avión" }
];

export default function EnviosTabla() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedEnvio, setSelectedEnvio] = useState<Envio | null>(null);
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const { isAdmin, isEmpleado, isCliente, isLoading, user } = useAuth(); // ✅ auth

  if (isLoading || !user) return null; // Espera carga del usuario

  const openDetallesModal = (envio: Envio) => {
    setSelectedEnvio(envio);
    setShowDetallesModal(true);
  };

  const closeDetallesModal = () => {
    setSelectedEnvio(null);
    setShowDetallesModal(false);
  };

  const handleSave = () => {
    console.log("Guardando envío...");
    closeModal();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Envíos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Registro de envíos realizados
          </p>
        </div>

        {/* 🔐 Solo admin y empleado pueden ver el botón */}
        {(isAdmin || isEmpleado) && (
          <Button onClick={openModal} size="sm" variant="primary">
            Nuevo Envío
          </Button>
        )}
      </div>

      {/* ⚠️ Solo admin y empleado ven el modal de creación */}
      {(isAdmin || isEmpleado) && (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] max-h-[650px] m-4">
          <div className="relative flex h-full max-h-[650px] flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-4 lg:p-11">
            <div className="px-2 pr-14 flex-shrink-0">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Nuevo Envío
              </h4>
              <p className="mb-6 text-md text-gray-500 dark:text-gray-400 lg:mb-7">
                Complete los datos del envío.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-3">
              <form className="flex flex-col">
                <div className="mt-7">
                  <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                    Información del Envío
                  </h5>
                  <div className="grid grid-cols-1 gap-x-5 gap-y-5 lg:grid-cols-2">
                    <div>
                      <Label>Tipo de Envío</Label>
                      <Select options={tiposEnvio} placeholder="Seleccione tipo"  onChange={(value) => console.log("Tipo:", value)} />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Select options={estadosEnvio} placeholder="Seleccione estado"  onChange={(value) => console.log("Estado:", value)} />
                    </div>
                    <div>
                      <Label>Almacén Origen</Label>
                      <Select
                        options={[
                          { value: "orlando", label: "Orlando, Florida" },
                          { value: "doral", label: "Doral, Florida" }
                          
                        ]}
                        placeholder="Seleccione almacén"
                        onChange={(value) => console.log("Origen:", value)}
                      />
                    </div>
                    <div>
                       <Label >Almacén Destino</Label>
                    <Select
                      options={[
                        { value: "guaira", label: "La Guaira" },
                        { value: "nueva_esparta", label: "Nueva Esparta" }
                      ]}
                      placeholder="Seleccione almacén"
                      onChange={(value) => console.log("Destino:", value)}
                    />
                    </div>
                    <div>
                      <Label>Fecha de Salida</Label>
                      <div className="relative">
                        <Input type="date" />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>Fecha de Llegada (estimada)</Label>
                      <div className="relative">
                        <Input type="date" />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label>Paquetes a Incluir</Label>
                      <div className="border rounded-lg p-4 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">Lista de paquetes disponibles</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex-shrink-0 px-2 mt-6 flex items-center gap-3 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                Guardar Envío
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ✅ Tabla visible para todos los roles */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 text-left">Código</TableCell>
              <TableCell isHeader className="py-3 text-left">Tipo</TableCell>
              <TableCell isHeader className="py-3 text-left">Origen → Destino</TableCell>
              <TableCell isHeader className="py-3 text-left">Fechas</TableCell>
              <TableCell isHeader className="py-3 text-left">Estado</TableCell>
              <TableCell isHeader className="py-3 text-left">Acciones</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {enviosData.map((envio) => (
              <TableRow key={envio.id}>
                <TableCell className="py-3">{envio.codigo}</TableCell>
                <TableCell className="py-3 capitalize">{envio.tipo}</TableCell>
                <TableCell className="py-3">
                  <p>{envio.almacenOrigen}</p>
                  <p className="text-gray-500 dark:text-gray-400">→ {envio.almacenDestino}</p>
                </TableCell>
                <TableCell className="py-3">
                  <p>Salida: {envio.fechaSalida}</p>
                  {envio.fechaLlegada && <p>Llegada: {envio.fechaLlegada}</p>}
                </TableCell>
                <TableCell className="py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    envio.estado === "en_destino"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : envio.estado === "en_transito"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}>
                    {envio.estado === "en_puerto_salida" ? "En puerto" :
                     envio.estado === "en_transito" ? "En tránsito" : "En destino"}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDetallesModal(envio)}>
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modal Detalles (visible para todos los roles) */}
        <Modal isOpen={showDetallesModal} onClose={closeDetallesModal} className="max-w-[650px] m-4">
          {selectedEnvio && (
            <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  📦
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Detalles del Envío
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Código: <span className="font-medium">{selectedEnvio.codigo}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700 dark:text-gray-300">
                <div><p className="text-gray-500 dark:text-gray-400">Tipo</p><p>{selectedEnvio.tipo}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400">Estado</p><p>{selectedEnvio.estado}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400">Almacén Origen</p><p>{selectedEnvio.almacenOrigen}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400">Almacén Destino</p><p>{selectedEnvio.almacenDestino}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400">Fecha de Salida</p><p>{selectedEnvio.fechaSalida}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400">Fecha de Llegada</p><p>{selectedEnvio.fechaLlegada ?? "Pendiente"}</p></div>
                <div className="sm:col-span-2"><p className="text-gray-500 dark:text-gray-400">Paquetes</p><p>{selectedEnvio.paquetesCount}</p></div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button size="sm" variant="outline" onClick={closeDetallesModal}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

