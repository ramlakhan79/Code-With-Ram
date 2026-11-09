import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import { FormError } from '../components/ui/Feedback';

const COOLDOWN = 30;

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get('email');
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  if (!email) return <Navigate to="/register" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit code.');
    setBusy(true);
    try {
      await verifyEmail({ email, otp });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally { setBusy(false); }
  };

  const resend = async () => {
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('If that account needs verification, a new code is on its way.');
      setCooldown(COOLDOWN);
    } catch (err) { toast.error(getErrorMessage(err)); }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Check your email</h1>
      <p className="mt-1 text-sm text-muted">We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>. It expires in 10 minutes.</p>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <FormError>{error}</FormError>
        <Field
          label="Verification code" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
          value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          className="[&_input]:text-center [&_input]:font-mono [&_input]:text-lg [&_input]:tracking-[0.4em]"
        />
        <Button type="submit" className="w-full" loading={busy}>Verify and continue</Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <button onClick={resend} disabled={cooldown > 0} className="underline disabled:no-underline disabled:opacity-60">
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
        <Link to="/register" className="text-muted underline">Use a different email</Link>
      </div>
    </>
  );
}
