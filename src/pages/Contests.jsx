import { Link, useSearchParams } from 'react-router-dom';
import { Trophy, Users, ListChecks } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import useServerClock from '../hooks/useServerClock';
import { StateBadge, TYPE_LABELS, fmtRange } from '../components/ContestBadges';
import Countdown from '../components/Countdown';
import Pagination from '../components/Pagination';
import { EmptyState, ErrorState, Spinner } from '../components/ui/Feedback';
import { useAuth } from '../context/AuthContext';

const TABS = [['upcoming', 'Upcoming'], ['running', 'Live now'], ['past', 'Past']];

function Card({ c, now }) {
  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-2"><StateBadge state={c.state} /><span className="text-xs text-muted">{TYPE_LABELS[c.type]}{c.topic ? `: ${c.topic}` : ''}</span>{c.registered && <span className="rounded-full border border-ok/50 bg-ok/10 px-2.5 py-0.5 text-xs">Registered</span>}</div>
      <h3 className="mt-2 text-lg font-semibold"><Link to={`/contests/${c.slug}`} className="hover:underline">{c.title}</Link></h3>
      <p className="mt-1 text-sm text-muted">{fmtRange(c.startTime, c.endTime)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
        <span className="flex items-center gap-1.5"><ListChecks className="h-4 w-4" aria-hidden /> {c.problemCount} problems</span>
        <span className="flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden /> {c.participantCount} registered</span>
        {c.state === 'upcoming' && <span>Starts in <Countdown target={c.startTime} now={now} className="text-ink" /></span>}
        {c.state === 'running' && <span>Ends in <Countdown target={c.endTime} now={now} className="text-ink" /></span>}
      </div>
    </article>
  );
}

export default function Contests() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const state = params.get('state') || 'upcoming';
  const type = params.get('type') || '';
  const page = Number(params.get('page')) || 1;
  useSeo({ title: 'Contests', description: 'Timed programming contests with live leaderboards.' });
  const set = (patch) => { const n = new URLSearchParams(params); Object.entries({ page: '', ...patch }).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); setParams(n); };
  const { data: live } = useFetch('/contests', { state: 'running', limit: 5 }, [user?.id]);
  const { data, loading, error, reload } = useFetch('/contests', { state, type: type || undefined, page, limit: 12 }, [user?.id]);
  const now = useServerClock(data?.serverTime || live?.serverTime);

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold">Contests</h1>
      <p className="mt-1 text-muted">Solve problems against the clock. Ranking uses points first, then time penalties. The server keeps the time, not your device.</p>

      {state !== 'running' && live?.contests.length > 0 && (
        <section aria-labelledby="live-h" className="mt-6 rounded-xl border border-ok/50 bg-ok/5 p-4">
          <h2 id="live-h" className="flex items-center gap-2 text-sm font-semibold"><Trophy className="h-4 w-4" aria-hidden /> Live now</h2>
          <ul className="mt-2 space-y-1 text-sm">{live.contests.map((c) => <li key={c._id}><Link to={`/contests/${c.slug}`} className="font-medium underline">{c.title}</Link> <span className="text-muted">ends in <Countdown target={c.endTime} now={now} /></span></li>)}</ul>
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Contest status" className="flex gap-2">{TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={state === k} onClick={() => set({ state: k, type })} className={`rounded-full border px-3 py-1 text-sm ${state === k ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{l}</button>)}</div>
        <select aria-label="Contest type" value={type} onChange={(e) => set({ type: e.target.value, state })} className="h-9 rounded-lg border border-line bg-surface px-3 text-sm"><option value="">All types</option>{Object.entries(TYPE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </div>

      <div className="mt-6" aria-live="polite">
        {loading && !data ? <Spinner className="py-20" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.contests.length === 0 ? (
          <EmptyState icon={Trophy} title={`No ${state === 'running' ? 'live' : state} contests`}>{state === 'upcoming' ? 'New contests are announced here. Check back soon.' : 'Try another tab or type.'}</EmptyState>
        ) : <div className="grid gap-4 md:grid-cols-2">{data.contests.map((c) => <Card key={c._id} c={c} now={now} />)}</div>}
      </div>
      <Pagination pagination={data?.pagination} noun="contests" onPage={(p) => { set({ page: String(p), state, type }); window.scrollTo({ top: 0 }); }} />
    </div>
  );
}
