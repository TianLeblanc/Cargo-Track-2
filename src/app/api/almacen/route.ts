// app/api/almacen/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

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
    const data = await req.json();
    const nuevoAlmacen = await prisma.almacen.create({ data });
    return NextResponse.json(nuevoAlmacen);
  } catch (error) {
    console.error('[ALMACEN_POST]', error);
    return new NextResponse('Error al crear almacén', { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const data = await req.json();
    
    if (!id) return new NextResponse('ID requerido', { status: 400 });

    const almacenActualizado = await prisma.almacen.update({
      where: { id: parseInt(id) },
      data
    });
    
    return NextResponse.json(almacenActualizado);
  } catch (error) {
    console.error('[ALMACEN_PUT]', error);
    return new NextResponse('Error al actualizar almacén', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return new NextResponse('ID requerido', { status: 400 });

    await prisma.almacen.delete({
      where: { id: parseInt(id) }
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[ALMACEN_DELETE]', error);
    return new NextResponse('Error al eliminar almacén', { status: 500 });
  }
}