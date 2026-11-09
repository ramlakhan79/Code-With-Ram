import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import CourseCard from '../components/CourseCard';
import Pagination from '../components/Pagination';
import Button from '../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../components/ui/Feedback';

const chip = (on) => `whitespace-nowrap rounded-full border px-3 py-1 text-sm ${on ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`;
const select = 'h-10 rounded-lg border border-line bg-surface px-3 text-sm';

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const difficulty = params.get('difficulty') || '';
  const sort = params.get('sort') || '';
  const page = Number(params.get('page')) || 1;
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  useSeo({ title: 'Courses', description: 'Free structured courses with lessons, quizzes, assignments and certificates.' });

  const set = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries({ page: '', ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next);
  };
  const { data: cats } = useFetch('/categories', { scope: 'course' });
  const { data, loading, error, reload } = useFetch('/courses', { q: q || undefined, category: category || undefined, difficulty: difficulty || undefined, sort: sort || undefined, page, limit: 12 });
  const filtered = q || category || difficulty;

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold">Courses</h1>
      <p className="mt-1 text-muted">Learn step by step with lessons, quizzes and assignments. Every course is free, and you earn a certificate when you finish.</p>

      <form role="search" className="mt-6 flex flex-wrap gap-3" onSubmit={(e) => { e.preventDefault(); set({ q: text.trim() }); }}>
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden />
          <input aria-label="Search courses" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search courses" className={`${select} w-full pl-9`} />
        </div>
        <select aria-label="Difficulty" className={select} value={difficulty} onChange={(e) => set({ difficulty: e.target.value, q })}>
          <option value="">Any level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
        </select>
        <select aria-label="Sort courses" className={select} value={sort} onChange={(e) => set({ sort: e.target.value, q })}>
          <option value="">{q ? 'Most relevant' : 'Newest'}</option><option value="popular">Most popular</option><option value="rating">Highest rated</option>
        </select>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {cats?.categories.length > 0 && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by category">
          <button className={chip(!category)} aria-pressed={!category} onClick={() => set({ category: '' })}>All</button>
          {cats.categories.map((c) => <button key={c._id} className={chip(category === c.slug)} aria-pressed={category === c.slug} onClick={() => set({ category: c.slug })}>{c.name}</button>)}
        </div>
      )}

      <div className="mt-8" aria-live="polite">
        {loading && !data ? <Spinner className="py-20" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.courses.length === 0 ? (
          <EmptyState icon={BookOpen} title={filtered ? 'No courses match your filters' : 'No courses published yet'} action={filtered && <Button variant="secondary" onClick={() => setParams({})}>Clear filters</Button>}>
            {filtered ? 'Try a different search or remove a filter.' : 'New courses are on the way.'}
          </EmptyState>
        ) : (
          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-60' : ''}`}>{data.courses.map((c) => <CourseCard key={c._id} course={c} />)}</div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="courses" onPage={(p) => { set({ page: String(p), q, category, difficulty, sort }); window.scrollTo({ top: 0 }); }} />
    </div>
  );
}
