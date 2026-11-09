import { useState } from 'react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Field from '../../components/ui/Field';
import { EmptyState, ErrorState, FormError, Spinner } from '../../components/ui/Feedback';

const toIso = (v) => (v ? new Date(v).toISOString() : undefined);

export default function AdminAnnouncements() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch('/admin/announcements');
  const [f, setF] = useState({ message: '', level: 'info', link: '', startsAt: '', endsAt: '', notifyUsers: false });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState(null);
  const [confirmSend, setConfirmSend] = useState(false);
  const set = (p) => setF((x) => ({ ...x, ...p }));

  const send = async () => {
    setConfirmSend(false); setErr(''); setBusy(true);
    try {
      const r = await api.post('/admin/announcements', { message: f.message, level: f.level, link: f.link, startsAt: toIso(f.startsAt), endsAt: toIso(f.endsAt), notifyUsers: f.notifyUsers });
      toast.success(f.notifyUsers ? `Published and sent to ${r.data.data.announcement.notifiedCount} people` : 'Banner published');
      setF({ message: '', level: 'info', link: '', startsAt: '', endsAt: '', notifyUsers: false }); reload();
    } catch (e) { setErr(e.response?.data?.errors?.map((x) => `${x.field}: ${x.message}`).join(' · ') || getErrorMessage(e)); } finally { setBusy(false); }
  };
  const toggle = async (a) => { try { await api.patch(`/admin/announcements/${a._id}`, { active: !a.active }); reload(); } catch (e) { toast.error(getErrorMessage(e)); } };
  const remove = async () => { const a = del; setDel(null); try { await api.delete(`/admin/announcements/${a._id}`); toast.success('Deleted'); reload(); } catch (e) { toast.error(getErrorMessage(e)); } };

  return (
    <div>
      <h1 className="text-2xl font-bold">Announcements and notifications</h1>
      <p className="mt-1 text-sm text-muted">A banner shows at the top of every page. The newest active one is shown, and visitors can dismiss it. You can also send it to everyone as a notification.</p>
      <form onSubmit={(e) => { e.preventDefault(); if (f.notifyUsers) setConfirmSend(true); else send(); }} className="mt-6 max-w-2xl space-y-4 rounded-xl border border-line bg-surface p-5" noValidate>
        <FormError>{err}</FormError>
        <Field as="textarea" rows={2} label="Message" maxLength={300} value={f.message} onChange={(e) => set({ message: e.target.value })} hint={`${f.message.length}/300`} />
        <div className="grid gap-4 sm:grid-cols-2"><Field as="select" label="Style" value={f.level} onChange={(e) => set({ level: e.target.value })}><option value="info">Information</option><option value="warning">Warning</option><option value="success">Good news</option></Field><Field label="Link (optional)" placeholder="/contests" value={f.link} onChange={(e) => set({ link: e.target.value })} /></div>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Show from (optional)" type="datetime-local" value={f.startsAt} onChange={(e) => set({ startsAt: e.target.value })} /><Field label="Hide after (optional)" type="datetime-local" value={f.endsAt} onChange={(e) => set({ endsAt: e.target.value })} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[rgb(var(--accent))]" checked={f.notifyUsers} onChange={(e) => set({ notifyUsers: e.target.checked })} /> Also send as a notification to all active users</label>
        <Button type="submit" loading={busy} disabled={f.message.trim().length < 3}>Publish</Button>
      </form>

      <h2 className="mt-10 text-lg font-semibold">History</h2>
      <div className="mt-3">
        {loading && !data ? <Spinner className="py-10" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.announcements.length === 0 ? <EmptyState title="No announcements yet" /> : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">{data.announcements.map((a) => (
            <li key={a._id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1"><p className="text-sm">{a.message}</p><p className="mt-1 text-xs text-muted">{formatDate(a.createdAt)} · {a.level}{a.endsAt && ` · until ${formatDate(a.endsAt)}`}{a.notifiedCount > 0 && ` · sent to ${a.notifiedCount}`}</p></div>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs ${a.active ? 'border-ok/50 bg-ok/10' : 'border-line text-muted'}`}>{a.active ? 'Active' : 'Off'}</span>
              <Button size="sm" variant="secondary" onClick={() => toggle(a)}>{a.active ? 'Turn off' : 'Turn on'}</Button><Button size="sm" variant="ghost" onClick={() => setDel(a)}>Delete</Button>
            </li>))}</ul>
        )}
      </div>
      <ConfirmDialog open={confirmSend} title="Notify every active user?" confirmLabel="Publish and notify" onConfirm={send} onCancel={() => setConfirmSend(false)}>Everyone gets a notification, and it cannot be recalled. The banner can still be turned off later.</ConfirmDialog>
      <ConfirmDialog open={Boolean(del)} danger title="Delete this announcement?" confirmLabel="Delete" onConfirm={remove} onCancel={() => setDel(null)}>The banner disappears. Notifications already sent stay.</ConfirmDialog>
    </div>
  );
}
