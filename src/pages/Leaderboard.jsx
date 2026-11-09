import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import Pagination from '../components/Pagination';
import Avatar from '../components/ui/Avatar';
import { EmptyState, ErrorState, Spinner } from '../components/ui/Feedback';

const PERIODS = [['daily', 'Today'], ['weekly', 'This week'], ['monthly', 'This month'], ['all', 'All time']];
const CATS = [['overall', 'Overall'], ['problems', 'Problem solving'], ['articles', 'Article contributors'], ['community', 'Community helpers'], ['contests', 'Contests'], ['courses', 'Course completions']];

export default function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('weekly');
  const [category, setCategory] = useState('overall');
  const [page, setPage] = useState(1);
  useSeo({ title: 'Leaderboard', description: 'Top learners by points on Code With Ram.' });
  const { data, loading, error, reload } = useFetch('/gamification/leaderboard', { period, category, page, limit: 25 }, [user?.id]);
  const medal = (r) => (r === 1 ? 'text-accent' : r <= 3 ? 'text-ink' : 'text-muted');

  return (
    <div className="mx-auto max-w-3xl py-10">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <p className="mt-1 text-muted">Points come from solving problems, finishing courses, publishing articles, helping others and competing. Days and weeks are counted in UTC.</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Time period" className="flex gap-1">{PERIODS.map(([k, l]) => <button key={k} role="tab" aria-selected={period === k} onClick={() => { setPeriod(k); setPage(1); }} className={`rounded-full border px-3 py-1 text-sm ${period === k ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{l}</button>)}</div>
        <label className="flex items-center gap-2 text-sm text-muted">Category<select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="h-9 rounded-lg border border-line bg-surface px-3 text-sm text-ink">{CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
      </div>
      {data?.me && <p role="status" className="mt-4 rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm">Your rank here: <strong>#{data.me.rank}</strong> with {data.me.points.toLocaleString()} points.</p>}
      <div className="mt-5" aria-live="polite">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.rows.length === 0 ? <EmptyState icon={Trophy} title="No points yet for this view">Be the first. Solve a problem, finish a course or answer a question.</EmptyState> : (
          <div className={`overflow-hidden rounded-xl border border-line bg-surface ${loading ? 'opacity-60' : ''}`}>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Leaderboard</caption>
              <thead className="bg-raised text-muted"><tr><th scope="col" className="w-16 px-4 py-2.5 font-medium">Rank</th><th scope="col" className="px-4 py-2.5 font-medium">Person</th><th scope="col" className="px-4 py-2.5 text-right font-medium">Points</th></tr></thead>
              <tbody className="divide-y divide-line">
                {data.rows.map((r) => (
                  <tr key={r.user.username} className={user?.username === r.user.username ? 'bg-accent/10' : ''}>
                    <td className={`px-4 py-3 font-display text-lg font-bold ${medal(r.rank)}`}>{r.rank}</td>
                    <td className="px-4 py-3"><Link to={`/users/${r.user.username}`} className="flex items-center gap-3 hover:underline"><Avatar user={r.user} size={32} /><span><span className="font-medium">{r.user.name}</span> <span className="text-xs text-muted">@{r.user.username}</span></span></Link></td>
                    <td className="px-4 py-3 text-right font-semibold">{r.points.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="people" onPage={setPage} />
    </div>
  );
}
