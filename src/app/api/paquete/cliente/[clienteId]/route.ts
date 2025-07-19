import { NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

// GET /api/paquete/cliente/[clienteId]
export async function GET(
  request: Request,
  { params }: { params: { clienteId: string } }
) {
  const clienteId = parseInt(params.clienteId);
  if (isNaN(clienteId)) {
    return NextResponse.json({ error: 'ID de cliente inválido' }, { status: 400 });
  }

  try {
    // Buscar todas las facturas del cliente y extraer los paquetes asociados
    const facturas = await prisma.factura.findMany({
      where: { clienteId },
      include: {
        envio: true,
        detalles: {
          include: {
            paquete: {
              include: {
                almacen: true,
                envio: true,
                empleado: true,
              },
            },
          },
        },
      },
    });

    // Extraer los paquetes y asociar el clienteId y datos de envío
    const paquetes: any[] = [];
    facturas.forEach((factura: any) => {
      factura.detalles.forEach((detalle: any) => {
        if (detalle.paquete) {
          paquetes.push({
            ...detalle.paquete,
            clienteId: factura.clienteId,
            envio: factura.envio || detalle.paquete.envio || null,
          });
        }
      });
    });

    return NextResponse.json(paquetes);
  } catch (error) {
    console.error('Error al obtener paquetes del cliente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
