// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function POST(req: NextRequest) {
  const { 
    type, 
    email, 
    password, 
    cedula, 
    p_nombre, 
    s_nombre, 
    p_apellido, 
    s_apellido, 
    telefono, 
    rol } = await req.json();

  if (type === 'register') {
    // Validar duplicados
    const exists = await prisma.usuario.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'Correo ya registrado' }, { status: 400 });
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        cedula,
        p_nombre,
        s_nombre: s_nombre ?? null,
        p_apellido,
        s_apellido: s_apellido ?? null,
        telefono,
        rol: rol || 'cliente',
        password, 
      }
    });

    return NextResponse.json({ success: true, user: nuevoUsuario });
  }

  if (type === 'login') {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    
    const { password: _, ...userSafe } = user;
    return NextResponse.json({ user: userSafe });
  }

  return NextResponse.json({ error: 'Operación no válida' }, { status: 400 });
}
