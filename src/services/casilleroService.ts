
export const CasilleroService = {
  async obtenerEnviosDelCliente(clienteId: number) {
    const res = await fetch(`/api/casillero?clienteId=${clienteId}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Error al obtener envíos');
    return await res.json();
  }
};

