import { User } from '../types/authTypes';

const API_URL = 'http://tu-api.com/auth'; // Reemplaza con tu URL real

export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciales incorrectas');
  }

  return await response.json();
};

export const register = async (userData: any): Promise<User> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Error en el registro');
  }

  return await response.json();
};

export const checkAuth = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/check`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Sesión expirada');
  }

  return await response.json();
};