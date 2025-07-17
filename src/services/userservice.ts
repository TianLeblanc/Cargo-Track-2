
interface UpdateUserData {
  p_nombre: string;
  s_nombre?: string;
  p_apellido: string;
  s_apellido?: string;
  email: string;
  telefono: string;
cedula?: string; 

}

export const UserService = {
  async updateUser(userId: number, userData: UpdateUserData) {
    const res = await fetch('/api/user/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...userData }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al actualizar usuario');
    }
    
    return await res.json();
  }
};