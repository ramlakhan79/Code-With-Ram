import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, CheckCircle2, XCircle } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import { DifficultyBadge } from '../../components/Verdict';
import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const TABS = ['', 'suggested', 'draft', 'published', 'archived'];
const LABEL = { '': 'All', suggested: 'Suggested', draft: 'Draft', published: 'Published', archived: 'Archived' };

function JudgePanel() {
  const { data, loading, error, reload } = useFetch('/practice/admin/judge-status');
  return (
    <section aria-labelledby="judge-h" className="mb-6 rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="judge-h" className="text-sm font-semibold">Code execution (Judge0)</h2><Button size="sm" variant="ghost" onClick={reload}>Check again</Button></div>
      {loading && !data ? <Spinner className="py-2" /> : error ? <p className="mt-2 text-sm text-danger">{error}</p> : !data.configured ? (
        <p className="mt-2 text-sm">Not configured. Set <code className="font-mono">JUDGE0_URL</code> on the server (see <code className="font-mono">judge0/README.md</code>). Until then learners see a clear "unavailable" message on Run and Submit.</p>
      ) : !data.reachable ? <p className="mt-2 text-sm text-danger">Configured but unreachable: {data.message}</p> : (
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">{data.languages.map((l) => <li key={l.id} className="flex items-center gap-2">{l.available ? <CheckCircle2 className="h-4 w-4 text-ok" aria-label="Available" /> : <XCircle className="h-4 w-4 text-danger" aria-label="Missing" />}<span>{l.name}</span><span className="text-xs text-muted">{l.available ? l.judge0Name : `id ${l.judge0Id} not found. Set JUDGE0_LANG_IDS.`}</span></li>)}</ul>
      )}
    </section>
  );
}

export default function AdminProblems() {
  const toast = useToast();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [page, setPage] = useState(1);
  const [del, setDel] = useState(null);
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 350); return () => clearTimeout(t); }, [q]);
  const { data, loading, error, reload } = useFetch('/practice/admin/problems', { status: status || undefined, q: dq || undefined, page, limit: 20 });
  const counts = data?.counts || {};
  const remove = async () => { const p = del; setDel(null); try { await api.delete(`/practice/admin/problems/${p._id}`); toast.success('Problem deleted'); reload(); } catch (e) { toast.error(getErrorMessage(e)); } };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">Problems</h1><Link to="/admin/problems/new"><Button><Plus className="h-4 w-4" aria-hidden /> New problem</Button></Link></div>
      <div className="mt-6"><JudgePanel /></div>
      <div role="tablist" aria-label="Status" className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((t) => <button key={t || 'all'} role="tab" aria-selected={status === t} onClick={() => { setStatus(t); setPage(1); }} className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm ${status === t ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{LABEL[t]}{t && ` (${counts[t] || 0})`}</button>)}
      </div>
      <div className="relative mt-3 max-w-sm"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden /><input aria-label="Search by title" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm" /></div>
      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.problems.length === 0 ? <EmptyState title="No problems here">Create one, or wait for contributor suggestions.</EmptyState> : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Problem</th><th className="px-4 py-2.5 font-medium">Difficulty</th><th className="px-4 py-2.5 font-medium">Status</th><th className="px-4 py-2.5 font-medium">Submissions</th><th className="px-4 py-2.5 font-medium">Updated</th><th className="px-4 py-2.5"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-line">{data.problems.map((p) => (
                <tr key={p._id}>
                  <td className="max-w-xs px-4 py-3"><p className="truncate font-medium">{p.title}</p>{p.suggestedBy && <p className="text-xs text-muted">Suggested by {p.suggestedBy.name}</p>}</td>
                  <td className="px-4 py-3"><DifficultyBadge difficulty={p.difficulty} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.status === 'suggested' ? 'pending' : p.status} /></td>
                  <td className="px-4 py-3 text-muted">{p.submissionCount} ({p.acceptedCount} ok)</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(p.updatedAt)}</td>
                  <td className="px-4 py-3"><div className="flex justify-end gap-2"><Link to={`/admin/problems/${p._id}`}><Button size="sm" variant="secondary">Edit</Button></Link>{p.status === 'published' && <Link to={`/practice/${p.slug}`}><Button size="sm" variant="ghost">View</Button></Link>}{p.status !== 'published' && <Button size="sm" variant="ghost" onClick={() => setDel(p)}>Delete</Button>}</div></td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="problems" onPage={setPage} />
      <ConfirmDialog open={Boolean(del)} danger title="Delete this problem?" confirmLabel="Delete" onConfirm={remove} onCancel={() => setDel(null)}>“{del?.title}”, its test cases and any submissions will be permanently removed.</ConfirmDialog>
    </div>
  );
}
