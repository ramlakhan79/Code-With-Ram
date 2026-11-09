import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import { EmptyState, ErrorState, Spinner } from '../components/ui/Feedback';
import Button from '../components/ui/Button';

const chip = (on) => `whitespace-nowrap rounded-full border px-3 py-1 text-sm ${on ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`;

export default function Articles() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const tag = params.get('tag') || '';
  const sort = params.get('sort') || '';
  const page = Number(params.get('page')) || 1;
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);

  useSeo({ title: 'Articles', description: 'Technical articles and tutorials written by developers, reviewed by editors.' });
  const set = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries({ page: '', ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next);
  };

  const { data: cats } = useFetch('/categories', { scope: 'article' });
  const { data: pop } = useFetch('/tags/popular');
  const { data, loading, error, reload } = useFetch('/articles', { q: q || undefined, category: category || undefined, tag: tag || undefined, sort: sort || undefined, page, limit: 12 });
  const filtered = q || category || tag;

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold">Articles</h1>
      <p className="mt-1 text-muted">Tutorials, deep dives and lessons learned from working developers.</p>

      <form role="search" className="mt-6 flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); set({ q: text.trim() }); }}>
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden />
          <input aria-label="Search articles" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search articles" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm" />
        </div>
        <select aria-label="Sort articles" value={sort} onChange={(e) => set({ sort: e.target.value, q })} className="h-10 rounded-lg border border-line bg-surface px-3 text-sm">
          <option value="">{q ? 'Most relevant' : 'Latest'}</option><option value="trending">Trending</option><option value="popular">Most read</option>
        </select>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {cats?.categories.length > 0 && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by category">
          <button className={chip(!category)} aria-pressed={!category} onClick={() => set({ category: '' })}>All</button>
          {cats.categories.map((c) => <button key={c._id} className={chip(category === c.slug)} aria-pressed={category === c.slug} onClick={() => set({ category: c.slug })}>{c.name}</button>)}
        </div>
      )}
      {pop?.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm" role="group" aria-label="Popular tags">
          <span className="text-muted">Popular tags:</span>
          {pop.tags.slice(0, 10).map((t) => <button key={t.slug} className={chip(tag === t.slug)} aria-pressed={tag === t.slug} onClick={() => set({ tag: tag === t.slug ? '' : t.slug })}>#{t.name}</button>)}
        </div>
      )}

      <div className="mt-8" aria-live="polite">
        {loading && !data ? <Spinner className="py-20" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.articles.length === 0 ? (
          <EmptyState icon={FileText} title={filtered ? 'No articles match your filters' : 'No articles published yet'}
            action={filtered && <Button variant="secondary" onClick={() => setParams({})}>Clear filters</Button>}>
            {filtered ? 'Try a different search or remove a filter.' : 'Check back soon, new articles are on the way.'}
          </EmptyState>
        ) : (
          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-60' : ''}`}>
            {data.articles.map((a) => <ArticleCard key={a._id} article={a} />)}
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="articles" onPage={(p) => { set({ page: String(p), q, category, tag, sort }); window.scrollTo({ top: 0 }); }} />
    </div>
  );
}
