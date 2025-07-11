// src/services/almacenService.ts

import { Prisma } from '@/generated/prisma';

export type AlmacenCreateInput = Prisma.AlmacenCreateInput;

export const AlmacenService = {
  async getAll(): Promise<any[]> {
    const res = await fetch('/api/almacen', { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener almacenes');
    return await res.json();
  },

  async create(data: AlmacenCreateInput): Promise<any> {
    const res = await fetch('/api/almacen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error al crear almacén');
    return await res.json();
  },
};

