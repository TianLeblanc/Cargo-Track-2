'use client';

export type Rol = 'admin' | 'empleado' | 'cliente';

export interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  nombre2?: string;
  apellido: string;
  apellido2?: string;
  email: string;
  telefono: string;
  password: string;
  rol: Rol;
}

// Obtener todos los usuarios
export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const res = await fetch('/api/usuarios');
  if (!res.ok) throw new Error('Error al obtener usuarios');
  const data = await res.json();
  return data.map((u: any) => ({
    ...u,
    rol: u.rol as Rol,
  }));
};

// Crear usuario
export const crearUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
  const res = await fetch('/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) throw new Error('Error al crear usuario');
  return await res.json();
};

// Actualizar usuario
export const actualizarUsuario = async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario),
  });

  if (!res.ok) throw new Error('Error al actualizar usuario');
  return await res.json();
};

// Eliminar usuario
export const eliminarUsuario = async (id: number): Promise<void> => {
  const res = await fetch(`/api/usuarios/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Error al eliminar usuario');
};
