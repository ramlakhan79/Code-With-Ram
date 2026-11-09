import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MessagesSquare, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import DiscussionCard from '../components/DiscussionCard';
import Pagination from '../components/Pagination';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../components/ui/Feedback';

const SORTS = [['newest', 'Newest'], ['active', 'Active'], ['trending', 'Trending'], ['votes', 'Top voted']];
const FILTERS = [['', 'All'], ['unanswered', 'Unanswered'], ['answered', 'Answered'], ['accepted', 'Solved']];

export default function Discussions() {
  const { user, can } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const tag = params.get('tag') || '';
  const sort = params.get('sort') || '';
  const filter = params.get('filter') || '';
  const page = Number(params.get('page')) || 1;
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  useSeo({ title: 'Discussions', description: 'Ask programming questions and share answers with other developers.' });
  const set = (patch) => { const n = new URLSearchParams(params); Object.entries({ page: '', ...patch }).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k))); setParams(n); };

  const { data, loading, error, reload } = useFetch('/discussions', { q: q || undefined, tag: tag || undefined, sort: sort || undefined, filter: filter || undefined, page, limit: 15 });
  const { data: tags } = useFetch('/discussions/tags/popular');
  const { data: top } = useFetch('/discussions/top-users');
  const filtered = q || tag || filter;
  const activeSort = sort || (q ? '' : 'newest');
  const chip = (on) => `rounded-full border px-3 py-1 text-sm ${on ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`;

  return (
    <div className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Discussions</h1><p className="mt-1 text-muted">Ask a question, share what you know, and earn reputation when your answers help.</p></div>
        <Button size="lg" onClick={() => navigate(user ? '/discussions/ask' : '/login', { state: { from: { pathname: '/discussions/ask' } } })} disabled={user && !can('discussion:write')}>Ask a question</Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div>
          <form role="search" className="flex gap-2" onSubmit={(e) => { e.preventDefault(); set({ q: text.trim() }); }}>
            <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden /><input aria-label="Search discussions" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search questions" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm" /></div>
            <Button type="submit" variant="secondary">Search</Button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Sort">
            {SORTS.map(([k, l]) => <button key={k} className={chip(activeSort === k)} aria-pressed={activeSort === k} onClick={() => set({ sort: k, q, tag, filter })}>{l}</button>)}
            <span className="mx-1 h-5 w-px bg-line" aria-hidden />
            <select aria-label="Filter" value={filter} onChange={(e) => set({ filter: e.target.value, q, tag, sort })} className="h-9 rounded-lg border border-line bg-surface px-3 text-sm">{FILTERS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
            {tag && <button className="flex items-center gap-1 rounded-full border border-accent bg-accent/20 px-3 py-1 text-sm" onClick={() => set({ tag: '', q, sort, filter })} aria-label={`Remove tag filter ${tag}`}>#{tag} <X className="h-3.5 w-3.5" aria-hidden /></button>}
          </div>

          <div className="mt-4" aria-live="polite">
            {loading && !data ? <Spinner className="py-20" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.discussions.length === 0 ? (
              <EmptyState icon={MessagesSquare} title={filtered ? 'No questions match' : 'No questions yet'} action={filtered ? <Button variant="secondary" onClick={() => setParams({})}>Clear filters</Button> : <Link to="/discussions/ask"><Button>Ask the first question</Button></Link>}>
                {filtered ? 'Try different words or remove a filter.' : 'Start the conversation. Someone will have the answer.'}
              </EmptyState>
            ) : <ul className={`divide-y divide-line rounded-xl border border-line bg-surface ${loading ? 'opacity-60' : ''}`}>{data.discussions.map((d) => <DiscussionCard key={d._id} d={d} />)}</ul>}
          </div>
          <Pagination pagination={data?.pagination} noun="questions" onPage={(p) => { set({ page: String(p), q, tag, sort, filter }); window.scrollTo({ top: 0 }); }} />
        </div>

        <aside className="space-y-6">
          {tags?.tags.length > 0 && <section aria-labelledby="tags-h" className="rounded-xl border border-line p-4"><h2 id="tags-h" className="text-sm font-semibold">Popular tags</h2><div className="mt-3 flex flex-wrap gap-2">{tags.tags.map((t) => <button key={t.slug} className={`rounded-full border px-2.5 py-0.5 text-xs ${tag === t.slug ? 'border-accent bg-accent/20' : 'border-line hover:bg-raised'}`} onClick={() => set({ tag: t.slug, q, sort, filter })}>{t.name} <span className="text-muted">{t.count}</span></button>)}</div></section>}
          {top?.users.length > 0 && (
            <section aria-labelledby="top-h" className="rounded-xl border border-line p-4"><h2 id="top-h" className="text-sm font-semibold">Top contributors</h2>
              <ol className="mt-3 space-y-2">{top.users.map((u) => <li key={u.user.username} className="flex items-center gap-2 text-sm"><Avatar user={u.user} size={24} /><Link to={`/users/${u.user.username}`} className="min-w-0 flex-1 truncate hover:underline">{u.user.name}</Link><span className="text-xs text-muted">{u.reputation.toLocaleString()} rep</span></li>)}</ol>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
