import { useEffect, useMemo, useState } from 'react';
import ExerciseCard from '../components/ExerciseCard';
import { fetchExercisesApi } from '../api/exerciseApi';
import { fetchFavoritesApi, toggleFavoriteApi } from '../api/progressApi';
import { getErrorMessage } from '../api/http';
import { useAuth } from '../context/AuthContext';
import type { Exercise } from '../types';

const CategoriesPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'upper body' | 'lower body'>('all');
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  const loadExercises = async () => {
    try {
      setError('');
      const data = await fetchExercisesApi({
        category: category === 'all' ? undefined : category,
        search: search || undefined,
      });
      setExercises(data.exercises);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadExercises();
  }, [category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExercises();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await fetchFavoritesApi();
        setFavorites(data.favorites.map((item) => item._id));
      } catch {
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  const onFavorite = async (id: string) => {
    if (!isAuthenticated) {
      setError('Please login to manage favorites.');
      return;
    }

    try {
      await toggleFavoriteApi(id);
      setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const title = useMemo(() => {
    if (category === 'upper body') return 'Upper Body Exercises';
    if (category === 'lower body') return 'Lower Body Exercises';
    return 'All Exercise Categories';
  }, [category]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">Filter by category and search by exercise name.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'upper body', 'lower body'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                category === item ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search exercises..."
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-teal-500 focus:ring"
      />

      {error ? <p className="form-error">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise._id}
            exercise={exercise}
            onFavorite={onFavorite}
            isFavorite={favorites.includes(exercise._id)}
          />
        ))}
      </div>
      {exercises.length === 0 ? <p className="text-sm text-slate-600">No exercises found for current filters.</p> : null}
    </section>
  );
};

export default CategoriesPage;
