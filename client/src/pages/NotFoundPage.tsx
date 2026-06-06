import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="card-glass mx-auto max-w-xl text-center">
      <h1 className="text-4xl font-black text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
      <Link to="/" className="btn-primary mx-auto mt-6 inline-flex">
        Go Home
      </Link>
    </section>
  );
};

export default NotFoundPage;
