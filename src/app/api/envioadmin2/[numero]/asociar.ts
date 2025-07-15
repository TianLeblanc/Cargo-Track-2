import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function POST(req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const envioNumero = parseInt(params.numero);
    const { paqueteIds, clienteId } = await req.json();

    // Asociar paquetes al envío
    await prisma.paquete.updateMany({
      where: { id: { in: paqueteIds } },
      data: { envioNumero },
    });

    // Calcular total y piezas
    const paquetes = await prisma.paquete.findMany({
      where: { id: { in: paqueteIds } },
    });

    const montoTotal = paquetes.reduce((total, p) => total + p.volumen * 25, 0); // tarifa marítima
    const cantidadPiezas = paquetes.length;

    // Crear factura
    const factura = await prisma.factura.create({
      data: {
        estado: false,
        metodoPago: 'Por definir',
        monto: montoTotal,
        cantidadPiezas,
        envioNumero,
        clienteId,
      },
    });

    // Crear detalle por paquete
    for (const p of paquetes) {
      await prisma.detalleFactura.create({
        data: {
          idFactura: factura.numero,
          monto: p.volumen * 25,
          idPaquete: p.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ASOCIAR_PAQUETES]', error);
    return new NextResponse('Error al asociar paquetes y generar factura', { status: 500 });
  }
}
