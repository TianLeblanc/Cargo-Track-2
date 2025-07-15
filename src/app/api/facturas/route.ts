import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clienteId = parseInt(searchParams.get('clienteId') || '');

  if (isNaN(clienteId)) {
    return new NextResponse('clienteId requerido', { status: 400 });
  }

  try {
    const facturas = await prisma.factura.findMany({
      where: { clienteId },
      select: {
        numero: true,
        estado: true,
        metodoPago: true,
        monto: true,
        cantidadPiezas: true,
        pdf: true,
      },
    });

    return NextResponse.json(facturas);
  } catch (error) {
    console.error('[FACTURAS_GET] Error:', error);
    return new NextResponse('Error al obtener facturas', { status: 500 });
  }
}
