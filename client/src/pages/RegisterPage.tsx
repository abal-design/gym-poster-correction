import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type RegisterFormValues, registerSchema } from '../utils/validation';

const RegisterPage = () => {
  const [error, setError] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError('');
    try {
      await registerUser(values.name, values.email, values.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register');
    }
  };

  return (
    <section className="mx-auto max-w-md card-glass">
      <h1 className="text-3xl font-bold text-slate-900">Register</h1>
      <p className="mt-2 text-sm text-slate-600">Create your secure gym account.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="form-field">
          <span>Name</span>
          <input type="text" {...register('name')} />
          {errors.name ? <em className="form-error">{errors.name.message}</em> : null}
        </label>
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
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-teal-700">
          Login
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;
