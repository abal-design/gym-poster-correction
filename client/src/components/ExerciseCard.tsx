import { Link } from 'react-router-dom';
import type { Exercise } from '../types';

type ExerciseCardProps = {
  exercise: Exercise;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
};

const ExerciseCard = ({ exercise, onFavorite, isFavorite = false }: ExerciseCardProps) => {
  return (
    <article className="card-glass overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-teal-700">{exercise.category}</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">{exercise.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{exercise.description.slice(0, 110)}...</p>
        </div>
        {onFavorite ? (
          <button
            type="button"
            onClick={() => onFavorite(exercise._id)}
            className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
          >
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="badge">{exercise.difficulty}</span>
        <span className="badge">{exercise.durationMinutes} min</span>
      </div>
      <div className="mt-6">
        <Link className="btn-primary" to={`/exercises/${exercise._id}`}>
          Open posture guide
        </Link>
      </div>
    </article>
  );
};

export default ExerciseCard;
