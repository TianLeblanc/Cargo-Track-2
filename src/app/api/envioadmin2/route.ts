import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(req: NextRequest) {
  try {
    const include = req.nextUrl.searchParams.get('include');
    
    const envios = await prisma.envio.findMany({
      include: {
        origen: include?.includes('origen'),
        destino: include?.includes('destino'),
        paquetes: include?.includes('paquetes'),
        empleado: include?.includes('empleado'),
        factura: include?.includes('factura') ? {
          include: {
            cliente: true,
            detalles: include?.includes('factura.detalles')
          }
        } : false
      },
      orderBy: {
        numero: 'desc'
      }
    });

    return NextResponse.json(envios);
  } catch (error) {
    console.error('[ENVIO_GET]', error);
    return new NextResponse('Error al obtener envíos', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validar que el empleado existe
    const empleado = await prisma.usuario.findUnique({
      where: { id: data.EmpleadoId }
    });
    
    if (!empleado) {
      return new NextResponse('Empleado no encontrado', { status: 400 });
    }

    // Crear el envío
    const nuevoEnvio = await prisma.envio.create({
      data: {
        numero: data.numero || undefined, // Si no viene, se autoincrementa
        tipo: data.tipo,
        estado: data.estado,
        fechasalida: data.fechasalida,
        fechallegada: data.fechallegada,
        origen: { connect: { id: data.origenCodigo } },
        destino: { connect: { id: data.destinoCodigo } },
        empleado: { connect: { id: data.EmpleadoId } }
      }
    });

    return NextResponse.json(nuevoEnvio);
  } catch (error) {
    console.error('[ENVIO_POST]', error);
    return new NextResponse('Error al crear envío', { status: 500 });
  }
}