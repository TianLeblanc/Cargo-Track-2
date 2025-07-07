/*
  Warnings:

  - The primary key for the `DetalleFactura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clienteCedula` on the `Envio` table. All the data in the column will be lost.
  - You are about to drop the column `empleadoCedula` on the `Envio` table. All the data in the column will be lost.
  - You are about to drop the column `tracking` on the `Envio` table. All the data in the column will be lost.
  - You are about to drop the column `empleadoCedula` on the `Factura` table. All the data in the column will be lost.
  - The primary key for the `Paquete` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `codigo` on the `Paquete` table. All the data in the column will be lost.
  - You are about to drop the column `empleadoCedula` on the `Paquete` table. All the data in the column will be lost.
  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Empleado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Incluye` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Almacen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `Envio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empleadoId` to the `Envio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Envio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empleadoId` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empleadoId` to the `Paquete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Paquete` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Envio" DROP CONSTRAINT "Envio_clienteCedula_fkey";

-- DropForeignKey
ALTER TABLE "Envio" DROP CONSTRAINT "Envio_empleadoCedula_fkey";

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_empleadoCedula_fkey";

-- DropForeignKey
ALTER TABLE "Incluye" DROP CONSTRAINT "Incluye_envioNumero_fkey";

-- DropForeignKey
ALTER TABLE "Incluye" DROP CONSTRAINT "Incluye_paqueteCodigo_fkey";

-- DropForeignKey
ALTER TABLE "Paquete" DROP CONSTRAINT "Paquete_empleadoCedula_fkey";

-- AlterTable
ALTER TABLE "Almacen" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "DetalleFactura" DROP CONSTRAINT "DetalleFactura_pkey",
ADD COLUMN     "descripcion" TEXT,
ALTER COLUMN "numero" DROP DEFAULT,
ADD CONSTRAINT "DetalleFactura_pkey" PRIMARY KEY ("facturaNumero", "numero");
DROP SEQUENCE "DetalleFactura_numero_seq";

-- AlterTable
ALTER TABLE "Envio" DROP COLUMN "clienteCedula",
DROP COLUMN "empleadoCedula",
DROP COLUMN "tracking",
ADD COLUMN     "clienteId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "empleadoId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "empleadoCedula",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "empleadoId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Paquete" DROP CONSTRAINT "Paquete_pkey",
DROP COLUMN "codigo",
DROP COLUMN "empleadoCedula",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "empleadoId" INTEGER NOT NULL,
ADD COLUMN     "envioNumero" INTEGER,
ADD COLUMN     "tracking" SERIAL NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "Paquete_pkey" PRIMARY KEY ("tracking");

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Empleado";

-- DropTable
DROP TABLE "Incluye";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "DetalleFactura_facturaNumero_idx" ON "DetalleFactura"("facturaNumero");

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_envioNumero_fkey" FOREIGN KEY ("envioNumero") REFERENCES "Envio"("numero") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
