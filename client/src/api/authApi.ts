import { http } from './http';
import type { AuthResponse, User } from '../types';

export const registerApi = async (payload: { name: string; email: string; password: string }) => {
  const { data } = await http.post<AuthResponse>('/auth/register', payload);
  return data;
};

export const loginApi = async (payload: { email: string; password: string }) => {
  const { data } = await http.post<AuthResponse>('/auth/login', payload);
  return data;
};

export const getMeApi = async () => {
  const { data } = await http.get<{ status: string; user: User }>('/auth/me');
  return data;
};

export const updateProfileApi = async (payload: { name: string; email: string }) => {
  const { data } = await http.patch<{ status: string; user: User }>('/users/me', payload);
  return data;
};
