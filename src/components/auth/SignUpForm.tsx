"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    fname: "",
    sname: "",
    flastname: "",
    slastname: "",
    email: "",
    password: "",
    cedula: "",
    telefono: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const nombre = `${formData.fname} ${formData.sname}`.trim();
    const apellido = `${formData.flastname} ${formData.slastname}`.trim();

    try {
      console.log("Enviando datos del formulario:", formData);
      await register({
        email: formData.email,
        password: formData.password,
        cedula: formData.cedula,
        nombre,
        apellido,
        telefono: formData.telefono,
        rol: "cliente", // Rol por defecto
      });
      setShowSuccessModal(true); // Mostrar modal de éxito

    } catch (err) {
      console.error("Error en el registro:", err);
      setError("Error en el registro. Por favor intente nuevamente.");

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4 text-green-600">¡Registro exitoso!</h2>
            <p className="mb-6 text-gray-700">Tu cuenta ha sido creada correctamente.</p>
            <button
              className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
              onClick={() => setShowSuccessModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Registrarse
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingrese sus datos para crear una cuenta.
            </p>
          </div>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>Primer Nombre *</Label>
                  <Input
                    name="fname"
                    value={formData.fname}
                    onChange={handleChange}
                    placeholder="Ej: María"
                  />
                </div>
                <div>
                  <Label>Segundo Nombre</Label>
                  <Input
                    name="sname"
                    value={formData.sname}
                    onChange={handleChange}
                    placeholder="Ej: Alejandra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <Label>Primer Apellido *</Label>
                  <Input
                    name="flastname"
                    value={formData.flastname}
                    onChange={handleChange}
                    placeholder="Ej: Rodríguez"
                  />
                </div>
                <div>
                  <Label>Segundo Apellido</Label>
                  <Input
                    name="slastname"
                    value={formData.slastname}
                    onChange={handleChange}
                    placeholder="Ej: Pérez"
                  />
                </div>
              </div>

              <div>
                <Label>Cédula *</Label>
                <Input
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  placeholder="Ej: 12345678"
                />
              </div>

              <div>
                <Label>Teléfono *</Label>
                <Input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej: 04141234567"
                />
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="usuario@correo.com"
                />
              </div>

              <div>
                <Label>Contraseña *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
