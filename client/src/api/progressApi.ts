import { http } from './http';
import type { Exercise, ProgressEntry, ProgressSummary } from '../types';

export const fetchFavoritesApi = async () => {
  const { data } = await http.get<{ status: string; favorites: Exercise[] }>('/progress/favorites');
  return data;
};

export const toggleFavoriteApi = async (exerciseId: string) => {
  const { data } = await http.post<{ status: string; favoriteExercises: string[]; action: string }>(
    `/progress/favorites/${exerciseId}`
  );
  return data;
};

export const markCompletedApi = async (payload: {
  exerciseId: string;
  durationMinutes: number;
  notes?: string;
}) => {
  const { data } = await http.post('/progress/complete', payload);
  return data;
};

export const fetchMyProgressApi = async () => {
  const { data } = await http.get<{
    status: string;
    summary: ProgressSummary;
    progressEntries: ProgressEntry[];
  }>('/progress/me');
  return data;
};
