import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate, timeAgo } from '../../utils/format';
import Heatmap from '../../components/Heatmap';
import Pagination from '../../components/Pagination';
import { VerdictBadge, VERDICT_LABELS, DifficultyBadge } from '../../components/Verdict';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
const LANGS = { java: 'Java', cpp: 'C++', c: 'C', python: 'Python', javascript: 'JavaScript' };
const select = 'h-10 rounded-lg border border-line bg-surface px-3 text-sm';
const Bar = ({ value, total, label }) => <div className="h-2 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={total || 1} aria-label={label}><div className="h-full bg-accent" style={{ width: `${total ? (value / total) * 100 : 0}%` }} /></div>;

function Overview() {
  const { data, loading, error, reload } = useFetch('/practice/stats/me', { tz: TZ });
  if (loading && !data) return <Spinner className="py-16" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const s = data;
  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[['Problems solved', s.solved], ['Accuracy', `${s.accuracy}%`], ['Current streak', `${s.streak.current} d`], ['Longest streak', `${s.streak.max} d`], ['Submissions', s.submissions]].map(([l, v]) => <div key={l} className="rounded-xl border border-line bg-surface p-4"><dt className="text-sm text-muted">{l}</dt><dd className="mt-1 font-display text-2xl font-bold">{v}</dd></div>)}
      </dl>
      <section aria-labelledby="act-h" className="rounded-xl border border-line bg-surface p-4"><h2 id="act-h" className="mb-3 text-sm font-semibold">Activity</h2><Heatmap data={s.heatmap} timezone={s.timezone} /></section>
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="diff-h" className="rounded-xl border border-line bg-surface p-4">
          <h2 id="diff-h" className="text-sm font-semibold">By difficulty</h2>
          <ul className="mt-3 space-y-3">{['easy', 'medium', 'hard'].map((d) => <li key={d}><div className="mb-1 flex justify-between text-sm"><DifficultyBadge difficulty={d} /><span className="text-muted">{s.byDifficulty[d].solved} / {s.byDifficulty[d].total}</span></div><Bar value={s.byDifficulty[d].solved} total={s.byDifficulty[d].total} label={`${d} problems solved`} /></li>)}</ul>
        </section>
        <section aria-labelledby="lang-h" className="rounded-xl border border-line bg-surface p-4">
          <h2 id="lang-h" className="text-sm font-semibold">By language</h2>
          {s.languages.length === 0 ? <p className="mt-3 text-sm text-muted">Submit a solution to see language statistics.</p> : (
            <table className="mt-3 w-full text-sm"><thead className="text-left text-muted"><tr><th className="py-1 font-medium">Language</th><th className="py-1 font-medium">Submissions</th><th className="py-1 font-medium">Accepted</th></tr></thead><tbody>{s.languages.map((l) => <tr key={l.language} className="border-t border-line"><td className="py-2">{LANGS[l.language] || l.language}</td><td>{l.submissions}</td><td>{l.accepted}</td></tr>)}</tbody></table>
          )}
        </section>
      </div>
      <section aria-labelledby="topic-h" className="rounded-xl border border-line bg-surface p-4">
        <h2 id="topic-h" className="text-sm font-semibold">Topic progress</h2>
        {s.byTopic.length === 0 ? <p className="mt-3 text-sm text-muted">Topics appear here once problems are published.</p> : (
          <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">{s.byTopic.map((t) => <li key={t.topic}><div className="mb-1 flex justify-between text-sm"><span>{t.topic}</span><span className="text-muted">{t.solved} / {t.total}</span></div><Bar value={t.solved} total={t.total} label={`${t.topic} problems solved`} /></li>)}</ul>
        )}
      </section>
      <section aria-labelledby="rec-h">
        <h2 id="rec-h" className="text-sm font-semibold">Recent submissions</h2>
        {s.recent.length === 0 ? <div className="mt-3"><EmptyState title="No submissions yet" action={<Link to="/practice"><Button>Find a problem</Button></Link>}>Your solved problems, streaks and activity will build up here.</EmptyState></div> : (
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface text-sm">{s.recent.map((r) => <li key={r._id} className="flex flex-wrap items-center gap-3 p-3"><Link to={`/practice/${r.problem?.slug}`} className="font-medium hover:underline">{r.problem?.title}</Link><VerdictBadge verdict={r.verdict} /><span className="ml-auto text-xs text-muted">{timeAgo(r.createdAt)}</span></li>)}</ul>
        )}
      </section>
    </div>
  );
}

function History() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [verdict, setVerdict] = useState('');
  const [language, setLanguage] = useState('');
  const [view, setView] = useState(null);
  const { data, loading, error, reload } = useFetch('/practice/submissions/mine', { page, limit: 15, verdict: verdict || undefined, language: language || undefined });
  const open = async (id) => { try { setView((await api.get(`/practice/submissions/${id}`)).data.data.submission); } catch (e) { toast.error(getErrorMessage(e)); } };
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <select aria-label="Filter by result" className={select} value={verdict} onChange={(e) => { setVerdict(e.target.value); setPage(1); }}><option value="">Any result</option>{Object.entries(VERDICT_LABELS).filter(([k]) => k !== 'ok').map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select aria-label="Filter by language" className={select} value={language} onChange={(e) => { setLanguage(e.target.value); setPage(1); }}><option value="">Any language</option>{Object.entries(LANGS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </div>
      <div className="mt-5">
        {loading && !data ? <Spinner className="py-12" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.submissions.length === 0 ? <EmptyState title="No submissions match">Change the filters, or submit a solution from the Practice page.</EmptyState> : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Problem</th><th className="px-4 py-2.5 font-medium">Result</th><th className="px-4 py-2.5 font-medium">Language</th><th className="px-4 py-2.5 font-medium">Runtime</th><th className="px-4 py-2.5 font-medium">When</th><th className="px-4 py-2.5"><span className="sr-only">Code</span></th></tr></thead>
              <tbody className="divide-y divide-line">{data.submissions.map((s) => <tr key={s._id}><td className="px-4 py-3"><Link to={`/practice/${s.problem?.slug}`} className="font-medium hover:underline">{s.problem?.title}</Link></td><td className="px-4 py-3"><VerdictBadge verdict={s.verdict} /></td><td className="px-4 py-3">{LANGS[s.language]}</td><td className="px-4 py-3 text-muted">{s.runtimeMs ?? 'n/a'} ms</td><td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(s.createdAt)}</td><td className="px-4 py-3 text-right"><Button size="sm" variant="secondary" onClick={() => open(s._id)}>View code</Button></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="submissions" onPage={setPage} />
      <ConfirmDialog open={Boolean(view)} title={view ? `${view.problem?.title} (${LANGS[view.language]})` : ''} confirmLabel="Close" onConfirm={() => setView(null)} onCancel={() => setView(null)}>
        <pre className="mt-2 max-h-[50vh] overflow-auto rounded-lg border border-line bg-raised p-3 font-mono text-xs text-ink">{view?.code}</pre>
      </ConfirmDialog>
    </div>
  );
}

export default function CodingStats() {
  const [tab, setTab] = useState('overview');
  return (
    <div>
      <h1 className="text-2xl font-bold">Coding progress</h1>
      <div role="tablist" aria-label="Sections" className="mt-5 flex gap-2 border-b border-line">
        {[['overview', 'Overview'], ['history', 'Submissions']].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm ${tab === k ? 'border-b-2 border-accent font-semibold' : 'text-muted hover:text-ink'}`}>{l}</button>)}
      </div>
      <div className="mt-6" role="tabpanel">{tab === 'overview' ? <Overview /> : <History />}</div>
    </div>
  );
}
