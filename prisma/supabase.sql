-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.almacen (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  telefono character varying NOT NULL,
  linea1 character varying NOT NULL,
  linea2 character varying,
  pais character varying NOT NULL,
  estado character varying NOT NULL,
  ciudad character varying NOT NULL,
  codpostal character varying NOT NULL,
  CONSTRAINT almacen_pkey PRIMARY KEY (id)
);
CREATE TABLE public.detalle_factura (
  idFactura bigint NOT NULL,
  numero bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  monto real NOT NULL,
  idPaquete bigint NOT NULL,
  CONSTRAINT detalle_factura_pkey PRIMARY KEY (idFactura, numero),
  CONSTRAINT DetalleFactura_idFactura_fkey FOREIGN KEY (idFactura) REFERENCES public.factura(numero),
  CONSTRAINT DetalleFactura_idPaquete_fkey FOREIGN KEY (idPaquete) REFERENCES public.paquete(id)
);
CREATE TABLE public.envio (
  numero integer NOT NULL,
  tipo character varying NOT NULL,
  estado character varying NOT NULL,
  fechasalida date NOT NULL,
  fechallegada date,
  origenCodigo bigint NOT NULL,
  destinoCodigo bigint NOT NULL,
  EmpleadoId bigint NOT NULL,
  clienteId bigint NOT NULL,
  CONSTRAINT envio_pkey PRIMARY KEY (numero),
  CONSTRAINT envio_origencodigo_fkey FOREIGN KEY (origenCodigo) REFERENCES public.almacen(id),
  CONSTRAINT envio_origenCodigo_fkey FOREIGN KEY (origenCodigo) REFERENCES public.almacen(id),
  CONSTRAINT envio_destinoCodigo_fkey FOREIGN KEY (destinoCodigo) REFERENCES public.almacen(id),
  CONSTRAINT envio_EmpleadoId_fkey FOREIGN KEY (EmpleadoId) REFERENCES public.usuario(id),
  CONSTRAINT envio_clienteId_fkey FOREIGN KEY (clienteId) REFERENCES public.usuario(id)
);
CREATE TABLE public.factura (
  numero integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  estado boolean NOT NULL,
  pdf character varying,
  metodoPago character varying NOT NULL,
  monto real NOT NULL,
  cantidadPiezas integer NOT NULL,
  envioNumero integer NOT NULL,
  clienteId bigint NOT NULL,
  CONSTRAINT factura_pkey PRIMARY KEY (numero),
  CONSTRAINT factura_envioNumero_fkey FOREIGN KEY (envioNumero) REFERENCES public.envio(numero),
  CONSTRAINT factura_clienteId_fkey FOREIGN KEY (clienteId) REFERENCES public.usuario(id)
);
CREATE TABLE public.paquete (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  descripcion character varying NOT NULL,
  largo real NOT NULL,
  ancho real NOT NULL,
  alto real NOT NULL,
  peso real NOT NULL,
  volumen real NOT NULL,
  almacenCodigo bigint NOT NULL,
  empleadoId bigint NOT NULL,
  envioNumero integer,
  CONSTRAINT paquete_pkey PRIMARY KEY (id),
  CONSTRAINT paquete_almacenCodigo_fkey FOREIGN KEY (almacenCodigo) REFERENCES public.almacen(id),
  CONSTRAINT paquete_empleadoId_fkey FOREIGN KEY (empleadoId) REFERENCES public.usuario(id),
  CONSTRAINT paquete_envioNumero_fkey FOREIGN KEY (envioNumero) REFERENCES public.factura(numero)
);
CREATE TABLE public.usuario (
  id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  cedula character varying NOT NULL UNIQUE,
  nombre character varying NOT NULL,
  apellido character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  telefono character varying NOT NULL,
  password character varying NOT NULL,
  rol character varying NOT NULL,
  CONSTRAINT usuario_pkey PRIMARY KEY (id)
);