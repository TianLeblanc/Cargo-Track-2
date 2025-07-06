/*
  Warnings:

  - You are about to drop the column `esAdmin` on the `Empleado` table. All the data in the column will be lost.
  - Added the required column `rol` to the `Empleado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Empleado" DROP COLUMN "esAdmin",
ADD COLUMN     "rol" BOOLEAN NOT NULL;
