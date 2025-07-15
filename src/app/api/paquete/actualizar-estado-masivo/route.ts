import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

// PUT: Actualizar el estado de todos los paquetes asociados a un envío
export async function PUT(req: NextRequest) {
  try {
    const { envioNumero, estado } = await req.json();
    console.log('REQ envioNumero:', envioNumero, 'estado:', estado, 'typeof envioNumero:', typeof envioNumero);
    if (typeof envioNumero !== 'number' || !estado) {
      return NextResponse.json({ message: 'envioNumero (number) y estado son requeridos' }, { status: 400 });
    }

    // Buscar los paquetes asociados al envío
    const paquetes = await prisma.paquete.findMany({
      where: { envioNumero: envioNumero }
    });
    console.log('Paquetes encontrados:', paquetes.length, paquetes.map(p => p.id));

    if (!paquetes.length) {
      return NextResponse.json({ message: 'No se encontraron paquetes para este envío', envioNumero }, { status: 404 });
    }

    // Actualizar el estado de todos los paquetes
    await prisma.paquete.updateMany({
      where: { envioNumero: envioNumero },
      data: { estado }
    });

    // Devolver los paquetes actualizados para depuración
    const paquetesActualizados = await prisma.paquete.findMany({
      where: { envioNumero: envioNumero }
    });
    console.log('Paquetes actualizados:', paquetesActualizados.map(p => ({ id: p.id, estado: p.estado })));

    return NextResponse.json({ message: 'Estados de paquetes actualizados correctamente', paquetesActualizados });
  } catch (error) {
    console.error('Error en actualizar-estado-masivo:', error);
    return NextResponse.json({ message: 'Error al actualizar estados de paquetes', error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
