/*
  Warnings:

  - You are about to drop the column `empleadoId` on the `Factura` table. All the data in the column will be lost.
  - Added the required column `paqueteReferencia` to the `DetalleFactura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `Factura` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `estado` on the `Factura` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_empleadoId_fkey";

-- AlterTable
CREATE SEQUENCE detallefactura_numero_seq;
ALTER TABLE "DetalleFactura" ADD COLUMN     "paqueteReferencia" INTEGER NOT NULL,
ALTER COLUMN "numero" SET DEFAULT nextval('detallefactura_numero_seq');
ALTER SEQUENCE detallefactura_numero_seq OWNED BY "DetalleFactura"."numero";

-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "empleadoId",
ADD COLUMN     "clienteId" INTEGER NOT NULL,
ADD COLUMN     "pdf" TEXT,
DROP COLUMN "estado",
ADD COLUMN     "estado" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_paqueteReferencia_fkey" FOREIGN KEY ("paqueteReferencia") REFERENCES "Paquete"("tracking") ON DELETE RESTRICT ON UPDATE CASCADE;
