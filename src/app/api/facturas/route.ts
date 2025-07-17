// app/api/facturas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(req: NextRequest) {
  try {
    const facturas = await prisma.factura.findMany({
      include: {
        envio: true,
        cliente: true,
        detalles: {
          include: {
            paquete: true
          }
        }
      },
      orderBy: {
        numero: 'desc'
      }
    });
    
    return NextResponse.json(facturas);
  } catch (error) {
    console.error('[FACTURAS_GET]', error);
    return NextResponse.json(
      { message: 'Error al obtener facturas' },
      { status: 500 }
    );
  }
}