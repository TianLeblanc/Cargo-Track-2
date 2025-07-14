import { NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany();
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nuevoUsuario = await prisma.usuario.create({ data });
    return NextResponse.json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
