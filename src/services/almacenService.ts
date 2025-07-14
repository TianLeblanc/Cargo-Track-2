

export const AlmacenService = {
  async getAll(): Promise<any[]> {
    const res = await fetch('/api/almacen', { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener almacenes');
    return await res.json();
  },

  async create(data: any): Promise<any> {
    const res = await fetch('/api/almacen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error al crear almacén');
    return await res.json();
  },

  async update(id: number, data: any): Promise<any> {
    const res = await fetch(`/api/almacen/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error al actualizar almacén');
    return await res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`/api/almacen/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Error al eliminar almacén');
  },
};