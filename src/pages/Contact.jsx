import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { usePlatform } from '../context/PlatformContext';
import useSeo from '../hooks/useSeo';
import Turnstile, { turnstileEnabled } from '../components/Turnstile';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import { FormError } from '../components/ui/Feedback';

const TYPES = [['contact', 'Contact support'], ['feedback', 'Give feedback'], ['bug', 'Report a bug']];

export default function Contact() {
  const { user } = useAuth();
  const { settings } = usePlatform();
  const [params] = useSearchParams();
  useSeo({ title: 'Contact', description: 'Contact support, send feedback or report a bug.' });
  const [type, setType] = useState(TYPES.some(([k]) => k === params.get('type')) ? params.get('type') : 'contact');
  const [f, setF] = useState({ name: user?.name || '', email: user?.email || '', subject: '', message: '', pageUrl: params.get('from') || '', website: '' });
  const [token, setToken] = useState('');
  const [state, setState] = useState({ busy: false, done: false, error: '' });
  const set = (p) => setF((x) => ({ ...x, ...p }));

  const submit = async (e) => {
    e.preventDefault();
    if (turnstileEnabled && !token) return setState((s) => ({ ...s, error: 'Complete the captcha first.' }));
    setState({ busy: true, done: false, error: '' });
    try { await api.post('/platform/feedback', { ...f, type, turnstileToken: token || undefined }); setState({ busy: false, done: true, error: '' }); } catch (err) { setState({ busy: false, done: false, error: err.response?.data?.errors?.map((x) => x.message).join(' ') || getErrorMessage(err) }); }
  };

  if (state.done) return <div className="mx-auto max-w-lg py-20 text-center"><h1 className="text-3xl font-bold">Thank you</h1><p className="mt-3 text-muted">We got your message and will read it soon. {f.email && 'If we need more detail we will reply by email.'}</p></div>;
  return (
    <div className="mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <p className="mt-1 text-muted">{settings?.contactEmail ? <>You can also email <a className="underline" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.</> : 'Send us a message and we will get back to you.'}</p>
      <div role="tablist" aria-label="Message type" className="mt-6 flex flex-wrap gap-2">{TYPES.map(([k, l]) => <button key={k} role="tab" aria-selected={type === k} onClick={() => setType(k)} className={`rounded-full border px-3 py-1 text-sm ${type === k ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{l}</button>)}</div>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <FormError>{state.error}</FormError>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Your name" value={f.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" maxLength={80} /><Field label="Email (so we can reply)" type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} autoComplete="email" /></div>
        <Field label="Subject" value={f.subject} onChange={(e) => set({ subject: e.target.value })} maxLength={150} />
        {type === 'bug' && <Field label="Page where it happened" placeholder="/practice/two-sum" value={f.pageUrl} onChange={(e) => set({ pageUrl: e.target.value })} maxLength={300} />}
        <Field as="textarea" rows={7} label={type === 'bug' ? 'What happened, and what did you expect?' : 'Message'} value={f.message} onChange={(e) => set({ message: e.target.value })} maxLength={3000} hint="At least 10 characters." />
        {/* Hidden from people; bots tend to fill every field */}
        <div aria-hidden className="absolute -left-[9999px]"><label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set({ website: e.target.value })} /></label></div>
        <Turnstile onToken={setToken} />
        <Button type="submit" loading={state.busy}>Send message</Button>
      </form>
    </div>
  );
}
