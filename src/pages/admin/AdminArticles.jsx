import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Inbox } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import Button from '../../components/ui/Button';
import Pagination from '../../components/Pagination';
import StatusBadge, { STATUS_LABELS } from '../../components/StatusBadge';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const TABS = ['pending', 'published', 'changes_requested', 'rejected', 'archived', 'draft'];

export default function AdminArticles() {
  const [status, setStatus] = useState('pending');
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 350); return () => clearTimeout(t); }, [q]);
  const { data, loading, error, reload } = useFetch('/articles/admin/list', { status, q: dq || undefined, page, limit: 15 });
  const counts = data?.counts || {};

  return (
    <div>
      <h1 className="text-2xl font-bold">Articles</h1>
      <div role="tablist" aria-label="Status" className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={status === t} onClick={() => { setStatus(t); setPage(1); }}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm ${status === t ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>
            {STATUS_LABELS[t]} ({counts[t] || 0})
          </button>
        ))}
      </div>
      <div className="relative mt-3 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden />
        <input aria-label="Search by title" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm" />
      </div>

      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.articles.length === 0 ? (
          <EmptyState icon={Inbox} title={status === 'pending' ? 'The review queue is empty' : 'No articles in this list'}>{status === 'pending' ? 'New submissions will show up here, oldest first.' : 'Try another status or clear the search.'}</EmptyState>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Article</th><th className="px-4 py-2.5 font-medium">Author</th><th className="px-4 py-2.5 font-medium">Status</th><th className="px-4 py-2.5 font-medium">{status === 'pending' ? 'Submitted' : 'Updated'}</th><th className="px-4 py-2.5"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-line">
                {data.articles.map((a) => (
                  <tr key={a._id}>
                    <td className="max-w-xs px-4 py-3"><p className="truncate font-medium">{a.title}</p><p className="truncate text-xs text-muted">{a.category?.name || 'No category'}</p></td>
                    <td className="px-4 py-3">{a.author?.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(a.submittedAt || a.updatedAt)}</td>
                    <td className="px-4 py-3 text-right"><Link to={`/admin/articles/${a._id}/review`}><Button size="sm" variant={a.status === 'pending' ? 'primary' : 'secondary'}>{a.status === 'pending' ? 'Review' : 'Open'}</Button></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="articles" onPage={setPage} />
    </div>
  );
}
