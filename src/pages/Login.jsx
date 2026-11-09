import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { applyServerErrors, getErrorMessage } from '../api/client';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import { FormError } from '../components/ui/Feedback';
import GoogleButton from '../components/GoogleButton';
import Turnstile, { turnstileEnabled } from '../components/Turnstile';

const schema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email'),
  password: z.string().min(1, 'Enter your password'),
  remember: z.boolean().optional(),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const { register, handleSubmit, watch, setError: setFieldError, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema), defaultValues: { remember: false } });
  const dest = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (values) => {
    setError('');
    if (turnstileEnabled && !token) return setError('Complete the captcha first.');
    try {
      await login({ ...values, turnstileToken: token || undefined });
      navigate(dest, { replace: true });
    } catch (err) {
      if (err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        return navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }
      if (!applyServerErrors(err, setFieldError)) setError(getErrorMessage(err));
    }
  };
  const onGoogle = useCallback(() => navigate(dest, { replace: true }), [navigate, dest]);

  return (
    <>
      <h1 className="text-2xl font-bold">Log in</h1>
      <p className="mt-1 text-sm text-muted">Welcome back. Pick up where you left off.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <FormError>{error}</FormError>
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" {...register('remember')} className="h-4 w-4 accent-[rgb(var(--accent))]" /> Keep me signed in</label>
          <Link to="/forgot-password" className="underline">Forgot password?</Link>
        </div>
        <Turnstile onToken={setToken} />
        <Button type="submit" className="w-full" loading={isSubmitting}>Log in</Button>
      </form>
      <div className="mt-4"><GoogleButton onSuccess={onGoogle} onError={setError} remember={watch('remember')} /></div>
      <p className="mt-6 text-center text-sm text-muted">New here? <Link to="/register" className="font-medium text-ink underline">Create an account</Link></p>
    </>
  );
}
