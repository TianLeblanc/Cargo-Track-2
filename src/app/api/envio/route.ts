import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(req: NextRequest) {
  const clienteId = req.nextUrl.searchParams.get('clienteId');

  try {
    const whereClause = clienteId
      ? { factura: { clienteId: parseInt(clienteId) } }
      : {};

    const envios = await prisma.envio.findMany({
      where: whereClause,
      include: {
        factura: {
          include: {
            cliente: true,
            detalles: {
              include: { paquete: true },
            },
          },
        },
      },
    });

    return NextResponse.json(envios);
  } catch (error) {
    console.error('[ENVIO_GET]', error);
    return new NextResponse('Error al obtener envíos', { status: 500 });
  }
}
