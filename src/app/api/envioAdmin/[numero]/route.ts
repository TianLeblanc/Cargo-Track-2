export async function PUT(req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const envioNumero = parseInt(params.numero);
    const data = await req.json();

    // Validar que el envío existe
    const envio = await prisma.envio.findUnique({ where: { numero: envioNumero } });
    if (!envio) {
      return new NextResponse('Envío no encontrado', { status: 404 });
    }

    // Validar almacenes
    const [origen, destino] = await Promise.all([
      prisma.almacen.findUnique({ where: { id: data.origenCodigo } }),
      prisma.almacen.findUnique({ where: { id: data.destinoCodigo } })
    ]);
    if (!origen || !destino) {
      return new NextResponse('Almacén de origen o destino no encontrado', { status: 400 });
    }

    // Actualizar el envío
    const envioActualizado = await prisma.envio.update({
      where: { numero: envioNumero },
      data: {
        tipo: data.tipo,
        estado: data.estado,
        fechasalida: new Date(data.fechasalida),
        fechallegada: data.fechallegada ? new Date(data.fechallegada) : null,
        origenCodigo: data.origenCodigo,
        destinoCodigo: data.destinoCodigo,
        EmpleadoId: data.EmpleadoId
      },
      include: {
        origen: true,
        destino: true,
        empleado: {
          select: {
            id: true,
            p_nombre: true,
            p_apellido: true
          }
        }
      }
    });

    return NextResponse.json(envioActualizado);
  } catch (error) {
    console.error('[ENVIO_PUT] Error:', error);
    return new NextResponse('Error interno al actualizar envío', { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { numero: string } }
) {
  try {
    const envioNumero = parseInt(params.numero);
    // Verificar que el envío existe
    const envio = await prisma.envio.findUnique({
      where: { numero: envioNumero },
      include: { factura: true, paquetes: true }
    });
    if (!envio) {
      return new NextResponse('Envío no encontrado', { status: 404 });
    }

    await prisma.$transaction(async (prisma) => {
      // Quitar la relación de los paquetes (no eliminar los paquetes)
      await prisma.paquete.updateMany({
        where: { envioNumero: envioNumero },
        data: { envioNumero: null, estado: 'En almacén' }
      });
      // Eliminar la factura asociada (si existe)
      if (envio.factura) {
        await prisma.detalleFactura.deleteMany({ where: { idFactura: envio.factura.numero } });
        await prisma.factura.delete({ where: { numero: envio.factura.numero } });
      }
      // Eliminar el envío
      await prisma.envio.delete({ where: { numero: envioNumero } });
    });

    return new NextResponse('Envío eliminado correctamente', { status: 200 });
  } catch (error) {
    console.error('[ENVIO_DELETE] Error:', error);
    return new NextResponse('Error interno al eliminar envío', { status: 500 });
  }
}
