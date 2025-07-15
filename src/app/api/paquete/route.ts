import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include');
    const disponibles = searchParams.get('disponibles') === 'true';
    
    const where = disponibles ? { envioNumero: null } : {};
    
    const paquetes = await prisma.paquete.findMany({
      where,
      include: {
        almacen: include?.includes('almacen'),
        envio: include?.includes('envio') ? {
          include: {
            origen: true,
            destino: true
          }
        } : false,
        empleado: include?.includes('empleado'),
        detalles: {
          include: {
            factura: {
              include: {
                cliente: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    return NextResponse.json(paquetes);
  } catch (error) {
    console.error('[PAQUETES_GET]', error);
    return new NextResponse('Error al obtener paquetes', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Calcular volumen automáticamente si no viene (pulgadas cúbicas a pies cúbicos)
    const volumen = data.volumen ?? (data.largo * data.ancho * data.alto) / 1728;
    
    const nuevoPaquete = await prisma.paquete.create({
      data: {
        descripcion: data.descripcion,
        largo: data.largo,
        ancho: data.ancho,
        alto: data.alto,
        peso: data.peso,
        volumen: volumen,
        estado: data.estado || 'recibido en almacen',
        almacenCodigo: data.almacenCodigo,
        empleadoId: data.empleadoId,
        envioNumero: data.envioNumero || null
      },
      include: {
        almacen: true,
        envio: true,
        empleado: true
      }
    });

    return NextResponse.json(nuevoPaquete, { status: 201 });
  } catch (error) {
    console.error('[PAQUETE_POST]', error);
    return new NextResponse('Error al crear paquete', { status: 500 });
  }
}