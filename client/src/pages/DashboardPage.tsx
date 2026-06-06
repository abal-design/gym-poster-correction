import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchFavoritesApi, fetchMyProgressApi } from '../api/progressApi';
import { getErrorMessage } from '../api/http';
import type { Exercise, ProgressEntry, ProgressSummary } from '../types';

const DashboardPage = () => {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [favorites, setFavorites] = useState<Exercise[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError('');
        const [progressData, favoritesData] = await Promise.all([fetchMyProgressApi(), fetchFavoritesApi()]);
        setSummary(progressData.summary);
        setProgressEntries(progressData.progressEntries);
        setFavorites(favoritesData.favorites);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    };

    load();
  }, []);

  const categoryChartData = useMemo(
    () => [
      { name: 'Upper Body', value: summary?.categorySummary['upper body'] || 0 },
      { name: 'Lower Body', value: summary?.categorySummary['lower body'] || 0 },
    ],
    [summary]
  );

  if (error) return <p className="form-error">{error}</p>;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Progress Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="card-glass">
          <p className="text-sm text-slate-600">Completed Workouts</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{summary?.totalCompleted || 0}</p>
        </article>
        <article className="card-glass">
          <p className="text-sm text-slate-600">Total Training Minutes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{summary?.totalMinutes || 0}</p>
        </article>
        <article className="card-glass">
          <p className="text-sm text-slate-600">Favorite Exercises</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{favorites.length}</p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="card-glass h-70">
          <h2 className="text-lg font-semibold text-slate-900">Completion by Category</h2>
          <div className="h-55">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChartData} dataKey="value" cx="50%" cy="50%" outerRadius={75} fill="#0d9488" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card-glass h-70">
          <h2 className="text-lg font-semibold text-slate-900">Weekly Snapshot</h2>
          <div className="h-55">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <article className="card-glass">
        <h2 className="text-lg font-semibold text-slate-900">Recent Completed Workouts</h2>
        <div className="mt-3 space-y-3">
          {progressEntries.slice(0, 8).map((entry) => (
            <div key={entry._id} className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-sm font-semibold text-slate-900">{entry.exercise.name}</p>
              <p className="text-xs text-slate-600">
                {entry.exercise.category} | {entry.durationMinutes} minutes | {new Date(entry.completedAt).toLocaleDateString()}
              </p>
              {entry.notes ? <p className="mt-1 text-xs text-slate-700">{entry.notes}</p> : null}
            </div>
          ))}
          {progressEntries.length === 0 ? <p className="text-sm text-slate-600">No workouts logged yet.</p> : null}
        </div>
      </article>
    </section>
  );
};

export default DashboardPage;
