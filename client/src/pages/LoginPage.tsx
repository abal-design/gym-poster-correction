import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type LoginFormValues, loginSchema } from '../utils/validation';

const LoginPage = () => {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError('');
    try {
      await login(values.email, values.password);
      const nextPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login');
    }
  };

  return (
    <section className="mx-auto max-w-md card-glass">
      <h1 className="text-3xl font-bold text-slate-900">Login</h1>
      <p className="mt-2 text-sm text-slate-600">Access your dashboard and posture guidance.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="form-field">
          <span>Email</span>
          <input type="email" {...register('email')} />
          {errors.email ? <em className="form-error">{errors.email.message}</em> : null}
        </label>
        <label className="form-field">
          <span>Password</span>
          <input type="password" {...register('password')} />
          {errors.password ? <em className="form-error">{errors.password.message}</em> : null}
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        No account?{' '}
        <Link to="/register" className="font-semibold text-teal-700">
          Register now
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;
