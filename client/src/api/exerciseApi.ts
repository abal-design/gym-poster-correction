import { http } from './http';
import type { Exercise } from '../types';

export const fetchExercisesApi = async (params?: { category?: string; search?: string }) => {
  const { data } = await http.get<{ status: string; results: number; exercises: Exercise[] }>('/exercises', {
    params,
  });
  return data;
};

export const fetchExerciseByIdApi = async (id: string) => {
  const { data } = await http.get<{ status: string; exercise: Exercise }>(`/exercises/${id}`);
  return data;
};

export const createExerciseApi = async (payload: Partial<Exercise>) => {
  const { data } = await http.post<{ status: string; exercise: Exercise }>('/exercises', payload);
  return data;
};

export const updateExerciseApi = async (id: string, payload: Partial<Exercise>) => {
  const { data } = await http.patch<{ status: string; exercise: Exercise }>(`/exercises/${id}`, payload);
  return data;
};

export const deleteExerciseApi = async (id: string) => {
  await http.delete(`/exercises/${id}`);
};
