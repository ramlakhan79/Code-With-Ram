import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api, { getErrorMessage } from '../api/client';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import { FormError } from '../components/ui/Feedback';
import Turnstile, { turnstileEnabled } from '../components/Turnstile';

const schema = z.object({ email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email') });

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setError('');
    if (turnstileEnabled && !token) return setError('Complete the captcha first.');
    try {
      await api.post('/auth/forgot-password', { ...values, turnstileToken: token || undefined });
      setSent(true);
    } catch (err) { setError(getErrorMessage(err)); }
  };

  if (sent) {
    return (
      <>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-2 text-sm text-muted">If that address has an account, we sent a reset link. It works for 30 minutes.</p>
        <Link to="/login"><Button variant="secondary" className="mt-6 w-full">Back to log in</Button></Link>
      </>
    );
  }
  return (
    <>
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="mt-1 text-sm text-muted">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <FormError>{error}</FormError>
        <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Turnstile onToken={setToken} />
        <Button type="submit" className="w-full" loading={isSubmitting}>Send reset link</Button>
      </form>
      <p className="mt-6 text-center text-sm"><Link to="/login" className="text-muted underline">Back to log in</Link></p>
    </>
  );
}
