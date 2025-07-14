// app/api/paquete/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/bd'; // usa instancia compartida de Prisma

// PUT: Actualizar paquete
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const updatedPaquete = await prisma.paquete.update({
      where: { id },
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
        envioNumero: data.envioNumero ?? null,
      },
      include: {
        almacen: true,
        envio: true,
        empleado: true,
      },
    });

    return NextResponse.json(updatedPaquete);
  } catch (error) {
    console.error('[PAQUETE_PUT]', error);
    return NextResponse.json(
      { error: 'Error al actualizar paquete' },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar paquete
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.paquete.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PAQUETE_DELETE]', error);
    return NextResponse.json(
      { error: 'Error al eliminar paquete' },
      { status: 500 }
    );
  }
}
