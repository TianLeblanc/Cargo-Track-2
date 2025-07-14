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
  envioNumero: number | null;
  almacen: Almacen;
  envio: Envio | null;
  empleado: {
    id: number;
    nombre: string;
    email: string;
  };
};