import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { formatDate, timeAgo } from '../../utils/format';
import BadgeIcon from '../../components/BadgeIcon';
import { ErrorState, Spinner } from '../../components/ui/Feedback';

export default function Achievements() {
  const { data: s, loading, error, reload } = useFetch('/gamification/me');
  if (loading && !s) return <Spinner className="py-20" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const pct = Math.min(100, Math.round(((s.points - s.currentFloor) / (s.nextAt - s.currentFloor)) * 100));
  const earned = s.badges.filter((b) => b.earned).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Achievements</h1>
      <section aria-labelledby="lvl-h" className="mt-6 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><h2 id="lvl-h" className="text-sm text-muted">Level</h2><p className="font-display text-4xl font-bold">{s.level}</p></div>
          <div className="text-right"><p className="font-display text-3xl font-bold">{s.points.toLocaleString()} <span className="text-base font-normal text-muted">points</span></p>{s.rank && <p className="text-sm text-muted">Rank #{s.rank} all time · <Link to="/leaderboard" className="underline">leaderboard</Link></p>}</div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to the next level"><div className="h-full bg-accent" style={{ width: `${pct}%` }} /></div>
        <p className="mt-2 text-xs text-muted">{(s.nextAt - s.points).toLocaleString()} points to level {s.level + 1}</p>
      </section>

      <section aria-labelledby="badges-h" className="mt-8">
        <h2 id="badges-h" className="text-lg font-semibold">Badges <span className="text-sm font-normal text-muted">{earned} of {s.badges.length} earned</span></h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {s.badges.map((b) => (
            <li key={b.key} className={`flex gap-3 rounded-xl border p-4 ${b.earned ? 'border-accent/60 bg-accent/10' : 'border-line bg-surface'}`}>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${b.earned ? 'bg-accent text-accent-ink' : 'bg-raised text-muted'}`}>{b.earned ? <BadgeIcon name={b.icon} /> : <Lock className="h-5 w-5" aria-hidden />}</span>
              <div className="min-w-0"><p className="font-semibold">{b.name}<span className="sr-only">{b.earned ? ' (earned)' : ' (locked)'}</span></p><p className="mt-0.5 text-sm text-muted">{b.description}</p>{b.earned && <p className="mt-1 text-xs text-muted">Earned {formatDate(b.awardedAt)}</p>}</div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="rec-h" className="mt-8">
        <h2 id="rec-h" className="text-lg font-semibold">Recent points</h2>
        {s.events.length === 0 ? <p className="mt-3 text-sm text-muted">Solve a problem, finish a course or answer a question to start earning. <Link to="/practice" className="underline">Find a problem</Link></p> : (
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface text-sm">{s.events.map((e, i) => <li key={i} className="flex items-center gap-3 p-3"><span className="w-14 font-semibold text-ok">+{e.points}</span><span className="min-w-0 flex-1 truncate">{e.label}</span><span className="text-xs text-muted">{timeAgo(e.createdAt)}</span></li>)}</ul>
        )}
      </section>
    </div>
  );
}
