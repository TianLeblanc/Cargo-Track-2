
export const EnvioService = {
  async getAll(clienteId: number) {
    const res = await fetch(`/api/envio?clienteId=${clienteId}`);
    if (!res.ok) throw new Error('Error al obtener envíos');
    return await res.json();
  },

  async procesarPago(facturaNumero: number, metodoPago: string, detallePago?: string) {
    const res = await fetch('/api/facturas/pagar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        facturaId: facturaNumero, // Enviamos el número de factura
        metodoPago,
        detallePago
      }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al procesar el pago');
    }
    
    return await res.json();
  }

 
};