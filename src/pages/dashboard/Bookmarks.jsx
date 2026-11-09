import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import ArticleCard from '../../components/ArticleCard';
import DiscussionCard from '../../components/DiscussionCard';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

function ArticleBookmarks() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch('/articles/bookmarks', { page, limit: 12 });
  if (loading && !data) return <Spinner className="py-16" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <>
      {data.articles.length === 0 ? <EmptyState icon={Bookmark} title="No saved articles yet" action={<Link to="/articles"><Button>Browse articles</Button></Link>}>Use the Save button on any article to keep it here.</EmptyState>
        : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{data.articles.map((a) => <ArticleCard key={a._id} article={a} />)}</div>}
      <Pagination pagination={data.pagination} noun="bookmarks" onPage={setPage} />
    </>
  );
}

function DiscussionBookmarks() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch('/discussions/bookmarks/mine', { page, limit: 15 });
  if (loading && !data) return <Spinner className="py-16" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <>
      {data.discussions.length === 0 ? <EmptyState icon={Bookmark} title="No saved questions yet" action={<Link to="/discussions"><Button>Browse discussions</Button></Link>}>Use Save on a question to keep it here.</EmptyState>
        : <ul className="divide-y divide-line rounded-xl border border-line bg-surface">{data.discussions.map((d) => <DiscussionCard key={d._id} d={d} />)}</ul>}
      <Pagination pagination={data.pagination} noun="bookmarks" onPage={setPage} />
    </>
  );
}

export default function Bookmarks() {
  const [tab, setTab] = useState('articles');
  return (
    <div>
      <h1 className="text-2xl font-bold">Bookmarks</h1>
      <div role="tablist" aria-label="Bookmark type" className="mt-5 flex gap-2">{[['articles', 'Articles'], ['discussions', 'Questions']].map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full border px-3 py-1 text-sm ${tab === k ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{l}</button>)}</div>
      <div className="mt-6" role="tabpanel">{tab === 'articles' ? <ArticleBookmarks /> : <DiscussionBookmarks />}</div>
    </div>
  );
}
