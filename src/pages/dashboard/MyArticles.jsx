import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenLine, FileText } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/Pagination';
import StatusBadge, { STATUS_LABELS } from '../../components/StatusBadge';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const TABS = ['', 'draft', 'pending', 'changes_requested', 'published', 'rejected', 'archived'];

export default function MyArticles() {
  const toast = useToast();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const { data, loading, error, reload } = useFetch('/articles/mine', { status: status || undefined, page, limit: 10 });
  const { data: pub, reload: reloadPub } = useFetch('/articles/mine', { status: 'published', limit: 30 });

  const act = async (id, action, success) => {
    try { await api.post(`/articles/manage/${id}/${action}`); toast.success(success); reload(); reloadPub(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const doDelete = async () => {
    setBusy(true);
    try { await api.delete(`/articles/manage/${confirm.id}`); toast.success('Article deleted'); setConfirm(null); reload(); reloadPub(); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };

  const counts = data?.counts || {};
  const totals = pub?.totals;
  const chart = (pub?.articles || []).slice().sort((a, b) => b.viewCount - a.viewCount).slice(0, 8).map((a) => ({ name: a.title.length > 22 ? `${a.title.slice(0, 22)}…` : a.title, Views: a.viewCount, Likes: a.likeCount }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My articles</h1>
        <Link to="/dashboard/articles/create"><Button><PenLine className="h-4 w-4" aria-hidden /> Write an article</Button></Link>
      </div>

      {totals && (
        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[['Views', totals.views], ['Likes', totals.likes], ['Comments', totals.comments], ['Bookmarks', totals.bookmarks]].map(([l, v]) => (
            <div key={l} className="rounded-xl border border-line bg-surface p-4"><dt className="text-sm text-muted">{l}</dt><dd className="mt-1 font-display text-2xl font-bold">{v}</dd></div>
          ))}
        </dl>
      )}
      {chart.length > 0 && (
        <section aria-labelledby="chart-h" className="mt-6 rounded-xl border border-line bg-surface p-4">
          <h2 id="chart-h" className="text-sm font-semibold">Top published articles</h2>
          <div className="mt-3 h-56" role="img" aria-label={`Bar chart of views and likes for your top ${chart.length} articles`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} margin={{ left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} interval={0} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} />
                <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', borderRadius: 8 }} />
                <Bar dataKey="Views" fill="rgb(var(--accent))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Likes" fill="rgb(var(--focus))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <div role="tablist" aria-label="Filter by status" className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button key={t || 'all'} role="tab" aria-selected={status === t} onClick={() => { setStatus(t); setPage(1); }}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm ${status === t ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>
            {t ? STATUS_LABELS[t] : 'All'}{t && counts[t] ? ` (${counts[t]})` : ''}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.articles.length === 0 ? (
          <EmptyState icon={FileText} title="Nothing here yet" action={<Link to="/dashboard/articles/create"><Button>Write your first article</Button></Link>}>
            Drafts, submissions and published articles will show up in this list.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {data.articles.map((a) => (
              <li key={a._id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{a.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted"><StatusBadge status={a.status} /> <span>Updated {formatDate(a.updatedAt)}</span>{a.status === 'published' && <span>{a.viewCount} views · {a.likeCount} likes · {a.commentCount} comments</span>}</p>
                    {['changes_requested', 'rejected'].includes(a.status) && a.reviewNote && <p className="mt-2 rounded-lg bg-raised p-3 text-sm"><span className="font-medium">Reviewer note:</span> {a.reviewNote}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {a.status === 'published' && <Link to={`/articles/${a.slug}`}><Button size="sm" variant="secondary">View</Button></Link>}
                    {['draft', 'changes_requested', 'rejected', 'published'].includes(a.status) && <Button size="sm" variant="secondary" onClick={() => navigate(`/dashboard/articles/edit/${a._id}`)}>Edit</Button>}
                    {a.status === 'pending' && <Button size="sm" variant="secondary" onClick={() => act(a._id, 'withdraw', 'Moved back to drafts')}>Withdraw</Button>}
                    {a.status === 'published' && <Button size="sm" variant="secondary" onClick={() => act(a._id, 'archive', 'Article archived')}>Archive</Button>}
                    {a.status === 'archived' && <Button size="sm" variant="secondary" onClick={() => act(a._id, 'unarchive', 'Moved back to drafts')}>Restore</Button>}
                    {['draft', 'changes_requested', 'rejected', 'archived'].includes(a.status) && <Button size="sm" variant="ghost" onClick={() => setConfirm(a)}>Delete</Button>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="articles" onPage={setPage} />
      <ConfirmDialog open={Boolean(confirm)} danger loading={busy} title="Delete this article?" confirmLabel="Delete" onConfirm={doDelete} onCancel={() => setConfirm(null)}>
        “{confirm?.title}” and its revision history will be permanently removed.
      </ConfirmDialog>
    </div>
  );
}
