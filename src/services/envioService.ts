export const EnvioService = {
  async getAll(clienteId: number) {
    const res = await fetch(`/api/envio?clienteId=${clienteId}`);
    if (!res.ok) throw new Error('Error al obtener envíos');
    return await res.json();
  },
};
