import { NextRequest, NextResponse } from "next/server";
 import { prisma } from '@/lib/bd';

// ACTUALIZAR almacén
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const data = await req.json();

  try {
    const updatedAlmacen = await prisma.almacen.update({
      where: { id },
      data: {
        telefono: data.telefono,
        linea1: data.linea1,
        linea2: data.linea2 || null,
        pais: data.pais,
        estado: data.estado,
        ciudad: data.ciudad,
        codpostal: data.codpostal,
      },
    });

    return NextResponse.json(updatedAlmacen);
  } catch (error) {
    console.error("Error al actualizar almacén:", error);
    return new NextResponse("Error al actualizar almacén", { status: 500 });
  }
}

// ELIMINAR almacén
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  try {
    await prisma.almacen.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error al eliminar almacén:", error);
    return new NextResponse("Error al eliminar almacén", { status: 500 });
  }
}
