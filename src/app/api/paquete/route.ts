// app/api/paquetes/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include');
    
    const paquetes = await prisma.paquete.findMany({
      include: {
        almacen: include?.includes('almacen'),
        envio: include?.includes('envio') ? {
          include: {
            origen: true,
            destino: true
          }
        } : false,
        empleado: include?.includes('empleado')
      }
    });
    
    return NextResponse.json(paquetes);
  } catch (error) {
    console.error('[PAQUETES_GET]', error);
    return new NextResponse('Error al obtener paquetes', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const nuevoPaquete = await prisma.paquete.create({
      data: {
        descripcion: data.descripcion,
        largo: data.largo,
        ancho: data.ancho,
        alto: data.alto,
        peso: data.peso,
        volumen: data.volumen,
        estado: data.estado,
        almacenCodigo: data.almacenCodigo,
        empleadoId: data.empleadoId,
        envioNumero: data.envioNumero || null,
      },
      include: {
        almacen: true,
        envio: true,
        empleado: true,
      },
    });

    return NextResponse.json(nuevoPaquete);
  } catch (error) {
    console.error('[PAQUETE_POST]', error);
    return new NextResponse('Error al crear paquete', { status: 500 });
  }
}