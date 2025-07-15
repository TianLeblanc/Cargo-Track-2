import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Usuarios
  console.log('🧑‍💼 Insertando usuarios...');
  await prisma.usuario.create({
    data: {
      cedula: '10000001',
      email: 'admin@cargo.com',
      p_nombre: 'Admin',
      s_nombre: 'Root',
      p_apellido: 'Principal',
      s_apellido: null,
      telefono: '1111111111',
      password: 'adminpass',
      rol: 'admin',
    },
  });

  const empleado = await prisma.usuario.create({
    data: {
      cedula: '10000002',
      email: 'empleado@cargo.com',
      p_nombre: 'Juan',
      s_nombre: 'Carlos',
      p_apellido: 'Gómez',
      s_apellido: null,
      telefono: '2222222222',
      password: 'empleadopass',
      rol: 'empleado',
    },
  });

  await prisma.usuario.create({
    data: {
      cedula: '10000003',
      email: 'cliente@cargo.com',
      p_nombre: 'Ana',
      s_nombre: 'María',
      p_apellido: 'Pérez',
      s_apellido: null,
      telefono: '3333333333',
      password: 'clientepass',
      rol: 'cliente',
    },
  });

  // Almacenes
  console.log('🏬 Insertando almacenes...');
  const almacen1 = await prisma.almacen.create({
    data: {
      telefono: '5551111',
      linea1: 'Calle 1 #123',
      linea2: 'Zona Norte',
      pais: 'Colombia',
      estado: 'Antioquia',
      ciudad: 'Medellín',
      codpostal: '050001',
    },
  });

  const almacen2 = await prisma.almacen.create({
    data: {
      telefono: '5552222',
      linea1: 'Av. Central 456',
      linea2: 'Sector Centro',
      pais: 'Colombia',
      estado: 'Cundinamarca',
      ciudad: 'Bogotá',
      codpostal: '110111',
    },
  });

  const almacen3 = await prisma.almacen.create({
    data: {
      telefono: '5553333',
      linea1: 'Calle Sur 789',
      linea2: 'Zona Sur',
      pais: 'Ecuador',
      estado: 'Pichincha',
      ciudad: 'Quito',
      codpostal: '170101',
    },
  });

  // Envios
  console.log('📦 Insertando envíos y paquetes...');
  const envio1 = await prisma.envio.create({
    data: {
      tipo: 'barco',
      estado: 'en puerto de salida',
      fechasalida: new Date('2025-07-01'),
      fechallegada: new Date('2025-07-15'),
      origenCodigo: almacen1.id,
      destinoCodigo: almacen2.id,
      EmpleadoId: empleado.id,
    },
  });

  const envio2 = await prisma.envio.create({
    data: {
      tipo: 'avion',
      estado: 'en transito',
      fechasalida: new Date('2025-07-10'),
      fechallegada: null,
      origenCodigo: almacen2.id,
      destinoCodigo: almacen3.id,
      EmpleadoId: empleado.id,
    },
  });

  // Paquetes
  await prisma.paquete.createMany({
    data: [
      {
        descripcion: 'Ropa',
        largo: 30,
        ancho: 20,
        alto: 10,
        peso: 2,
        volumen: 6,
        almacenCodigo: almacen1.id,
        empleadoId: empleado.id,
        envioNumero: envio1.numero,
        estado: 'en puerto de salida',
      },
      {
        descripcion: 'Electrónica',
        largo: 40,
        ancho: 25,
        alto: 15,
        peso: 5,
        volumen: 15,
        almacenCodigo: almacen1.id,
        empleadoId: empleado.id,
        envioNumero: envio1.numero,
        estado: 'en puerto de salida',
      },
      {
        descripcion: 'Libros',
        largo: 25,
        ancho: 20,
        alto: 8,
        peso: 3,
        volumen: 4,
        almacenCodigo: almacen2.id,
        empleadoId: empleado.id,
        envioNumero: envio1.numero,
        estado: 'en puerto de salida',
      },
      {
        descripcion: 'Zapatos',
        largo: 32,
        ancho: 22,
        alto: 12,
        peso: 2.5,
        volumen: 8.4,
        almacenCodigo: almacen2.id,
        empleadoId: empleado.id,
        envioNumero: envio2.numero,
        estado: 'en transito',
      },
      {
        descripcion: 'Juguetes',
        largo: 28,
        ancho: 18,
        alto: 14,
        peso: 1.8,
        volumen: 7,
        almacenCodigo: almacen3.id,
        empleadoId: empleado.id,
        envioNumero: envio2.numero,
        estado: 'en transito',
      },
      {
        descripcion: 'Herramientas',
        largo: 35,
        ancho: 20,
        alto: 15,
        peso: 4,
        volumen: 10.5,
        almacenCodigo: almacen3.id,
        empleadoId: empleado.id,
        envioNumero: envio2.numero,
        estado: 'en transito',
      },
    ],
  });

  console.log('Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });