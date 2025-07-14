-- AlterTable
CREATE SEQUENCE envio_numero_seq;
ALTER TABLE "Envio" ALTER COLUMN "numero" SET DEFAULT nextval('envio_numero_seq');
ALTER SEQUENCE envio_numero_seq OWNED BY "Envio"."numero";
