import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <section className="space-y-10">
      <div className="hero-band rounded-3xl p-8 md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Smart Gym Posture Assistant</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
          Train with correct posture, measurable progress, and focused guidance.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-slate-700 md:text-lg">
          Learn upper and lower body exercise form step-by-step, save favorites, track completions, and improve your
          consistency with a secure full-stack platform.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/categories" className="btn-primary">
            Browse Exercises
          </Link>
          <Link to="/dashboard" className="btn-soft">
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="card-glass">
          <h2 className="text-xl font-semibold text-slate-900">Upper & Lower Body</h2>
          <p className="mt-2 text-sm text-slate-600">Find structured posture guides in both core training categories.</p>
        </article>
        <article className="card-glass">
          <h2 className="text-xl font-semibold text-slate-900">Progress Analytics</h2>
          <p className="mt-2 text-sm text-slate-600">Track completed workouts, total minutes, and category distribution.</p>
        </article>
        <article className="card-glass">
          <h2 className="text-xl font-semibold text-slate-900">Role-Based Admin</h2>
          <p className="mt-2 text-sm text-slate-600">Admins can manage exercise data with secure CRUD operations.</p>
        </article>
      </div>
    </section>
  );
};

export default HomePage;
