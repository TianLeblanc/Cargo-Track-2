"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
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
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: `${formData.fname} ${formData.flastname}`.trim(), // Nombre completo
        role: 'cliente' // Rol por defecto
      });
    } catch (err) {
      setError("Error en el registro. Por favor intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Registrarse
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingrese sus datos, email y contraseña para crear una cuenta.
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
                <div className="sm:col-span-1">
                  <Label>
                    Primer nombre<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="fname"
                    placeholder="Ingrese su primer nombre"
                    value={formData.fname}
                    onChange={handleChange}
                   
                  />
                </div>

                <div className="sm:col-span-1">
                  <Label>
                    Segundo nombre
                  </Label>
                  <Input
                    type="text"
                    name="sname"
                    placeholder="Ingrese su segundo nombre"
                    value={formData.sname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    Primer apellido<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="flastname"
                    placeholder="Ingrese su primer apellido"
                    value={formData.flastname}
                    onChange={handleChange}
                   
                  />
                </div>

                <div className="sm:col-span-1">
                  <Label>
                    Segundo apellido
                  </Label>
                  <Input
                    type="text"
                    name="slastname"
                    placeholder="Ingrese su segundo apellido"
                    value={formData.slastname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Ingrese su email"
                    value={formData.email}
                    onChange={handleChange}
                   
                  />
                </div>

                <div className="sm:col-span-1">
                  <Label>
                    Contraseña<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Ingrese su contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
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
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              ¿Ya tiene una cuenta? {""}
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