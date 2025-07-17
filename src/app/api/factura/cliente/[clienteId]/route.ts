import { NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

// GET /api/factura/cliente/[clienteId]
export async function GET(request: Request, context: { params: any }) {
  const clienteId = parseInt(context.params.clienteId);
  if (isNaN(clienteId)) {
    return NextResponse.json({ error: 'ID de cliente inválido' }, { status: 400 });
  }

  try {
    // Buscar todas las facturas del cliente
    const facturas = await prisma.factura.findMany({
      where: { clienteId },
      select: {
        numero: true,
        envioNumero: true,
        estado: true,
        monto: true,
        metodoPago: true,
        cantidadPiezas: true,
        pdf: true,
        envio: true,
        detalles: true,
      },
    });
    return NextResponse.json(facturas);
  } catch (error) {
    console.error('Error al obtener facturas del cliente:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
