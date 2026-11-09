import { useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import Button from './ui/Button';

export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ busy: false, msg: '', error: false });
  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, msg: '', error: false });
    try { const r = await api.post('/platform/newsletter', { email }); setState({ busy: false, msg: r.data.message, error: false }); setEmail(''); } catch (err) { setState({ busy: false, msg: err.response?.data?.errors?.[0]?.message || getErrorMessage(err), error: true }); }
  };
  return (
    <form onSubmit={submit} className={compact ? '' : 'max-w-md'} noValidate>
      <label htmlFor="nl-email" className="text-sm font-semibold">Developer newsletter</label>
      <p className="mt-1 text-xs text-muted">New courses, contests and articles. Unsubscribe any time.</p>
      <div className="mt-2 flex gap-2">
        <input id="nl-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-9 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 text-sm" />
        <Button type="submit" size="sm" loading={state.busy}>Subscribe</Button>
      </div>
      {state.msg && <p role={state.error ? 'alert' : 'status'} className={`mt-2 text-xs ${state.error ? 'text-danger' : 'text-muted'}`}>{state.msg}</p>}
    </form>
  );
}
