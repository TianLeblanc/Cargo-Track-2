"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { useAuth } from "@/context/AuthContext";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { UserService } from "@/services/userservice";

export default function UserInfoCard() {
  const { user, updateUser } = useAuth();
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    p_nombre: "",
    s_nombre: "",
    p_apellido: "",
    s_apellido: "",
    email: "",
    telefono: "",
    cedula: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar formData cuando user cambie
  useEffect(() => {
    if (user) {
      setFormData({
        p_nombre: user.p_nombre || "",
        s_nombre: user.s_nombre || "",
        p_apellido: user.p_apellido || "",
        s_apellido: user.s_apellido || "",
        email: user.email || "",
        telefono: user.telefono || "",
        cedula: user.cedula || "" // Asegurarse de que cedula esté en formData
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error al cambiar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.p_nombre.trim()) newErrors.p_nombre = "Primer nombre es requerido";
    if (!formData.p_apellido.trim()) newErrors.p_apellido = "Primer apellido es requerido";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email no válido";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "Teléfono es requerido";
    } else if (!/^[0-9+]+$/.test(formData.telefono)) {
      newErrors.telefono = "Teléfono solo puede contener números y +";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      const updatedUser = await UserService.updateUser(user.id, {
        p_nombre: formData.p_nombre,
        s_nombre: formData.s_nombre || undefined,
        p_apellido: formData.p_apellido,
        s_apellido: formData.s_apellido || undefined,
        email: formData.email,
        telefono: formData.telefono,
        cedula: formData.cedula
      });

      updateUser(updatedUser.user);
      alert("Perfil actualizado correctamente");
      closeModal();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert(error instanceof Error ? error.message : "Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
     
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informacion Personal
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Primer Nombre
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.p_nombre}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Segundo Nombre
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.s_nombre}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Primer Apellido
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.p_apellido}
              </p> 
            </div>



            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Segundo Apellido
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.s_apellido || "No disponible"}
              </p>
            </div>


            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Telefono
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.telefono || "No disponible"}
              </p>
            </div>


            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                cedula
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.cedula}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
        </div>
      </div>


      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Información Personal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Actualice sus datos para mantener su perfil al día.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Primer Nombre*</Label>
                    <Input 
                      type="text" 
                      name="p_nombre"
                      value={formData.p_nombre}
                      onChange={handleChange}
                      error={!!errors.p_nombre}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Segundo Nombre</Label>
                    <Input 
                      type="text" 
                      name="s_nombre"
                      value={formData.s_nombre}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Primer Apellido*</Label>
                    <Input 
                      type="text" 
                      name="p_apellido"
                      value={formData.p_apellido}
                      onChange={handleChange}
                      error={!!errors.p_apellido}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Segundo Apellido</Label>
                    <Input 
                      type="text" 
                      name="s_apellido"
                      value={formData.s_apellido}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email*</Label>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Teléfono*</Label>
                    <Input 
                      type="tel" 
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      error={!!errors.telefono}
                    />
                  </div>
                 
                 <div className="col-span-2 lg:col-span-1">
                    <Label>cedula*</Label>
                    <Input 
                      type="cedula" 
                      name="cedula"
                      value={formData.cedula}
                      onChange={handleChange}
                      error={!!errors.cedula}
                    />
                  </div>
                
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={closeModal}
                disabled={isSaving}
              >
                Cerrar
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                loading={isSaving}
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
