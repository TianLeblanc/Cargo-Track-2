import { NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

// GET /api/paquete/cliente/[clienteId]
export async function GET(request: Request, { params }: { params: { clienteId: string } }) {
  const clienteId = parseInt(params.clienteId);
  if (isNaN(clienteId)) {
    return NextResponse.json({ error: 'ID de cliente inválido' }, { status: 400 });
  }

  try {
    // Buscar todos los paquetes asociados al cliente mediante Factura y DetalleFactura
    const facturas = await prisma.factura.findMany({
      where: { clienteId },
      include: {
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

    // Extraer los paquetes únicos
    const paquetes: any[] = [];
    facturas.forEach((factura: any) => {
      factura.detalles.forEach((detalle: any) => {
        if (detalle.paquete) {
          paquetes.push({ ...detalle.paquete, clienteId });
        }
      });
    });

    return NextResponse.json(paquetes);
  } catch (error) {
    console.error('Error al obtener paquetes del cliente:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
