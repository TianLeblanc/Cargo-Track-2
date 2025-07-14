
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(req: NextRequest) {
  const clienteId = Number(req.nextUrl.searchParams.get('clienteId'));
  if (!clienteId) {
    return new Response(JSON.stringify({ error: 'Cliente ID requerido' }), { status: 400 });
  }

  try {
    const facturas = await prisma.factura.findMany({
      where: { clienteId },
      include: {
        envio: {
          include: {
            paquetes: true,
          }
        },
        detalles: {
          include: {
            paquete: true,
          }
        }
      }
    });

    return new Response(JSON.stringify(facturas));
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error al obtener datos del casillero' }), { status: 500 });
  }
}
