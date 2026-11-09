import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import useServerClock from '../hooks/useServerClock';
import ArticleBody from '../components/ArticleBody';
import Countdown from '../components/Countdown';
import Pagination from '../components/Pagination';
import { StateBadge, TYPE_LABELS, fmtRange } from '../components/ContestBadges';
import { DifficultyBadge, VerdictBadge } from '../components/Verdict';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { EmptyState, ErrorState, PageSpinner, Spinner } from '../components/ui/Feedback';
import { timeAgo } from '../utils/format';

function Leaderboard({ slug, running, meName }) {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch(`/contests/${slug}/leaderboard`, { page, limit: 50 });
  // Simple polling keeps the board live without any paid real-time service
  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => { if (document.visibilityState === 'visible') reload(); }, 15000);
    return () => clearInterval(t);
  }, [running, reload]);
  if (loading && !data) return <Spinner className="py-12" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (data.rows.length === 0) return <EmptyState title="No standings yet">{data.state === 'upcoming' ? 'The leaderboard opens when the contest starts.' : 'Nobody has registered yet.'}</EmptyState>;
  return (
    <div>
      <p className="mb-3 flex flex-wrap items-center gap-3 text-sm text-muted">
        <span className={`rounded-full border px-2.5 py-0.5 text-xs ${data.resultsPublished ? 'border-ok/50 bg-ok/10 text-ink' : 'border-line'}`}>{data.resultsPublished ? 'Final results' : 'Provisional'}</span>
        {running && <span>Updates every 15 seconds</span>}
        {data.me && <span>Your rank: <strong className="text-ink">#{data.me.rank}</strong> ({data.me.score} pts)</span>}
      </p>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">Contest leaderboard</caption>
          <thead className="bg-raised text-muted"><tr><th scope="col" className="px-3 py-2.5 font-medium">Rank</th><th scope="col" className="px-3 py-2.5 font-medium">User</th><th scope="col" className="px-3 py-2.5 font-medium">Score</th><th scope="col" className="px-3 py-2.5 font-medium">Penalty</th>{data.problems.map((p) => <th scope="col" key={p.label} className="px-3 py-2.5 text-center font-medium">{p.label}</th>)}</tr></thead>
          <tbody className="divide-y divide-line">
            {data.rows.map((r) => (
              <tr key={r.user.username} className={r.user.username === meName ? 'bg-accent/10' : ''}>
                <td className="px-3 py-2.5 font-semibold">{r.rank}</td>
                <td className="px-3 py-2.5"><Link to={`/users/${r.user.username}`} className="hover:underline">{r.user.name}</Link> <span className="text-xs text-muted">@{r.user.username}</span></td>
                <td className="px-3 py-2.5 font-medium">{r.score}</td><td className="px-3 py-2.5 text-muted">{r.penaltyMinutes}</td>
                {r.cells.map((c) => <td key={c.label} className="px-3 py-2.5 text-center">{c.solved ? <span className="text-ok"><span aria-hidden>✓</span><span className="sr-only">Solved</span> <span className="text-xs">{c.minutes}m{c.wrong ? ` (+${c.wrong})` : ''}</span></span> : c.wrong ? <span className="text-xs text-danger">−{c.wrong}<span className="sr-only"> wrong attempts</span></span> : <span className="text-muted">·</span>}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination pagination={data.pagination} noun="participants" onPage={setPage} />
    </div>
  );
}

function MySubmissions({ slug }) {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(`/contests/${slug}/submissions/mine`);
  const [view, setView] = useState(null);
  if (loading && !data) return <Spinner className="py-12" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.submissions.length) return <EmptyState title="No submissions yet">Your runs will be listed here with their results.</EmptyState>;
  const open = async (id) => { try { setView((await api.get(`/contests/${slug}/submissions/${id}`)).data.data.submission); } catch (e) { toast.error(getErrorMessage(e)); } };
  return (
    <>
      <ul className="divide-y divide-line rounded-xl border border-line bg-surface text-sm">
        {data.submissions.map((s) => <li key={s._id} className="flex flex-wrap items-center gap-3 p-3"><span className="font-semibold">Problem {s.label}</span><VerdictBadge verdict={s.verdict} /><span className="capitalize text-muted">{s.language}</span><span className="text-muted">minute {s.minutes}</span><span className="ml-auto text-xs text-muted">{timeAgo(s.submittedAt)}</span><Button size="sm" variant="ghost" onClick={() => open(s._id)}>View code</Button></li>)}
      </ul>
      <ConfirmDialog open={Boolean(view)} title={view ? `Problem ${view.label} (${view.language})` : ''} confirmLabel="Close" onConfirm={() => setView(null)} onCancel={() => setView(null)}><pre className="mt-2 max-h-[50vh] overflow-auto rounded-lg border border-line bg-raised p-3 font-mono text-xs text-ink">{view?.code}</pre></ConfirmDialog>
    </>
  );
}

function Stats({ slug }) {
  const { data, loading, error, reload } = useFetch(`/contests/${slug}/stats`);
  if (loading && !data) return <Spinner className="py-12" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const t = data.totals;
  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-3 gap-3">{[['Participants', t.participants], ['Made a submission', t.submitted], ['Solved at least one', t.solvedAny]].map(([l, v]) => <div key={l} className="rounded-xl border border-line bg-surface p-4"><dt className="text-sm text-muted">{l}</dt><dd className="mt-1 font-display text-2xl font-bold">{v}</dd></div>)}</dl>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Problem</th><th className="px-4 py-2.5 font-medium">Solved by</th><th className="px-4 py-2.5 font-medium">Submissions</th><th className="px-4 py-2.5 font-medium">Acceptance</th></tr></thead>
          <tbody className="divide-y divide-line">{data.problems.map((p) => <tr key={p.label}><td className="px-4 py-3">{p.label}. {p.title}</td><td className="px-4 py-3">{p.solvedBy}</td><td className="px-4 py-3">{p.attempts}</td><td className="px-4 py-3">{p.acceptance}%</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default function ContestPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const { data, loading, error, reload } = useFetch(`/contests/${slug}`, undefined, [user?.id]);
  const [tab, setTab] = useState('overview');
  const [busy, setBusy] = useState(false);
  const now = useServerClock(data?.serverTime);
  const c = data?.contest;
  useSeo({ title: c?.title, description: `Programming contest: ${c?.title}` });

  // Re-fetch exactly when the contest flips state, so problems appear the moment it starts
  const state = c ? (now() < new Date(c.startTime).getTime() ? 'upcoming' : now() < new Date(c.endTime).getTime() ? 'running' : 'ended') : null;
  useEffect(() => { if (c && state !== c.state) reload(); }, [state, c, reload]);

  if (loading && !data) return <PageSpinner />;
  if (error) return <div className="py-16"><ErrorState message={error} onRetry={reload} /></div>;
  const { viewer, problems } = data;

  const act = async (method) => {
    setBusy(true);
    try { await api[method](`/contests/${slug}/register`); toast.success(method === 'post' ? 'You are registered. Good luck!' : 'Registration withdrawn'); reload(); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };
  const tabs = [['overview', 'Overview'], ['problems', 'Problems'], ['leaderboard', 'Leaderboard'], ...(viewer.registered ? [['submissions', 'My submissions']] : []), ['announcements', `Announcements${data.announcements.length ? ` (${data.announcements.length})` : ''}`], ...(c.state === 'ended' || viewer.canManage ? [['stats', 'Statistics']] : [])];

  return (
    <div className="py-10">
      {c.status !== 'published' && <p role="status" className="mb-4 rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm">Draft contest. Only admins can see this page.</p>}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2"><StateBadge state={c.state} /><span className="text-sm text-muted">{TYPE_LABELS[c.type]}{c.topic ? `: ${c.topic}` : ''}</span></p>
          <h1 className="mt-2 text-3xl font-bold">{c.title}</h1>
          <p className="mt-1 text-muted">{fmtRange(c.startTime, c.endTime)}</p>
          <p className="mt-1 text-sm text-muted">{c.problemCount} problems · {c.totalPoints} points · {c.participantCount} registered</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-5 text-center">
          {c.state === 'upcoming' && <><p className="text-xs text-muted">Starts in</p><p className="text-2xl font-bold"><Countdown target={c.startTime} now={now} /></p></>}
          {c.state === 'running' && <><p className="text-xs text-muted">Time left</p><p className="text-2xl font-bold"><Countdown target={c.endTime} now={now} /></p></>}
          {c.state === 'ended' && <p className="font-semibold">{c.resultsPublished ? 'Final results published' : 'Contest ended'}</p>}
          <div className="mt-3">
            {viewer.disqualified ? <p className="text-sm text-danger">You were disqualified.</p>
              : viewer.registered ? <><p className="text-sm font-medium text-ok">You are registered</p>{viewer.standing && c.state !== 'upcoming' && <p className="text-xs text-muted">{viewer.standing.score} pts · {viewer.standing.penaltyMinutes} min penalty</p>}{c.state === 'upcoming' && <Button size="sm" variant="ghost" className="mt-1" loading={busy} onClick={() => act('delete')}>Withdraw</Button>}</>
              : c.state === 'ended' ? null
              : user ? <Button loading={busy} onClick={() => act('post')}>Register</Button>
              : <Link to="/login" state={{ from: location }}><Button>Log in to register</Button></Link>}
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="Contest sections" className="mt-8 flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`whitespace-nowrap px-4 py-2 text-sm ${tab === k ? 'border-b-2 border-accent font-semibold' : 'text-muted hover:text-ink'}`}>{l}</button>)}
      </div>
      <div className="mt-6" role="tabpanel">
        {tab === 'overview' && (
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <ArticleBody html={c.description || '<p>No description yet.</p>'} />
            <aside className="space-y-4 text-sm">
              <section className="rounded-xl border border-line p-4"><h2 className="font-semibold">Scoring</h2><p className="mt-2 text-muted">Each problem is worth a fixed number of points. Participants are ranked by points, then by penalty: the minutes taken to solve each problem, plus {c.wrongPenaltyMinutes} minutes for every wrong attempt before it. Compile errors cost nothing.</p></section>
              {c.rules && <section className="rounded-xl border border-line p-4"><h2 className="font-semibold">Rules</h2><p className="mt-2 whitespace-pre-line text-muted">{c.rules}</p></section>}
            </aside>
          </div>
        )}
        {tab === 'problems' && (problems ? (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {problems.map((p) => <li key={p.label}><Link to={`/contests/${slug}/problems/${p.label}`} className="flex flex-wrap items-center gap-3 p-4 hover:bg-raised">{p.solved ? <CheckCircle2 className="h-5 w-5 text-ok" aria-label="Solved" /> : <Circle className="h-5 w-5 text-muted" aria-label="Not solved" />}<span className="font-semibold">{p.label}.</span><span className="font-medium">{p.title}</span><DifficultyBadge difficulty={p.difficulty} /><span className="ml-auto text-sm text-muted">{p.points} points{p.wrong > 0 && !p.solved ? ` · ${p.wrong} wrong` : ''}</span></Link></li>)}
          </ul>
        ) : <EmptyState title="Problems are hidden">{data.problemsMessage}</EmptyState>)}
        {tab === 'leaderboard' && <Leaderboard slug={slug} running={c.state === 'running'} meName={user?.username} />}
        {tab === 'submissions' && <MySubmissions slug={slug} />}
        {tab === 'announcements' && (data.announcements.length ? <ul className="space-y-3">{data.announcements.map((a) => <li key={a._id} className="rounded-xl border border-line bg-surface p-4"><p className="font-semibold">{a.title}</p><p className="mt-1 whitespace-pre-line text-sm">{a.body}</p><p className="mt-2 text-xs text-muted">{a.author?.name} · {timeAgo(a.createdAt)}</p></li>)}</ul> : <EmptyState title="No announcements">{viewer.registered ? 'Clarifications from the organisers will appear here.' : 'Register to see announcements during the contest.'}</EmptyState>)}
        {tab === 'stats' && <Stats slug={slug} />}
      </div>
    </div>
  );
}
