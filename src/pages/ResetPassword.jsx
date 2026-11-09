import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api, { applyServerErrors, getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import { FormError } from '../components/ui/Feedback';

const schema = z.object({
  password: z.string().min(8, 'At least 8 characters').max(72).regex(/[A-Za-z]/, 'Include a letter').regex(/[0-9]/, 'Include a number'),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const navigate = useNavigate();
  const toast = useToast();
  const [error, setError] = useState('');
  const { register, handleSubmit, setError: setFieldError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <>
        <h1 className="text-2xl font-bold">Reset link is incomplete</h1>
        <p className="mt-2 text-sm text-muted">Open the link from your email again, or request a new one.</p>
        <Link to="/forgot-password"><Button className="mt-6 w-full">Request a new link</Button></Link>
      </>
    );
  }
  const onSubmit = async ({ password }) => {
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      toast.success('Password updated. Log in with your new password.');
      navigate('/login', { replace: true });
    } catch (err) {
      if (!applyServerErrors(err, setFieldError)) setError(getErrorMessage(err));
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold">Choose a new password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <FormError>{error}</FormError>
        <Field label="New password" type="password" autoComplete="new-password" hint="8+ characters with a letter and a number." error={errors.password?.message} {...register('password')} />
        <Field label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />
        <Button type="submit" className="w-full" loading={isSubmitting}>Update password</Button>
      </form>
    </>
  );
}
