export type Almacen = {
  id: number;
  ciudad: string;
  estado: string;
  linea1: string;
  linea2?: string | null;
  pais: string;
  codpostal: string;
  telefono: string;
};

export type Envio = {
  numero: number;
  estado: string;
  origen: Almacen;
  destino: Almacen;
  fechasalida: Date;
  fechallegada?: Date | null;
};

export type EnvioCompleto ={
  id: number;
  numero: number;
  tipo: string;
  estado: string;
  factura?: {
    id: number;
    numero: number;
    estado: boolean;
    metodoPago: string | null;
    detallePago: string | null;
    monto: number;
    cantidadPiezas: number;
    pdf?: string;
    cliente: {
      p_nombre: string;
      p_apellido: string;
    };
    detalles: {
      id: number;
      monto: number;
      paquete: {
        descripcion: string;
      };
    }[];
  };
}



export type PaqueteCompleto = {
  id: number;
  descripcion: string;
  largo: number;
  ancho: number;
  alto: number;
  peso: number;
  volumen: number;
  estado: string;
  almacenCodigo: number;
  empleadoId: number;
  clienteId?: number; // Añadido para filtrar por cliente
  envioNumero: number | null;
  almacen: Almacen;
  envio: Envio | null;
  empleado: {
    id: number;
    nombre: string;
    email: string;
  };
};