import { NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedUsuario = await prisma.usuario.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updatedUsuario);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.usuario.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
