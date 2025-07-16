import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(req: NextRequest) {
  try {
    const facturas = await prisma.factura.findMany({
      include: {
        cliente: {
          select: {
            id: true,
            p_nombre: true,
            p_apellido: true,
            email: true
          }
        }
      },
     
    });

    return NextResponse.json(facturas);
  } catch (error) {
    console.error('[FACTURAS_GET_ALL] Error:', error);
    return new NextResponse('Error al obtener facturas', { status: 500 });
  }
}
