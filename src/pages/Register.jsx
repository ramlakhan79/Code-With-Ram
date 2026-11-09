import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { applyServerErrors, getErrorMessage } from '../api/client';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import { FormError } from '../components/ui/Feedback';
import Turnstile, { turnstileEnabled } from '../components/Turnstile';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your full name').max(80),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,30}$/, '3-30 characters: letters, numbers, underscore'),
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters').max(72).regex(/[A-Za-z]/, 'Include a letter').regex(/[0-9]/, 'Include a number'),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

export default function Register() {
  const { register: signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const { register, handleSubmit, setError: setFieldError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ confirm, ...values }) => {
    setError('');
    if (turnstileEnabled && !token) return setError('Complete the captcha first.');
    try {
      await signUp({ ...values, turnstileToken: token || undefined });
      navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      if (!applyServerErrors(err, setFieldError)) setError(getErrorMessage(err));
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted">Free to start. We'll email you a code to confirm your address.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <FormError>{error}</FormError>
        <Field label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Field label="Username" autoComplete="username" hint="Your public profile address." error={errors.username?.message} {...register('username')} />
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Password" type="password" autoComplete="new-password" hint="8+ characters with a letter and a number." error={errors.password?.message} {...register('password')} />
        <Field label="Confirm password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />
        <Turnstile onToken={setToken} />
        <Button type="submit" className="w-full" loading={isSubmitting}>Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">Already registered? <Link to="/login" className="font-medium text-ink underline">Log in</Link></p>
    </>
  );
}
