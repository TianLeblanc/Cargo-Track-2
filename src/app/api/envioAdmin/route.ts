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
            detalles: true
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

    // Validar almacenes
    const [origen, destino] = await Promise.all([
      prisma.almacen.findUnique({ where: { id: data.origenCodigo } }),
      prisma.almacen.findUnique({ where: { id: data.destinoCodigo } })
    ]);

    if (!origen || !destino) {
      return new NextResponse('Almacén de origen o destino no encontrado', { status: 400 });
    }

    // Crear el envío
    const nuevoEnvio = await prisma.envio.create({
      data: {
        numero: data.numero || undefined, // Auto-increment si no se proporciona
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

    return NextResponse.json(nuevoEnvio, { status: 201 });
  } catch (error) {
    console.error('[ENVIO_POST] Error:', error);
    return new NextResponse('Error interno al crear envío', { status: 500 });
  }
}