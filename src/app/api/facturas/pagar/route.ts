// app/api/factura/pagar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function POST(req: NextRequest) {
  try {
    const { facturaId, metodoPago } = await req.json();

    // Validar datos
    if (!facturaId || !metodoPago) {
      return NextResponse.json(
        { message: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // 1. Primero obtener la factura para saber el número de envío
    const factura = await prisma.factura.findUnique({
      where: { numero: facturaId },
      select: { envioNumero: true }
    });

    if (!factura) {
      return NextResponse.json(
        { message: 'Factura no encontrada' },
        { status: 404 }
      );
    }

    // 2. Actualizar factura y envío en una transacción
    const [facturaActualizada] = await prisma.$transaction([
      prisma.factura.update({
        where: { numero: facturaId },
        data: {
          estado: true,
          metodoPago,
        },
        include: {
          envio: true,
          cliente: true,
          detalles: {
            include: {
              paquete: true
            }
          }
        }
      }),
      prisma.envio.update({
        where: { numero: factura.envioNumero }, // Usamos el envioNumero de la factura
        data: {
          estado: 'pagado'
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      factura: facturaActualizada
    });

  } catch (error) {
    console.error('[FACTURA_PAGO_POST]', error);
    return NextResponse.json(
      { message: 'Error al procesar pago' },
      { status: 500 }
    );
  }
}