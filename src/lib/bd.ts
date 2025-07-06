import { PrismaClient } from '@prisma/client';

// Singleton para el cliente Prisma
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Esquemas y tipos (opcional, puedes moverlos a otro archivo)
export type Product = {
  id: number;
  imageUrl: string;  // Usa el nombre camelCase
  name: string;
  status: string;
  price: number;
  stock: number;
  availableAt: Date;
};

// Funciones adaptadas para Prisma
export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: Product[];
  newOffset: number | null;
  totalProducts: number;
}> {
  if (search) {
    const products = await prisma.product.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' }
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,  // Usa el nombre del modelo (no el de la BD)
        status: true,
        price: true,
        stock: true,
        availableAt: true
      },
      take: 1000
    });
    return { products, newOffset: null, totalProducts: 0 };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({ skip: offset, take: 5 }), 
    prisma.product.count() 
  ]);

  const newOffset = products.length >= 5 ? offset + 5 : null;

  return {
    products,
    newOffset,
    totalProducts: total
  };
}

export async function deleteProductById(id: number) {
  await prisma.product.delete({ where: { id } });
}