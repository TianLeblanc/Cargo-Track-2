# Sistema Administrativo de Casillero - Proyecto de Base de Datos

Este proyecto consiste en el desarrollo de un sistema básico de facturación con soporte para gestión de productos, emisión de facturas y visualización de reportes. El sistema fue desarrollado como parte de la materia **Base de Datos** y está enfocado en la práctica de diseño, normalización y manipulación de bases de datos relacionales.

## 📦 Funcionalidades principales

- Registro y gestión de envíos
- Emisión de facturas con múltiples ítems
- Cálculo automático de totales, cargos.
- Vista previa de facturas en interfaz web
- Exportación de facturas en formato **PDF**
- Visualización y filtrado de facturas, envíos y paquetes o cliente

## 🧱 Estructura del sistema

El proyecto se compone de las siguientes entidades principales:

### 👤 Tabla: 'Usuario'
- **ID: Int**
- **Cedula: String**
- **Nombre: String**
- **Apellido: String**
- **Email: String**
- **Telefono: String**
- **Contrasena: String**
- **Rol: String**

### 🏬 Tabla: 'Almacen'
- **Codigo: Int**
- **Telefono: String**
- **Linea1: String**
- **Linea2: String?**
- **Pais: String**
- **Estado: String**
- **Ciudad: String**
- **CodigoPostal: String**

### 📦 Tabla: 'Paquete'
- **Codigo: Int**
- **Descripcion: String**
- **Largo: Float**
- **Ancho: Float**
- **Alto: Float**
- **Peso: Float**
- **Volumen: Float**
- **AlmacenCodigo (FK): Int**
- **EmpleadoId (FK): String**

### ✈️ Tabla: 'Envio'
  **Tracking: Int**
  **Tipo: String**
  **Estado: String**
  **tracking: String**
  **fechaSalida: DateTime**
  **fechaLlegada: DateTime?**
  **origenCodigo: Int**
  **destinoCodigo: Int**
  **empleadoId: String**
  **clienteId: String**

### 🧾 Tabla: `Factura`
- **N° de Factura**
- **FechaCreacion**
- **FechaActualizacion**
- **Cliente** 
- **Monto**
- **Estado**
- **Forma de pago**
- **PDF**

### 📋 Tabla: `Detalles`
- **N° de Factura**
- **N° de Ítem**
- **Código del artículo**
- **Cantidad**
- **Monto**

## 🛠️ Tecnologías utilizadas

- **Next.js** con React para el frontend
- **TypeScript** como lenguaje principal
- **Prisma ORM** para interacción con la base de datos
- **PostgreSQL** como sistema de gestión de base de datos
- **Tailwind CSS** para estilos
- **Next-auth** para autentificación
- **React-PDF** para generación de PDFs

## 🚀 Cómo ejecutar el proyecto

1. Clona este repositorio:
    
    ```bash
    git clone https://github.com/saulramos2005/cargo-track.git
    cd cargo-track

2. Instala las dependencias:

    npm install

3. Crea el archivo .env con la configuración de tu base de datos PostgreSQL:

    DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/facturacion

4. Ejecuta las migraciones de Prisma:
    
    npx prisma migrate dev

5. Levanta el servidor de desarrollo:

    npm run dev


## 📄 Licencia
    Este proyecto fue desarrollado con fines educativos y académicos. Puedes adaptarlo libremente con fines personales o de aprendizaje.

    Universidad de Oriente – Núcleo Nueva Esparta
    Escuela de Ingeniería y Ciencias Aplicadas
    Lic. en Informática
    Cátedra: Diseño de Bases de Datos
    Autores:
        Diego Tovar C.I: 30414491
        Saul Ramos C.I: 31216675
        Sandra Larez C.I: 31667982
        Sebastian Leblanc C.I: 31667720
        Stephania Dos Santos C.I: 30685285

    Fecha: Julio, 2025