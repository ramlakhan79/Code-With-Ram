import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { timeAgo } from '../../utils/format';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const REASONS = { spam: 'Spam', abuse: 'Abuse', inappropriate: 'Inappropriate', copyright: 'Copyright', other: 'Other' };
const TYPES = [['', 'All content'], ['Discussion', 'Questions'], ['DiscussionAnswer', 'Answers'], ['DiscussionComment', 'Discussion comments'], ['Article', 'Articles'], ['ArticleComment', 'Article comments']];

export default function ModerationQueue() {
  const { can } = useAuth();
  const toast = useToast();
  const [status, setStatus] = useState('open');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null); // { kind: 'warn' | 'suspend', item }
  const [message, setMessage] = useState('');
  const { data, loading, error, reload } = useFetch('/moderation/reports', { status, type: type || undefined, page, limit: 10 });

  const resolve = async (item, action) => {
    try { await api.post('/moderation/reports/resolve', { targetType: item.targetType, targetId: item.targetId, action }); toast.success(action === 'dismiss' ? 'Reports dismissed' : action === 'hide' ? 'Content hidden' : 'Content restored'); reload(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const confirmDialog = async () => {
    const { kind, item } = dialog;
    try {
      if (kind === 'warn') { await api.post(`/moderation/users/${item.target.author._id}/warn`, { message }); toast.success('Warning sent'); }
      else { await api.patch(`/users/admin/${item.target.author._id}/status`, { status: 'suspended' }); toast.success('Account suspended'); }
      setDialog(null); setMessage(''); reload();
    } catch (e) { toast.error(e.response?.data?.errors?.[0]?.message || getErrorMessage(e)); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Reports</h1>
      <p className="mt-1 text-sm text-muted">Content that people have flagged, most-reported first. Hiding is reversible and never deletes anything.</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Status" className="flex gap-2">{[['open', 'Open'], ['handled', 'Handled']].map(([k, l]) => <button key={k} role="tab" aria-selected={status === k} onClick={() => { setStatus(k); setPage(1); }} className={`rounded-full border px-3 py-1 text-sm ${status === k ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{l}</button>)}</div>
        <select aria-label="Content type" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="h-9 rounded-lg border border-line bg-surface px-3 text-sm">{TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </div>

      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.reports.length === 0 ? <EmptyState icon={ShieldCheck} title={status === 'open' ? 'The queue is clear' : 'Nothing handled yet'}>{status === 'open' ? 'New reports will show up here.' : 'Resolved reports are listed here.'}</EmptyState> : (
          <ul className="space-y-4">
            {data.reports.map((r) => (
              <li key={`${r.targetType}-${r.targetId}`} className="rounded-xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full border border-line px-2.5 py-0.5 font-medium">{r.target?.kind || r.targetType}</span><span className="rounded-full border border-danger/50 bg-danger/10 px-2.5 py-0.5">{r.reports} {r.reports === 1 ? 'report' : 'reports'}</span>{r.reasons.map((x) => <span key={x} className="text-muted">{REASONS[x]}</span>)}{r.target?.hidden && <span className="rounded-full border border-accent/60 bg-accent/15 px-2.5 py-0.5">Hidden</span>}<span className="ml-auto text-muted">{timeAgo(r.latest)}</span></div>
                {r.target ? (
                  <div className="mt-3">
                    {r.target.title && <p className="text-sm font-semibold">{r.target.link ? <Link to={r.target.link} className="hover:underline">{r.target.title}</Link> : r.target.title}</p>}
                    <p className="mt-1 whitespace-pre-line rounded-lg bg-raised p-3 text-sm">{r.target.snippet || '(no text)'}</p>
                    <p className="mt-2 text-xs text-muted">By {r.target.author ? <Link to={`/users/${r.target.author.username}`} className="underline">{r.target.author.name}</Link> : 'a deleted user'}{r.target.authorWarnings > 0 && <span className="ml-2 font-medium text-danger">{r.target.authorWarnings} previous {r.target.authorWarnings === 1 ? 'warning' : 'warnings'}</span>}</p>
                  </div>
                ) : <p className="mt-3 text-sm text-muted">This content no longer exists.</p>}
                {r.details.length > 0 && <ul className="mt-2 list-disc pl-5 text-xs text-muted">{r.details.map((d, i) => <li key={i}>{d}</li>)}</ul>}
                {status === 'open' ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => resolve(r, 'dismiss')}>Dismiss</Button>
                    {r.target && !r.target.hidden && can('content:hide') && <Button size="sm" onClick={() => resolve(r, 'hide')}>Hide content</Button>}
                    {r.target?.author && can('user:warn') && <Button size="sm" variant="secondary" onClick={() => setDialog({ kind: 'warn', item: r })}>Warn author</Button>}
                    {r.target?.author && can('user:suspend') && <Button size="sm" variant="ghost" onClick={() => setDialog({ kind: 'suspend', item: r })}>Suspend author</Button>}
                  </div>
                ) : r.target?.hidden && ['Discussion', 'DiscussionAnswer', 'DiscussionComment'].includes(r.targetType) && can('content:hide') && <div className="mt-4"><Button size="sm" variant="secondary" onClick={() => resolve(r, 'restore')}>Restore</Button></div>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="items" onPage={setPage} />

      <ConfirmDialog open={dialog?.kind === 'warn'} title={`Warn ${dialog?.item.target?.author?.name || 'the author'}?`} confirmLabel="Send warning" onConfirm={confirmDialog} onCancel={() => { setDialog(null); setMessage(''); }}>
        <p>They get a notification with your message. Be specific and polite.</p>
        <label className="mt-3 block text-ink">Message<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={500} className="mt-1 w-full rounded-lg border border-line bg-surface p-2 text-sm" /></label>
      </ConfirmDialog>
      <ConfirmDialog open={dialog?.kind === 'suspend'} danger title={`Suspend ${dialog?.item.target?.author?.name || 'this user'}?`} confirmLabel="Suspend" onConfirm={confirmDialog} onCancel={() => setDialog(null)}>They are signed out everywhere and cannot log in until an admin reactivates the account. Consider a warning first.</ConfirmDialog>
    </div>
  );
}
