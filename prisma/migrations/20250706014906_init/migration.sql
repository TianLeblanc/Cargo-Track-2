-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive', 'archived');

-- CreateTable
CREATE TABLE "Empleado" (
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "esAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "Almacen" (
    "codigo" SERIAL NOT NULL,
    "telefono" TEXT NOT NULL,
    "linea1" TEXT NOT NULL,
    "linea2" TEXT,
    "pais" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Paquete" (
    "codigo" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "largo" DOUBLE PRECISION NOT NULL,
    "ancho" DOUBLE PRECISION NOT NULL,
    "alto" DOUBLE PRECISION NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "volumen" DOUBLE PRECISION NOT NULL,
    "almacenCodigo" INTEGER NOT NULL,
    "empleadoCedula" TEXT NOT NULL,

    CONSTRAINT "Paquete_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Envio" (
    "numero" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "tracking" TEXT NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL,
    "fechaLlegada" TIMESTAMP(3),
    "origenCodigo" INTEGER NOT NULL,
    "destinoCodigo" INTEGER NOT NULL,
    "empleadoCedula" TEXT NOT NULL,
    "clienteCedula" TEXT NOT NULL,

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "Incluye" (
    "envioNumero" INTEGER NOT NULL,
    "paqueteCodigo" INTEGER NOT NULL,

    CONSTRAINT "Incluye_pkey" PRIMARY KEY ("envioNumero","paqueteCodigo")
);

-- CreateTable
CREATE TABLE "Factura" (
    "numero" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "cantidadPiezas" INTEGER NOT NULL,
    "envioNumero" INTEGER NOT NULL,
    "empleadoCedula" TEXT NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "DetalleFactura" (
    "numero" SERIAL NOT NULL,
    "montoCalculado" DOUBLE PRECISION NOT NULL,
    "facturaNumero" INTEGER NOT NULL,

    CONSTRAINT "DetalleFactura_pkey" PRIMARY KEY ("numero")
);

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_almacenCodigo_fkey" FOREIGN KEY ("almacenCodigo") REFERENCES "Almacen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_empleadoCedula_fkey" FOREIGN KEY ("empleadoCedula") REFERENCES "Empleado"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_origenCodigo_fkey" FOREIGN KEY ("origenCodigo") REFERENCES "Almacen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_destinoCodigo_fkey" FOREIGN KEY ("destinoCodigo") REFERENCES "Almacen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_empleadoCedula_fkey" FOREIGN KEY ("empleadoCedula") REFERENCES "Empleado"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_clienteCedula_fkey" FOREIGN KEY ("clienteCedula") REFERENCES "Cliente"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incluye" ADD CONSTRAINT "Incluye_envioNumero_fkey" FOREIGN KEY ("envioNumero") REFERENCES "Envio"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incluye" ADD CONSTRAINT "Incluye_paqueteCodigo_fkey" FOREIGN KEY ("paqueteCodigo") REFERENCES "Paquete"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_envioNumero_fkey" FOREIGN KEY ("envioNumero") REFERENCES "Envio"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_empleadoCedula_fkey" FOREIGN KEY ("empleadoCedula") REFERENCES "Empleado"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_facturaNumero_fkey" FOREIGN KEY ("facturaNumero") REFERENCES "Factura"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;
