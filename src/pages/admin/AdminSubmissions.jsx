import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import { VerdictBadge, VERDICT_LABELS } from '../../components/Verdict';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const LANGS = { java: 'Java', cpp: 'C++', c: 'C', python: 'Python', javascript: 'JavaScript' };
const select = 'h-10 rounded-lg border border-line bg-surface px-3 text-sm';

export default function AdminSubmissions() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [verdict, setVerdict] = useState('');
  const [language, setLanguage] = useState('');
  const [user, setUser] = useState('');
  const [problem, setProblem] = useState('');
  const [d, setD] = useState({ user: '', problem: '' });
  const [view, setView] = useState(null);
  useEffect(() => { const t = setTimeout(() => { setD({ user, problem }); setPage(1); }, 400); return () => clearTimeout(t); }, [user, problem]);
  const { data, loading, error, reload } = useFetch('/practice/admin/submissions', { page, limit: 20, verdict: verdict || undefined, language: language || undefined, user: d.user || undefined, problem: d.problem || undefined });
  const open = async (id) => { try { setView((await api.get(`/practice/admin/submissions/${id}`)).data.data.submission); } catch (e) { toast.error(getErrorMessage(e)); } };

  return (
    <div>
      <h1 className="text-2xl font-bold">Submissions</h1>
      <div className="mt-5 flex flex-wrap gap-3">
        <select aria-label="Result" className={select} value={verdict} onChange={(e) => { setVerdict(e.target.value); setPage(1); }}><option value="">Any result</option>{Object.entries(VERDICT_LABELS).filter(([k]) => k !== 'ok').map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select aria-label="Language" className={select} value={language} onChange={(e) => { setLanguage(e.target.value); setPage(1); }}><option value="">Any language</option>{Object.entries(LANGS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <input aria-label="Username" placeholder="Username" value={user} onChange={(e) => setUser(e.target.value)} className={`${select} w-40`} />
        <input aria-label="Problem slug" placeholder="Problem slug" value={problem} onChange={(e) => setProblem(e.target.value)} className={`${select} w-48`} />
      </div>
      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.submissions.length === 0 ? <EmptyState title="No submissions match">Change the filters to see more.</EmptyState> : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">User</th><th className="px-4 py-2.5 font-medium">Problem</th><th className="px-4 py-2.5 font-medium">Result</th><th className="px-4 py-2.5 font-medium">Tests</th><th className="px-4 py-2.5 font-medium">Language</th><th className="px-4 py-2.5 font-medium">When</th><th className="px-4 py-2.5"><span className="sr-only">Code</span></th></tr></thead>
              <tbody className="divide-y divide-line">{data.submissions.map((s) => <tr key={s._id}><td className="px-4 py-3">@{s.user?.username}</td><td className="px-4 py-3"><Link to={`/practice/${s.problem?.slug}`} className="hover:underline">{s.problem?.title}</Link></td><td className="px-4 py-3"><VerdictBadge verdict={s.verdict} /></td><td className="px-4 py-3 text-muted">{s.passed}/{s.total}</td><td className="px-4 py-3">{LANGS[s.language]}</td><td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(s.createdAt)}</td><td className="px-4 py-3 text-right"><Button size="sm" variant="secondary" onClick={() => open(s._id)}>Code</Button></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="submissions" onPage={setPage} />
      <ConfirmDialog open={Boolean(view)} title={view ? `@${view.user?.username}: ${view.problem?.title}` : ''} confirmLabel="Close" onConfirm={() => setView(null)} onCancel={() => setView(null)}>
        <pre className="mt-2 max-h-[50vh] overflow-auto rounded-lg border border-line bg-raised p-3 font-mono text-xs text-ink">{view?.code}</pre>
        {view?.message && <pre className="mt-2 max-h-32 overflow-auto rounded-lg border border-line bg-raised p-3 font-mono text-xs text-ink">{view.message}</pre>}
      </ConfirmDialog>
    </div>
  );
}
