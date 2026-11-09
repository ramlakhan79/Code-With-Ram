import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CircleDot, Circle, Search, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import { DifficultyBadge } from '../components/Verdict';
import Pagination from '../components/Pagination';
import Button from '../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../components/ui/Feedback';

const chip = (on) => `whitespace-nowrap rounded-full border px-3 py-1 text-sm ${on ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`;
const select = 'h-10 rounded-lg border border-line bg-surface px-3 text-sm';

export default function Practice() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const difficulty = params.get('difficulty') || '';
  const topic = params.get('topic') || '';
  const status = params.get('status') || '';
  const sort = params.get('sort') || '';
  const page = Number(params.get('page')) || 1;
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  useSeo({ title: 'Practice', description: 'Solve coding problems in Java, C++, C, Python and JavaScript and track your progress.' });

  const set = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries({ page: '', ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next);
  };
  const { data: meta } = useFetch('/practice/topics');
  const { data, loading, error, reload } = useFetch('/practice/problems', { q: q || undefined, difficulty: difficulty || undefined, topic: topic || undefined, status: status || undefined, sort: sort || undefined, page, limit: 20 }, [user?.id]);
  const { data: daily } = useFetch('/practice/daily', undefined, [user?.id]);
  const filtered = q || difficulty || topic || status;
  const Icon = { solved: CheckCircle2, attempted: CircleDot };

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold">Practice</h1>
      <p className="mt-1 text-muted">Read from standard input, print to standard output, and run your code in Java, C++, C, Python or JavaScript.</p>

      {daily?.problem && (
        <section aria-labelledby="daily-h" className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-accent/50 bg-accent/10 p-4">
          <div className="min-w-0 flex-1"><h2 id="daily-h" className="text-xs font-semibold uppercase tracking-wide text-muted">Today's challenge</h2><p className="mt-1 font-semibold"><Link to={`/practice/${daily.problem.slug}`} className="hover:underline">{daily.problem.title}</Link></p><p className="mt-1 flex items-center gap-2 text-sm text-muted"><DifficultyBadge difficulty={daily.problem.difficulty} />{daily.problem.topics.join(', ')}</p></div>
          <Link to={`/practice/${daily.problem.slug}`}><Button>{daily.problem.userStatus === 'solved' ? 'Solved. Review' : 'Solve it'}</Button></Link>
        </section>
      )}

      <form role="search" className="mt-6 flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); set({ q: text.trim() }); }}>
        <div className="relative min-w-[220px] flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden /><input aria-label="Search problems" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search problems" className={`${select} w-full pl-9`} /></div>
        <select aria-label="Difficulty" className={select} value={difficulty} onChange={(e) => set({ difficulty: e.target.value, q })}><option value="">Any difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
        {user && <select aria-label="Progress" className={select} value={status} onChange={(e) => set({ status: e.target.value, q })}><option value="">All problems</option><option value="unsolved">Unsolved</option><option value="attempted">Attempted</option><option value="solved">Solved</option></select>}
        <select aria-label="Sort" className={select} value={sort} onChange={(e) => set({ sort: e.target.value, q })}><option value="">{q ? 'Most relevant' : 'Newest'}</option><option value="popular">Most solved</option><option value="difficulty">Easiest first</option></select>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {meta && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by topic">
          <button className={chip(!topic)} aria-pressed={!topic} onClick={() => set({ topic: '' })}>All topics</button>
          {meta.topics.map((t) => <button key={t} className={chip(topic === t)} aria-pressed={topic === t} onClick={() => set({ topic: t })}>{t}</button>)}
        </div>
      )}

      <div className="mt-6" aria-live="polite">
        {loading && !data ? <Spinner className="py-20" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.problems.length === 0 ? (
          <EmptyState icon={Code2} title={filtered ? 'No problems match your filters' : 'No problems published yet'} action={filtered && <Button variant="secondary" onClick={() => setParams({})}>Clear filters</Button>}>
            {filtered ? 'Try a different search or remove a filter.' : 'Problems will appear here once an admin publishes them.'}
          </EmptyState>
        ) : (
          <div className={`overflow-x-auto rounded-xl border border-line ${loading ? 'opacity-60' : ''}`}>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="w-10 px-4 py-2.5"><span className="sr-only">Status</span></th><th className="px-4 py-2.5 font-medium">Problem</th><th className="px-4 py-2.5 font-medium">Difficulty</th><th className="px-4 py-2.5 font-medium">Acceptance</th><th className="px-4 py-2.5 font-medium">Topics</th></tr></thead>
              <tbody className="divide-y divide-line">
                {data.problems.map((p) => {
                  const S = Icon[p.userStatus] || Circle;
                  return (
                    <tr key={p._id} className="hover:bg-raised/60">
                      <td className="px-4 py-3"><S className={`h-4 w-4 ${p.userStatus === 'solved' ? 'text-ok' : 'text-muted'}`} aria-label={p.userStatus === 'solved' ? 'Solved' : p.userStatus === 'attempted' ? 'Attempted' : 'Not attempted'} /></td>
                      <td className="px-4 py-3"><Link to={`/practice/${p.slug}`} className="font-medium hover:underline">{p.title}</Link></td>
                      <td className="px-4 py-3"><DifficultyBadge difficulty={p.difficulty} /></td>
                      <td className="px-4 py-3 text-muted">{p.submissionCount ? `${p.acceptance}%` : 'n/a'}</td>
                      <td className="px-4 py-3 text-muted">{p.topics.join(', ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="problems" onPage={(p) => { set({ page: String(p), q, difficulty, topic, status, sort }); window.scrollTo({ top: 0 }); }} />
    </div>
  );
}
