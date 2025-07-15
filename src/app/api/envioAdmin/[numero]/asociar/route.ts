import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/bd';

export async function POST(req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const envioNumero = parseInt(params.numero);
    const { paqueteIds, clienteId } = await req.json();
    
    // Validaciones básicas
    if (!paqueteIds || !Array.isArray(paqueteIds)) {
      return new NextResponse('IDs de paquetes inválidos', { status: 400 });
    }

    if (!clienteId || typeof clienteId !== 'number') {
      return new NextResponse('ID de cliente inválido', { status: 400 });
    }

    // Verificar que el envío existe
    const envio = await prisma.envio.findUnique({
      where: { numero: envioNumero },
      select: { tipo: true, estado: true }
    });
    
    if (!envio) {
      return new NextResponse('Envío no encontrado', { status: 404 });
    }
    
    // Verificar que los paquetes existen y están disponibles
    const paquetes = await prisma.paquete.findMany({
      where: {
        id: { in: paqueteIds },
        envioNumero: null // Solo paquetes sin envío
      },
      select: {
        id: true,
        descripcion: true,
        peso: true,
        volumen: true,
        empleadoId: true,
        almacenCodigo: true
      }
    });
    
    if (paquetes.length !== paqueteIds.length) {
      const paquetesNoDisponibles = paqueteIds.filter(id => 
        !paquetes.some(p => p.id === id)
      );
      return new NextResponse(
        `Los siguientes paquetes no están disponibles: ${paquetesNoDisponibles.join(', ')}`, 
        { status: 400 }
      );
    }

    // Iniciar transacción
    const result = await prisma.$transaction(async (prisma) => {
      // Actualizar los paquetes para asociarlos al envío
      await prisma.paquete.updateMany({
        where: { id: { in: paqueteIds } },
        data: {
          envioNumero: envioNumero,
          estado: `Envío ${envio.estado}`
        }
      });
      
      // Calcular el monto total y los detalles de la factura
      let montoTotal = 0;
      const detallesFactura = paquetes.map(paquete => {
        let monto = 0;
        
        if (envio.tipo === 'barco') {
          // $25 por pie cúbico (mínimo $35)
          monto = Math.max(25 * (paquete.volumen || 1), 35);
        } else {
          // $7 por libra o volumen (lo que sea mayor, mínimo $45)
          const porPeso = 7 * (paquete.peso || 0);
          const porVolumen = 7 * (paquete.volumen || 0);
          monto = Math.max(Math.max(porPeso, porVolumen), 45);
        }
        
        montoTotal += monto;
        
        return {
          descripcion: paquete.descripcion,
          cantidad: 1,
          monto: monto,  // Cambiado de precioUnitario a monto
          idPaquete: paquete.id
        };
      });

      // Crear la factura
      const factura = await prisma.factura.create({
        data: {
          estado: false, // No pagado inicialmente
          metodoPago: 'pendiente',
          monto: montoTotal,
          cantidadPiezas: paquetes.length,
          envioNumero: envioNumero,
          clienteId: clienteId,
          detalles: {
            create: detallesFactura.map(detalle => ({
              descripcion: detalle.descripcion,
              cantidad: detalle.cantidad,
              monto: detalle.monto,
              idPaquete: detalle.idPaquete
            }))
          }
        },
        include: {
          detalles: true,
          cliente: {
            select: {
              id: true,
              p_nombre: true,
              p_apellido: true
            }
          }
        }
      });

      return { factura, paquetesAsociados: paquetes.length };
    });

    return NextResponse.json({
      success: true,
      message: `${result.paquetesAsociados} paquetes asociados correctamente`,
      factura: result.factura
    });
    
  } catch (error) {
    console.error('[ENVIO_ASOCIAR] Error:', error);
    return new NextResponse('Error interno al asociar paquetes', { status: 500 });
  }
}