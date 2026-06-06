import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createExerciseApi, deleteExerciseApi, fetchExercisesApi, updateExerciseApi } from '../api/exerciseApi';
import { getErrorMessage } from '../api/http';
import type { Exercise } from '../types';
import { exerciseSchema, type ExerciseFormValues } from '../utils/validation';

const toFormDefaults = (exercise?: Exercise): ExerciseFormValues => ({
  name: exercise?.name || '',
  category: exercise?.category || 'upper body',
  difficulty: exercise?.difficulty || 'beginner',
  targetMuscles: exercise?.targetMuscles.join(', ') || '',
  equipment: exercise?.equipment.join(', ') || '',
  description: exercise?.description || '',
  postureStepsText:
    exercise?.postureSteps
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .map((step) => step.instruction)
      .join('\n') || '',
  tipsText: exercise?.tips.join('\n') || '',
  mistakesText: exercise?.commonMistakes.join('\n') || '',
  imageUrl: exercise?.imageUrl || '',
  durationMinutes: exercise?.durationMinutes || 15,
});

const parseCsv = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const parseLines = (value?: string) =>
  (value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const AdminPage = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: toFormDefaults(),
  });

  const loadExercises = async () => {
    try {
      setError('');
      const data = await fetchExercisesApi();
      setExercises(data.exercises);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const clearEditor = () => {
    setEditingExerciseId(null);
    reset(toFormDefaults());
  };

  const onEdit = (exercise: Exercise) => {
    setEditingExerciseId(exercise._id);
    reset(toFormDefaults(exercise));
  };

  const onDelete = async (exerciseId: string) => {
    try {
      setError('');
      await deleteExerciseApi(exerciseId);
      setMessage('Exercise deleted.');
      if (editingExerciseId === exerciseId) clearEditor();
      await loadExercises();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const submitLabel = useMemo(() => (editingExerciseId ? 'Update Exercise' : 'Create Exercise'), [editingExerciseId]);

  const onSubmit = async (values: ExerciseFormValues) => {
    try {
      setError('');
      setMessage('');

      const payload = {
        name: values.name,
        category: values.category,
        difficulty: values.difficulty,
        targetMuscles: parseCsv(values.targetMuscles),
        equipment: parseCsv(values.equipment),
        description: values.description,
        postureSteps: parseLines(values.postureStepsText).map((instruction, idx) => ({
          stepNumber: idx + 1,
          instruction,
        })),
        tips: parseLines(values.tipsText),
        commonMistakes: parseLines(values.mistakesText),
        imageUrl: values.imageUrl,
        durationMinutes: values.durationMinutes,
      };

      if (editingExerciseId) {
        await updateExerciseApi(editingExerciseId, payload);
        setMessage('Exercise updated successfully.');
      } else {
        await createExerciseApi(payload);
        setMessage('Exercise created successfully.');
      }

      clearEditor();
      await loadExercises();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Admin Exercise Management</h1>

      <article className="card-glass">
        <h2 className="text-lg font-semibold text-slate-900">{submitLabel}</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="form-field">
            <span>Name</span>
            <input type="text" {...register('name')} />
            {errors.name ? <em className="form-error">{errors.name.message}</em> : null}
          </label>

          <label className="form-field">
            <span>Category</span>
            <select {...register('category')}>
              <option value="upper body">Upper Body</option>
              <option value="lower body">Lower Body</option>
            </select>
            {errors.category ? <em className="form-error">{errors.category.message}</em> : null}
          </label>

          <label className="form-field">
            <span>Difficulty</span>
            <select {...register('difficulty')}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.difficulty ? <em className="form-error">{errors.difficulty.message}</em> : null}
          </label>

          <label className="form-field">
            <span>Duration (min)</span>
            <input type="number" min={1} max={180} {...register('durationMinutes', { valueAsNumber: true })} />
            {errors.durationMinutes ? <em className="form-error">{errors.durationMinutes.message}</em> : null}
          </label>

          <label className="form-field md:col-span-2">
            <span>Target muscles (comma separated)</span>
            <input type="text" {...register('targetMuscles')} />
            {errors.targetMuscles ? <em className="form-error">{errors.targetMuscles.message}</em> : null}
          </label>

          <label className="form-field md:col-span-2">
            <span>Equipment (comma separated)</span>
            <input type="text" {...register('equipment')} />
            {errors.equipment ? <em className="form-error">{errors.equipment.message}</em> : null}
          </label>

          <label className="form-field md:col-span-2">
            <span>Description</span>
            <textarea rows={4} {...register('description')} />
            {errors.description ? <em className="form-error">{errors.description.message}</em> : null}
          </label>

          <label className="form-field md:col-span-2">
            <span>Posture steps (one per line)</span>
            <textarea rows={5} {...register('postureStepsText')} />
            {errors.postureStepsText ? <em className="form-error">{errors.postureStepsText.message}</em> : null}
          </label>

          <label className="form-field">
            <span>Tips (one per line)</span>
            <textarea rows={4} {...register('tipsText')} />
          </label>

          <label className="form-field">
            <span>Common mistakes (one per line)</span>
            <textarea rows={4} {...register('mistakesText')} />
          </label>

          <label className="form-field md:col-span-2">
            <span>Image URL (optional)</span>
            <input type="url" {...register('imageUrl')} />
            {errors.imageUrl ? <em className="form-error">{errors.imageUrl.message}</em> : null}
          </label>

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <button className="btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
            {editingExerciseId ? (
              <button type="button" className="btn-soft" onClick={clearEditor}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
        {message ? <p className="mt-3 text-sm font-medium text-teal-700">{message}</p> : null}
        {error ? <p className="mt-3 form-error">{error}</p> : null}
      </article>

      <article className="card-glass">
        <h2 className="text-lg font-semibold text-slate-900">Current Exercises</h2>
        <div className="mt-4 space-y-3">
          {exercises.map((exercise) => (
            <div key={exercise._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div>
                <p className="font-semibold text-slate-900">{exercise.name}</p>
                <p className="text-xs text-slate-600">
                  {exercise.category} | {exercise.difficulty}
                </p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-soft" onClick={() => onEdit(exercise)}>
                  Edit
                </button>
                <button type="button" className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => onDelete(exercise._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {exercises.length === 0 ? <p className="text-sm text-slate-600">No exercises available.</p> : null}
        </div>
      </article>
    </section>
  );
};

export default AdminPage;
