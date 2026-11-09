import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sun, Moon, Monitor, Laptop } from 'lucide-react';
import api, { applyServerErrors, getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import useFetch from '../hooks/useFetch';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { EmptyState, ErrorState, FormError, Spinner } from '../components/ui/Feedback';
import { downloadFile } from '../utils/download';

const THEMES = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'Match my device', icon: Monitor },
];

const passwordSchema = z.object({
  currentPassword: z.string().max(72),
  newPassword: z.string().min(8, 'At least 8 characters').max(72).regex(/[A-Za-z]/, 'Include a letter').regex(/[0-9]/, 'Include a number'),
  confirm: z.string(),
}).refine((v) => v.newPassword === v.confirm, { path: ['confirm'], message: 'Passwords do not match' });

const fmt = (d) => new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const Section = ({ title, desc, children }) => (
  <section className="border-b border-line py-8 first:pt-0">
    <h2 className="text-lg font-semibold">{title}</h2>
    {desc && <p className="mt-1 text-sm text-muted">{desc}</p>}
    <div className="mt-4">{children}</div>
  </section>
);

function PasswordForm() {
  const toast = useToast();
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(passwordSchema) });
  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await api.post('/auth/change-password', { currentPassword: currentPassword || undefined, newPassword });
      toast.success('Password changed. Other devices were signed out.');
      reset();
    } catch (err) {
      if (!applyServerErrors(err, setError)) toast.error(getErrorMessage(err));
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm space-y-4" noValidate>
      <Field label="Current password" type="password" autoComplete="current-password" hint="Leave empty if you signed up with Google and never set one." error={errors.currentPassword?.message} {...register('currentPassword')} />
      <Field label="New password" type="password" autoComplete="new-password" error={errors.newPassword?.message} {...register('newPassword')} />
      <Field label="Confirm new password" type="password" autoComplete="new-password" error={errors.confirm?.message} {...register('confirm')} />
      <Button type="submit" loading={isSubmitting}>Change password</Button>
    </form>
  );
}

function Sessions() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch('/auth/sessions');
  const revoke = async (id) => {
    try { await api.delete(`/auth/sessions/${id}`); toast.success('Device signed out'); reload(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <ul className="divide-y divide-line rounded-xl border border-line">
      {data.sessions.map((s) => (
        <li key={s._id} className="flex flex-wrap items-center gap-3 p-4">
          <Laptop className="h-5 w-5 shrink-0 text-muted" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{s.userAgent || 'Unknown device'}{s.current && <span className="ml-2 rounded bg-raised px-1.5 py-0.5 text-xs">This device</span>}</p>
            <p className="text-xs text-muted">{s.ip || 'Unknown IP'} · last active {fmt(s.lastUsedAt)}</p>
          </div>
          {!s.current && <Button variant="secondary" size="sm" onClick={() => revoke(s._id)}>Sign out</Button>}
        </li>
      ))}
    </ul>
  );
}

function LoginHistory() {
  const { data, loading, error, reload } = useFetch('/auth/login-history');
  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.history.length) return <EmptyState title="No sign-ins recorded yet" />;
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-raised text-muted"><tr><th className="px-4 py-2 font-medium">When</th><th className="px-4 py-2 font-medium">Result</th><th className="px-4 py-2 font-medium">IP</th></tr></thead>
        <tbody className="divide-y divide-line">
          {data.history.map((h) => (
            <tr key={h._id}>
              <td className="whitespace-nowrap px-4 py-2">{fmt(h.createdAt)}</td>
              <td className="px-4 py-2">{h.action === 'auth.login' ? 'Signed in' : <span className="text-danger">Failed attempt</span>}</td>
              <td className="px-4 py-2 text-muted">{h.ip || 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function YourData() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const exportData = async () => {
    setBusy(true);
    try { await downloadFile('/account/export', 'code-with-ram-data.json'); toast.success('Your data file is downloading'); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };
  const destroy = async () => {
    setError(''); setBusy(true);
    try {
      await api.delete('/account', { data: { confirm, password: password || undefined } });
      await logout();
      toast.success('Your account has been deleted');
      navigate('/');
    } catch (e) { setError(getErrorMessage(e)); setBusy(false); }
  };
  return (
    <>
      <Section title="Your data" desc="Download everything we hold about you, or delete your account for good.">
        <div className="flex flex-wrap gap-3"><Button variant="secondary" loading={busy && !open} onClick={exportData}>Download my data</Button><Button variant="danger" onClick={() => { setOpen(true); setError(''); }}>Delete my account</Button></div>
        <p className="mt-3 text-xs text-muted">Deleting removes your personal details, sessions, notifications, drafts, bookmarks and submitted code. Articles, questions and answers you published stay, shown as written by "Deleted user". See the privacy policy for details.</p>
      </Section>
      <ConfirmDialog open={open} danger loading={busy} title="Delete your account permanently?" confirmLabel="Delete forever" onConfirm={destroy} onCancel={() => { setOpen(false); setConfirm(''); setPassword(''); }}>
        <p>This cannot be undone. Type <strong className="text-ink">DELETE</strong> to confirm{user ? ' and enter your password' : ''}.</p>
        <div className="mt-3 space-y-3 text-ink"><FormError>{error}</FormError>
          <label className="block text-sm">Type DELETE<input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm" autoComplete="off" /></label>
          <label className="block text-sm">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm" autoComplete="current-password" /><span className="mt-1 block text-xs text-muted">Google-only accounts: leave empty, but sign in again within the last 15 minutes.</span></label>
        </div>
      </ConfirmDialog>
    </>
  );
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  const deactivate = async () => {
    setBusy(true);
    try {
      await api.post('/users/me/deactivate');
      await logout();
      navigate('/');
    } catch (e) { toast.error(getErrorMessage(e)); setBusy(false); setConfirm(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="mt-6">
        <Section title="Appearance" desc="Saved to your account, so it follows you across devices.">
          <div role="radiogroup" aria-label="Theme" className="grid gap-3 sm:grid-cols-3">
            {THEMES.map(({ value, label, icon: Icon }) => (
              <button
                key={value} role="radio" aria-checked={theme === value} onClick={() => setTheme(value)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm ${theme === value ? 'border-accent bg-raised font-semibold' : 'border-line hover:bg-raised'}`}
              >
                <Icon className="h-5 w-5" aria-hidden /> {label}
              </button>
            ))}
          </div>
        </Section>
        <Section title="Password"><PasswordForm /></Section>
        <Section title="Signed-in devices" desc="Sign out any device you don't recognise."><Sessions /></Section>
        <Section title="Recent sign-ins"><LoginHistory /></Section>
        <YourData />
        <Section title="Deactivate account" desc="Hides your profile and signs you out everywhere. Log in again at any time to reactivate.">
          <Button variant="danger" onClick={() => setConfirm(true)}>Deactivate account</Button>
        </Section>
      </div>
      <ConfirmDialog open={confirm} danger loading={busy} title="Deactivate your account?" confirmLabel="Deactivate" onConfirm={deactivate} onCancel={() => setConfirm(false)}>
        You'll be signed out on every device. Your content is kept, and logging in again reactivates the account.
      </ConfirmDialog>
    </div>
  );
}
