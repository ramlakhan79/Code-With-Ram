import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FileText, BookOpen, Code2, Trophy, MessagesSquare, UserRound, Search as SearchIcon, Clock } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import { DifficultyBadge } from '../components/Verdict';
import { StateBadge } from '../components/ContestBadges';
import Pagination from '../components/Pagination';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../components/ui/Feedback';

const TABS = [['all', 'All'], ['articles', 'Articles'], ['courses', 'Courses'], ['problems', 'Problems'], ['contests', 'Contests'], ['discussions', 'Questions'], ['users', 'People']];
const ICON = { article: FileText, course: BookOpen, problem: Code2, contest: Trophy, discussion: MessagesSquare, user: UserRound };
const LABEL = { articles: 'Articles', courses: 'Courses', problems: 'Practice problems', contests: 'Contests', discussions: 'Questions', users: 'People' };
const select = 'h-9 rounded-lg border border-line bg-surface px-3 text-sm';

function Result({ r }) {
  const Icon = ICON[r.type];
  const m = r.meta || {};
  return (
    <li className="flex gap-3 p-4">
      {r.type === 'user' ? <Avatar user={{ name: r.title, avatar: m.avatar }} size={36} /> : <Icon className="mt-1 h-5 w-5 shrink-0 text-muted" aria-hidden />}
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-snug"><Link to={r.url} className="hover:underline">{r.title}</Link></h3>
        {r.snippet && <p className="mt-1 line-clamp-2 text-sm text-muted">{r.snippet}</p>}
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="font-medium capitalize text-ink">{r.type === 'discussion' ? 'question' : r.type === 'user' ? 'person' : r.type}</span>
          {r.type === 'article' && <><span>by {m.author}</span><span>{m.readingTime} min read</span></>}
          {r.type === 'course' && <><span>{m.instructor}</span><DifficultyLevel level={m.difficulty} /><span>{m.lessons} lessons</span>{m.rating && <span>{m.rating} ★</span>}</>}
          {r.type === 'problem' && <><DifficultyBadge difficulty={m.difficulty} />{m.topics?.length > 0 && <span>{m.topics.join(', ')}</span>}{m.acceptance != null && <span>{m.acceptance}% accepted</span>}</>}
          {r.type === 'contest' && <><StateBadge state={m.state} /><span>{new Date(m.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span></>}
          {r.type === 'discussion' && <><span>{m.votes} votes</span><span>{m.answers} answers{m.accepted && ' · solved'}</span>{m.tags?.length > 0 && <span>{m.tags.join(', ')}</span>}</>}
          {r.type === 'user' && <><span>@{m.username}</span>{m.location && <span>{m.location}</span>}</>}
        </p>
      </div>
    </li>
  );
}
const DifficultyLevel = ({ level }) => <span className="capitalize">{level}</span>;

export default function SearchPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const type = params.get('type') || 'all';
  const difficulty = params.get('difficulty') || '';
  const sort = params.get('sort') || '';
  const page = Number(params.get('page')) || 1;
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  useSeo({ title: q ? `Search: ${q}` : 'Search', description: 'Search articles, courses, problems, contests, discussions and people.' });
  const set = (patch) => { const n = new URLSearchParams(params); Object.entries({ page: '', ...patch }).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); setParams(n); };

  const valid = q.trim().length >= 2;
  const { data, loading, error, reload } = useFetch(valid ? '/search' : null, { q: q.trim(), type, difficulty: difficulty || undefined, sort: sort || undefined, page, limit: 10 });
  const { data: recent } = useFetch(user && !valid ? '/search/recent' : null);
  const clearRecent = async () => { await api.delete('/search/recent'); window.location.reload(); };

  return (
    <div className="mx-auto max-w-4xl py-10">
      <h1 className="text-3xl font-bold">Search</h1>
      <form role="search" className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); set({ q: text.trim(), type: 'all' }); }}>
        <div className="relative flex-1"><SearchIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden /><input aria-label="Search query" value={text} onChange={(e) => setText(e.target.value)} autoFocus={!q} placeholder="What do you want to learn?" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm" /></div>
        <Button type="submit">Search</Button>
      </form>

      {!valid ? (
        <div className="mt-8">
          {q && <p className="mb-4 text-sm text-danger" role="alert">Type at least 2 characters.</p>}
          {recent?.recent.length > 0 && (
            <section aria-labelledby="rec-h"><div className="flex items-center justify-between"><h2 id="rec-h" className="text-sm font-semibold">Recent searches</h2><button className="text-xs underline" onClick={clearRecent}>Clear</button></div>
              <ul className="mt-2 flex flex-wrap gap-2">{recent.recent.map((r) => <li key={r._id}><button onClick={() => set({ q: r.q, type: 'all' })} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm hover:bg-raised"><Clock className="h-3.5 w-3.5" aria-hidden /> {r.q}</button></li>)}</ul></section>
          )}
          <p className="mt-6 text-sm text-muted">Search across articles, courses, practice problems, contests, questions and people. Or browse: <Link className="underline" to="/articles">articles</Link>, <Link className="underline" to="/courses">courses</Link>, <Link className="underline" to="/practice">practice</Link>, <Link className="underline" to="/discussions">discussions</Link>.</p>
        </div>
      ) : (
        <>
          <div role="tablist" aria-label="Result type" className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
            {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={type === k} onClick={() => set({ type: k, difficulty, sort })} className={`whitespace-nowrap px-3 py-2 text-sm ${type === k ? 'border-b-2 border-accent font-semibold' : 'text-muted hover:text-ink'}`}>{l}{data && (k === 'all' ? ` (${data.total})` : ` (${data.counts[k] ?? 0})`)}</button>)}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted">Difficulty
              <select className={select} value={difficulty} onChange={(e) => set({ difficulty: e.target.value, type })}><option value="">Any</option><optgroup label="Courses"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></optgroup><optgroup label="Problems"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></optgroup></select></label>
            <label className="flex items-center gap-2 text-sm text-muted">Sort by
              <select className={select} value={sort} onChange={(e) => set({ sort: e.target.value, type })}><option value="">Relevance</option><option value="newest">Newest</option><option value="popular">Most popular</option></select></label>
          </div>

          <div className="mt-6" aria-live="polite">
            {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.total === 0 ? (
              <EmptyState icon={SearchIcon} title={`Nothing found for “${q}”`} action={difficulty ? <Button variant="secondary" onClick={() => set({ difficulty: '' })}>Remove difficulty filter</Button> : null}>Check the spelling, try fewer or different words, or browse a section instead.</EmptyState>
            ) : type === 'all' ? (
              <div className={`space-y-8 ${loading ? 'opacity-60' : ''}`}>
                {Object.entries(data.groups).filter(([, items]) => items.length > 0).map(([k, items]) => (
                  <section key={k} aria-labelledby={`g-${k}`}>
                    <div className="flex items-center justify-between"><h2 id={`g-${k}`} className="font-semibold">{LABEL[k]}</h2>{data.counts[k] > items.length && <button className="text-sm underline" onClick={() => set({ type: k, difficulty, sort })}>See all {data.counts[k]}</button>}</div>
                    <ul className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface">{items.map((r) => <Result key={r.id} r={r} />)}</ul>
                  </section>
                ))}
              </div>
            ) : data.results.length === 0 ? <EmptyState title={`No ${LABEL[type].toLowerCase()} match`}>Try the All tab to see results from other sections.</EmptyState> : (
              <><ul className={`divide-y divide-line rounded-xl border border-line bg-surface ${loading ? 'opacity-60' : ''}`}>{data.results.map((r) => <Result key={r.id} r={r} />)}</ul>
                <Pagination pagination={data.pagination} noun="results" onPage={(p) => { set({ page: String(p), type, difficulty, sort }); window.scrollTo({ top: 0 }); }} /></>
            )}
          </div>
        </>
      )}
    </div>
  );
}
