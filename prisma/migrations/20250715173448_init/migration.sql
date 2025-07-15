-- CreateTable
CREATE TABLE "Almacen" (
    "id" SERIAL NOT NULL,
    "telefono" TEXT NOT NULL,
    "linea1" TEXT NOT NULL,
    "linea2" TEXT,
    "pais" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "codpostal" TEXT NOT NULL,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "cedula" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "p_nombre" TEXT NOT NULL,
    "s_nombre" TEXT,
    "p_apellido" TEXT NOT NULL,
    "s_apellido" TEXT,
    "telefono" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Envio" (
    "numero" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fechasalida" DATE NOT NULL,
    "fechallegada" DATE,
    "origenCodigo" INTEGER NOT NULL,
    "destinoCodigo" INTEGER NOT NULL,
    "EmpleadoId" INTEGER NOT NULL,

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "Factura" (
    "numero" SERIAL NOT NULL,
    "estado" BOOLEAN NOT NULL,
    "pdf" TEXT,
    "metodoPago" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "cantidadPiezas" INTEGER NOT NULL,
    "envioNumero" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "DetalleFactura" (
    "idFactura" INTEGER NOT NULL,
    "numero" SERIAL NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "idPaquete" INTEGER NOT NULL,

    CONSTRAINT "DetalleFactura_pkey" PRIMARY KEY ("idFactura","numero")
);

-- CreateTable
CREATE TABLE "Paquete" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "largo" DOUBLE PRECISION NOT NULL,
    "ancho" DOUBLE PRECISION NOT NULL,
    "alto" DOUBLE PRECISION NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "volumen" DOUBLE PRECISION NOT NULL,
    "almacenCodigo" INTEGER NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "envioNumero" INTEGER,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Paquete_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_envioNumero_key" ON "Factura"("envioNumero");

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_origenCodigo_fkey" FOREIGN KEY ("origenCodigo") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_destinoCodigo_fkey" FOREIGN KEY ("destinoCodigo") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_EmpleadoId_fkey" FOREIGN KEY ("EmpleadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_envioNumero_fkey" FOREIGN KEY ("envioNumero") REFERENCES "Envio"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_idPaquete_fkey" FOREIGN KEY ("idPaquete") REFERENCES "Paquete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_idFactura_fkey" FOREIGN KEY ("idFactura") REFERENCES "Factura"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_almacenCodigo_fkey" FOREIGN KEY ("almacenCodigo") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_envioNumero_fkey" FOREIGN KEY ("envioNumero") REFERENCES "Envio"("numero") ON DELETE SET NULL ON UPDATE CASCADE;
