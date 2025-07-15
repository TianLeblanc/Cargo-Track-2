export const EnvioService = {
  async getAll(): Promise<any[]> {
    const res = await fetch('/api/envioAdmin?include=origen,destino,paquetes,paquetes.cliente');
    if (!res.ok) throw new Error('Error al obtener envíos');
    return await res.json();
  },

  async create(data: any): Promise<any> {
    const res = await fetch('/api/envioAdmin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error al crear envío');
    return await res.json();
  },

  async update(id: number, data: any): Promise<any> {
    const res = await fetch(`/api/envioAdmin/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error al actualizar envío');
    return await res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`/api/envioAdmin/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Error al eliminar envío');
  },

  async asociarPaquetes(envioId: number, paqueteIds: number[], clienteId: number): Promise<any> {
    const res = await fetch(`/api/envioAdmin/${envioId}/asociar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paqueteIds, clienteId }),
    });

    if (!res.ok) throw new Error('Error al asociar paquetes');
    return await res.json();
  },

  async getPaquetesDisponibles(): Promise<any[]> {
    const res = await fetch('/api/paquete?disponibles=true&include=cliente');
    if (!res.ok) throw new Error('Error al obtener paquetes disponibles');
    return await res.json();
  }
};