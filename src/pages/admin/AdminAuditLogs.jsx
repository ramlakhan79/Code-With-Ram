import { useState } from 'react';
import { Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { downloadFile } from '../../utils/download';
import { getErrorMessage } from '../../api/client';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const input = 'h-9 rounded-lg border border-line bg-surface px-3 text-sm';

export default function AdminAuditLogs() {
  const toast = useToast();
  const [f, setF] = useState({ action: '', actor: '', from: '', to: '' });
  const [applied, setApplied] = useState(f);
  const [page, setPage] = useState(1);
  const { data: acts } = useFetch('/admin/audit-logs/actions');
  const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v).map(([k, v]) => [k, k === 'to' ? new Date(`${v}T23:59:59`).toISOString() : k === 'from' ? new Date(`${v}T00:00:00`).toISOString() : v]));
  const { data, loading, error, reload } = useFetch('/admin/audit-logs', { ...clean(applied), page, limit: 25 });
  const apply = (e) => { e.preventDefault(); setApplied(f); setPage(1); };
  const exportCsv = async () => { try { await downloadFile('/admin/audit-logs/export', 'audit-log.csv', clean(applied)); } catch (e) { toast.error(getErrorMessage(e)); } };

  return (
    <div>
      <h1 className="text-2xl font-bold">Audit logs</h1>
      <p className="mt-1 text-sm text-muted">Who did what and when: sign-ins, role changes, moderation, publishing and settings. Entries cannot be edited.</p>
      <form onSubmit={apply} className="mt-5 flex flex-wrap items-end gap-3">
        <label className="text-sm">Action<br /><input list="acts" className={`${input} w-52`} value={f.action} onChange={(e) => setF({ ...f, action: e.target.value })} placeholder="for example auth. or user." /><datalist id="acts">{acts?.actions.map((a) => <option key={a} value={a} />)}</datalist></label>
        <label className="text-sm">Person<br /><input className={`${input} w-40`} value={f.actor} onChange={(e) => setF({ ...f, actor: e.target.value })} placeholder="username" /></label>
        <label className="text-sm">From<br /><input type="date" className={input} value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></label>
        <label className="text-sm">To<br /><input type="date" className={input} value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></label>
        <Button type="submit" variant="secondary">Filter</Button>
        <Button type="button" variant="ghost" onClick={exportCsv}><Download className="h-4 w-4" aria-hidden /> Export CSV</Button>
      </form>
      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.logs.length === 0 ? <EmptyState title="No entries match">Try a wider date range or a shorter action prefix.</EmptyState> : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">When</th><th className="px-4 py-2.5 font-medium">Person</th><th className="px-4 py-2.5 font-medium">Action</th><th className="px-4 py-2.5 font-medium">Target</th><th className="px-4 py-2.5 font-medium">IP</th><th className="px-4 py-2.5 font-medium">Details</th></tr></thead>
              <tbody className="divide-y divide-line">{data.logs.map((l) => (
                <tr key={l._id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(l.createdAt).toLocaleString()}</td><td className="px-4 py-3">{l.actor ? `@${l.actor.username}` : '—'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.action}</td><td className="px-4 py-3 text-xs text-muted">{l.targetType}{l.targetId && <><br />{l.targetId}</>}</td><td className="px-4 py-3 text-xs text-muted">{l.ip}</td>
                  <td className="max-w-xs px-4 py-3 text-xs text-muted">{l.meta ? <code className="break-all">{JSON.stringify(l.meta).slice(0, 200)}</code> : ''}</td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="entries" onPage={setPage} />
    </div>
  );
}
