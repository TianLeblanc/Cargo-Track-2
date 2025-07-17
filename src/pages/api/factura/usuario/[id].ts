import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/bd';

// GET /api/factura/usuario/[id]
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'Falta el id de usuario' });
  }
  try {
    // Buscar todas las facturas del usuario, incluyendo el número de envío
    const facturas = await prisma.factura.findMany({
      where: { usuarioId: Number(id) },
      select: {
        id: true,
        envioNumero: true,
        // Puedes agregar más campos si lo necesitas
      },
    });
    return res.status(200).json(facturas);
  } catch (error) {
    console.error('Error al buscar facturas por usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
