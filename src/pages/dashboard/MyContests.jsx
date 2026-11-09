import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { StateBadge, TYPE_LABELS, fmtRange } from '../../components/ContestBadges';
import Button from '../../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

export default function MyContests() {
  const { data, loading, error, reload } = useFetch('/contests/history/mine');
  if (loading && !data) return <Spinner className="py-20" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const open = data.history.filter((h) => h.contest.state !== 'ended');
  const past = data.history.filter((h) => h.contest.state === 'ended');
  const row = (h) => (
    <li key={h.contest._id} className="flex flex-wrap items-center gap-3 p-4">
      <div className="min-w-0 flex-1"><Link to={`/contests/${h.contest.slug}`} className="font-semibold hover:underline">{h.contest.title}</Link><p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted"><StateBadge state={h.contest.state} /><span>{TYPE_LABELS[h.contest.type]}</span><span>{fmtRange(h.contest.startTime, h.contest.endTime)}</span></p></div>
      {h.disqualified ? <span className="text-sm text-danger">Disqualified</span> : h.contest.state !== 'upcoming' && <div className="text-right text-sm"><p className="font-semibold">{h.rank ? `#${h.rank}` : 'n/a'}{h.contest.state === 'ended' && !h.final && <span className="ml-1 text-xs font-normal text-muted">(provisional)</span>}</p><p className="text-xs text-muted">{h.score} pts · {h.solved} solved</p></div>}
    </li>
  );
  return (
    <div>
      <h1 className="text-2xl font-bold">My contests</h1>
      {data.history.length === 0 ? <div className="mt-6"><EmptyState icon={Trophy} title="You have not joined a contest yet" action={<Link to="/contests"><Button>Browse contests</Button></Link>}>Registered contests and your results will be listed here.</EmptyState></div> : (
        <>
          {open.length > 0 && <section className="mt-6" aria-labelledby="open-h"><h2 id="open-h" className="text-sm font-semibold">Upcoming and live</h2><ul className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface">{open.map(row)}</ul></section>}
          {past.length > 0 && <section className="mt-6" aria-labelledby="past-h"><h2 id="past-h" className="text-sm font-semibold">Past</h2><ul className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface">{past.map(row)}</ul></section>}
        </>
      )}
    </div>
  );
}
