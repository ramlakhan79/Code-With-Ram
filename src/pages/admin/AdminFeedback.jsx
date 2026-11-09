import { useState } from 'react';
import { Inbox } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { timeAgo } from '../../utils/format';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const LABEL = { contact: 'Contact', feedback: 'Feedback', bug: 'Bug report' };

export default function AdminFeedback() {
  const toast = useToast();
  const [status, setStatus] = useState('open');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch('/admin/feedback', { status, type: type || undefined, page, limit: 15 });
  const flip = async (m) => { try { await api.patch(`/admin/feedback/${m._id}`, { status: m.status === 'open' ? 'resolved' : 'open' }); reload(); } catch (e) { toast.error(getErrorMessage(e)); } };
  return (
    <div>
      <h1 className="text-2xl font-bold">Feedback inbox</h1>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Status" className="flex gap-2">{[['open', 'Open'], ['resolved', 'Resolved']].map(([k, l]) => <button key={k} role="tab" aria-selected={status === k} onClick={() => { setStatus(k); setPage(1); }} className={`rounded-full border px-3 py-1 text-sm ${status === k ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{l}</button>)}</div>
        <select aria-label="Type" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="h-9 rounded-lg border border-line bg-surface px-3 text-sm"><option value="">All types</option>{Object.entries(LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </div>
      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.feedback.length === 0 ? <EmptyState icon={Inbox} title={status === 'open' ? 'Inbox zero' : 'Nothing resolved yet'} /> : (
          <ul className="space-y-3">{data.feedback.map((m) => (
            <li key={m._id} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full border border-line px-2.5 py-0.5 font-medium">{LABEL[m.type]}</span>{m.subject && <span className="font-semibold">{m.subject}</span>}<span className="ml-auto text-muted">{timeAgo(m.createdAt)}</span></div>
              <p className="mt-2 whitespace-pre-line text-sm">{m.message}</p>
              <p className="mt-2 text-xs text-muted">{m.user ? `@${m.user.username}` : m.name || 'Anonymous'}{m.email && ` · ${m.email}`}{m.pageUrl && ` · page ${m.pageUrl}`}</p>
              <div className="mt-3 flex gap-2">{m.email && <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || LABEL[m.type]}`)}`}><Button size="sm" variant="secondary">Reply by email</Button></a>}<Button size="sm" variant="ghost" onClick={() => flip(m)}>{m.status === 'open' ? 'Mark resolved' : 'Reopen'}</Button></div>
            </li>))}</ul>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="messages" onPage={setPage} />
    </div>
  );
}
