import { Prisma } from '@prisma/client';

export type PaqueteWithRelations = Prisma.PaqueteGetPayload<{
  include: {
    almacen: true;
    envio: true;
  }
}>;

export const PaqueteService = {
  async getByCliente(clienteId: number): Promise<PaqueteWithRelations[]> {
    const res = await fetch(`/api/paquetes?clienteId=${clienteId}`, { 
      cache: 'no-store',
      next: { tags: ['paquetes'] }
    });
    if (!res.ok) throw new Error('Error al obtener paquetes');
    return await res.json();
  },
};