// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { type, email, password, cedula, nombre, apellido, telefono, rol } = await req.json();

  if (type === 'register') {
    // Validar duplicados
    const exists = await prisma.usuario.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'Correo ya registrado' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        cedula,
        nombre,
        apellido,
        telefono,
        rol: rol || 'cliente',
        password: hashedPassword,
      }
    });

    return NextResponse.json({ success: true, user: nuevoUsuario });
  }

  if (type === 'login') {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    // Excluir password al responder
    const { password: _, ...userSafe } = user;
    return NextResponse.json({ user: userSafe });
  }

  return NextResponse.json({ error: 'Operación no válida' }, { status: 400 });
}
