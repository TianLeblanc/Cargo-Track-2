import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const empleadoId = searchParams.get('empleadoId');

    // Validación básica pero efectiva
    if (!empleadoId || isNaN(Number(empleadoId))) {
      return NextResponse.json(
        { message: 'ID de empleado no válido' },
        { status: 400 }
      );
    }

    const paquetes = await prisma.paquete.findMany({
      where: { empleadoId: Number(empleadoId) },
      include: {
        almacen: true,
        envio: { include: { origen: true, destino: true } },
        empleado: true
      },
      orderBy: { id: 'desc' }
    });

    return NextResponse.json(paquetes);
  } catch (error) {
    console.error('[PAQUETES_GET]', error);
    return NextResponse.json(
      { message: 'Error al obtener paquetes' },
      { status: 500 }
    );
  }
}