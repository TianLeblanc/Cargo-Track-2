import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd'; 
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const almacenes = await prisma.almacen.findMany();
    return NextResponse.json(almacenes);
  } catch (error) {
    console.error('[ALMACEN_GET]', error);
    return new NextResponse('Error al obtener almacenes', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data: Prisma.AlmacenCreateInput = {
      telefono: body.telefono,
      linea1: body.linea1,
      linea2: body.linea2 || null,
      pais: body.pais,
      estado: body.estado,
      ciudad: body.ciudad,
      codpostal: body.codpostal, 
    };

    const nuevoAlmacen = await prisma.almacen.create({ data });
    return NextResponse.json(nuevoAlmacen);
  } catch (error) {
    console.error('[ALMACEN_POST]', error);
    return new NextResponse('Error al crear almacén', { status: 500 });
  }
}
