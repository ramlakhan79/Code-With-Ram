import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { StateBadge, TYPE_LABELS, fmtRange } from '../../components/ContestBadges';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

export default function AdminContests() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch('/contests/admin/list', { status: status || undefined, page, limit: 20 });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-2xl font-bold">Contests</h1><Link to="/admin/contests/new"><Button><Plus className="h-4 w-4" aria-hidden /> New contest</Button></Link></div>
      <div role="tablist" aria-label="Status" className="mt-5 flex gap-2">{[['', 'All'], ['draft', 'Draft'], ['published', 'Published']].map(([k, l]) => <button key={k || 'all'} role="tab" aria-selected={status === k} onClick={() => { setStatus(k); setPage(1); }} className={`rounded-full border px-3 py-1 text-sm ${status === k ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{l}</button>)}</div>
      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.contests.length === 0 ? <EmptyState title="No contests">Create one to get started.</EmptyState> : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Contest</th><th className="px-4 py-2.5 font-medium">When</th><th className="px-4 py-2.5 font-medium">State</th><th className="px-4 py-2.5 font-medium">Registered</th><th className="px-4 py-2.5"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-line">{data.contests.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3"><p className="font-medium">{c.title}</p><p className="text-xs text-muted">{TYPE_LABELS[c.type]} · {c.problemCount} problems{c.status === 'draft' && ' · draft'}{c.resultsPublishedAt && ' · results published'}</p></td>
                  <td className="px-4 py-3 text-muted">{fmtRange(c.startTime, c.endTime)}</td>
                  <td className="px-4 py-3"><StateBadge state={c.state} /></td><td className="px-4 py-3">{c.participantCount}</td>
                  <td className="px-4 py-3 text-right"><Link to={`/admin/contests/${c._id}`}><Button size="sm" variant="secondary">Manage</Button></Link></td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="contests" onPage={setPage} />
    </div>
  );
}
