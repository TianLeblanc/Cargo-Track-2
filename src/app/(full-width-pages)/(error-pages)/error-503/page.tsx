import GridShape from "@/components/common/GridShape";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function error503() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          ACCESO DENEGADO
        </h1>

        {/* Imágenes para no autorizado - deberás crear estos archivos */}
        <Image
          src="/images/error/503.svg"
          alt="503 No autorizado"
          className="dark:hidden"
          width={472}
          height={152}
        />
        <Image
          src="/images/error/503-dark.svg"
          alt="503 No autorizado"
          className="hidden dark:block"
          width={472}
          height={152}
        />

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          No tienes permisos para acceder a esta página.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Volver al Inicio
          </Link>

          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-primary-dark"
          >
            Iniciar sesión como otro usuario
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - TailAdmin
      </p>
    </div>
  );
}