import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Añadir await para parámetros dinámicos
    const packageId = parseInt(params.id);

    if (isNaN(packageId)) {
      return new NextResponse('ID de paquete inválido', { status: 400 });
    }

    const packageData = await prisma.paquete.findUnique({
      where: { id: packageId },
      include: {
        almacen: true,
        empleado: true,
        detalles: {
          include: {
            factura: {
              include: {
                cliente: true
              }
            }
          }
        }
      }
    });

    if (!packageData) {
      return new NextResponse('Paquete no encontrado', { status: 404 });
    }

    return NextResponse.json(packageData);
  } catch (error) {
    console.error('[PACKAGE_GET]', error);
    return new NextResponse('Error al obtener el paquete', { status: 500 });
  }
}