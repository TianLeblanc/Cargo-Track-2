import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient().$extends(withAccelerate())


//Singleton para el cliente Prisma
//const prismaClientSingleton = () => {
// return new PrismaClient();
// };

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
// }

// export const prisma = globalThis.prisma ?? prismaClientSingleton();/


declare global {
  var prisma: undefined | ReturnType<typeof PrismaClient>;
}

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Funciones para Almacén
export const AlmacenService = {
  async getAll() {
    return await prisma.almacen.findMany({
      orderBy: { codigo: 'asc' },
    });
  },

  async getById(codigo: number) {
    return await prisma.almacen.findUnique({
      where: { codigo },
    });
  },

  async create(data: {
    telefono: string;
    linea1: string;
    linea2?: string;
    pais: string;
    estado: string;
    ciudad: string;
    codigoPostal: string;
  }) {
    return await prisma.almacen.create({
      data,
    });
  },

  async update(
    codigo: number,
    data: {
      telefono?: string;
      linea1?: string;
      linea2?: string;
      pais?: string;
      estado?: string;
      ciudad?: string;
      codigoPostal?: string;
    }
  ) {
    return await prisma.almacen.update({
      where: { codigo },
      data,
    });
  },

  async delete(codigo: number) {
    return await prisma.almacen.delete({
      where: { codigo },
    });
  },
};

// Funciones para Usuario
export const UsuarioService = {
  async getAll() {
    return await prisma.usuario.findMany({
      orderBy: { id: 'asc' },
    });
  },

  async getById(id: number) {
    return await prisma.usuario.findUnique({
      where: { id },
    });
  },

  async create(data: {
    cedula: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    contrasena: string;
    rol: string;
  }) {
    return await prisma.usuario.create({
      data,
    });
  },
  // ... otras funciones para Usuario
};

// Funciones para Paquete
export const PaqueteService = {
  async getAll() {
    return await prisma.paquete.findMany({
      orderBy: { tracking: 'asc' },
      include: {
        almacen: true,
        empleado: true,
        envio: true,
      },
    });
  },
  // ... otras funciones para Paquete
};

// ... Repite el patrón para Envio, Factura, DetalleFactura