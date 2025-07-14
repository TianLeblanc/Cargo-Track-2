'use client';

export const PackageService = {
  async getById(id: number): Promise<any> {
    const res = await fetch(`/api/packages/${id}`);
    if (!res.ok) throw new Error('Paquete no encontrado');
    return await res.json();
  }
};