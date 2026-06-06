import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileApi } from '../api/authApi';
import { getErrorMessage } from '../api/http';
import { useAuth } from '../context/AuthContext';
import { profileSchema, type ProfileFormValues } from '../utils/validation';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setError('');
      setMessage('');
      const data = await updateProfileApi(values);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section className="mx-auto max-w-xl card-glass">
      <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
      <p className="mt-2 text-sm text-slate-600">Manage your account details.</p>
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
        {message ? <p className="text-sm font-medium text-teal-700">{message}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </section>
  );
};

export default ProfilePage;
