import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';
import { fetchExerciseByIdApi } from '../api/exerciseApi';
import { getErrorMessage } from '../api/http';
import { markCompletedApi, toggleFavoriteApi } from '../api/progressApi';
import { markCompleteSchema, type MarkCompleteFormValues } from '../utils/validation';
import type { Exercise } from '../types';
import { useAuth } from '../context/AuthContext';

const ExerciseDetailsPage = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MarkCompleteFormValues>({
    resolver: zodResolver(markCompleteSchema),
    defaultValues: {
      durationMinutes: 15,
      notes: '',
    },
  });

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setError('');
        const data = await fetchExerciseByIdApi(id);
        setExercise(data.exercise);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };

    load();
  }, [id]);

  const onMarkComplete = async (values: MarkCompleteFormValues) => {
    if (!exercise) return;
    if (!isAuthenticated) {
      setError('Please login to mark workouts complete.');
      return;
    }

    try {
      await markCompletedApi({
        exerciseId: exercise._id,
        durationMinutes: values.durationMinutes,
        notes: values.notes,
      });
      setMessage('Workout logged successfully.');
      reset();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const onFavorite = async () => {
    if (!exercise) return;
    if (!isAuthenticated) {
      setError('Please login to add favorites.');
      return;
    }

    try {
      await toggleFavoriteApi(exercise._id);
      setMessage('Favorites updated.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const sortedSteps = useMemo(
    () => [...(exercise?.postureSteps || [])].sort((a, b) => a.stepNumber - b.stepNumber),
    [exercise]
  );

  if (!exercise && !error) return <p className="text-sm text-slate-700">Loading exercise details...</p>;

  return (
    <section className="space-y-6">
      {error ? <p className="form-error">{error}</p> : null}
      {exercise ? (
        <>
          <article className="card-glass">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-teal-700">{exercise.category}</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">{exercise.name}</h1>
              </div>
              <button className="btn-soft" type="button" onClick={onFavorite}>
                Toggle Favorite
              </button>
            </div>
            <p className="mt-4 text-slate-700">{exercise.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge">{exercise.difficulty}</span>
              <span className="badge">{exercise.durationMinutes} min</span>
            </div>
          </article>

          <article className="card-glass">
            <h2 className="text-2xl font-semibold text-slate-900">Step-by-step posture guidance</h2>
            <ol className="mt-4 space-y-3">
              {sortedSteps.map((step) => (
                <li key={step.stepNumber} className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-teal-700">Step {step.stepNumber}</p>
                  <p className="mt-1 text-sm text-slate-700">{step.instruction}</p>
                </li>
              ))}
            </ol>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="card-glass">
              <h3 className="text-lg font-semibold text-slate-900">Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {exercise.tips.map((tip) => (
                  <li key={tip}>- {tip}</li>
                ))}
              </ul>
            </article>
            <article className="card-glass">
              <h3 className="text-lg font-semibold text-slate-900">Common mistakes</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {exercise.commonMistakes.map((mistake) => (
                  <li key={mistake}>- {mistake}</li>
                ))}
              </ul>
            </article>
          </div>

          <article className="card-glass max-w-xl">
            <h3 className="text-xl font-semibold text-slate-900">Mark workout as completed</h3>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit(onMarkComplete)} noValidate>
              <label className="form-field">
                <span>Duration (minutes)</span>
                <input type="number" min={1} max={180} {...register('durationMinutes', { valueAsNumber: true })} />
                {errors.durationMinutes ? <em className="form-error">{errors.durationMinutes.message}</em> : null}
              </label>
              <label className="form-field">
                <span>Notes</span>
                <textarea rows={3} {...register('notes')} />
              </label>
              <button className="btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save completion'}
              </button>
            </form>
            {message ? <p className="mt-3 text-sm font-medium text-teal-700">{message}</p> : null}
          </article>
        </>
      ) : null}
    </section>
  );
};

export default ExerciseDetailsPage;
