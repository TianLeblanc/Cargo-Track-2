// app/api/user/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function PUT(req: NextRequest) {
  try {
    const { userId, ...updateData } = await req.json();

    // Validar datos requeridos
    if (!userId || !updateData.p_nombre || !updateData.p_apellido || !updateData.email) {
      return NextResponse.json(
        { message: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe (excepto para este usuario)
    const emailExists = await prisma.usuario.findFirst({
      where: {
        email: updateData.email,
        NOT: { id: userId }
      }
    });

    if (emailExists) {
      return NextResponse.json(
        { message: 'El email ya está en uso por otro usuario' },
        { status: 400 }
      );
    }

    // Actualizar usuario
    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: {
        p_nombre: updateData.p_nombre,
        s_nombre: updateData.s_nombre || null, // Manejar campo opcional
        p_apellido: updateData.p_apellido,
        s_apellido: updateData.s_apellido || null, // Manejar campo opcional
        email: updateData.email,
        telefono: updateData.telefono,
        cedula: updateData.cedula || null // Manejar campo opcional
      },
      select: {
        id: true,
        cedula: true,
        email: true,
        p_nombre: true,
        s_nombre: true,
        p_apellido: true,
        s_apellido: true,
        telefono: true,
        rol: true
        // No devolver la contraseña
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('[USER_UPDATE]', error);
    return NextResponse.json(
      { message: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}