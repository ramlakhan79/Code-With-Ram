import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Heart, Bookmark, Share2, Link as LinkIcon, Flag, Clock, Eye } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import { formatDate } from '../utils/format';
import ArticleBody from '../components/ArticleBody';
import ArticleCard from '../components/ArticleCard';
import Comments from '../components/Comments';
import ReportDialog from '../components/ReportDialog';
import StatusBadge from '../components/StatusBadge';
import Avatar from '../components/ui/Avatar';
import { ErrorState, PageSpinner } from '../components/ui/Feedback';

function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('article-body');
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const total = height - window.innerHeight * 0.5;
      setPct(Math.min(100, Math.max(0, ((-top + window.innerHeight * 0.3) / total) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div aria-hidden className="fixed inset-x-0 top-0 z-40 h-1 bg-transparent"><div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${pct}%` }} /></div>;
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, error, reload } = useFetch(`/articles/${slug}`);
  const { data: rel } = useFetch(`/articles/${slug}/related`, undefined, [data?.article?._id]);
  const [viewer, setViewer] = useState({ liked: false, bookmarked: false });
  const [counts, setCounts] = useState({ like: 0, bookmark: 0, comment: 0 });
  const [reporting, setReporting] = useState(false);
  const a = data?.article;

  useSeo({ title: a?.seo?.title || a?.title, description: a?.seo?.description || a?.description, image: a?.coverImage, type: 'article' });

  useEffect(() => {
    if (!a) return;
    setViewer(data.viewer);
    setCounts({ like: a.likeCount, bookmark: a.bookmarkCount, comment: a.commentCount });
    const key = `viewed:${a._id}`;
    if (a.status === 'published' && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      api.post(`/articles/${a._id}/view`).catch(() => {});
    }
  }, [a, data]);

  const jsonLd = useMemo(() => a && a.status === 'published' ? JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description,
    image: a.coverImage || undefined, datePublished: a.publishedAt, dateModified: a.updatedAt,
    author: { '@type': 'Person', name: a.author.name },
  }) : null, [a]);

  if (loading) return <PageSpinner />;
  if (error) return <div className="py-16"><ErrorState message={error} onRetry={reload} /></div>;

  const requireLogin = () => { toast.error('Log in to do that.'); navigate('/login', { state: { from: location } }); };
  const toggle = (kind) => async () => {
    if (!user) return requireLogin();
    try {
      const res = await api.post(`/articles/${a._id}/${kind}`);
      setViewer((v) => ({ ...v, [kind === 'like' ? 'liked' : 'bookmarked']: res.data.data.active }));
      setCounts((c) => ({ ...c, [kind]: res.data.data.count }));
      if (kind === 'bookmark') toast.success(res.data.data.active ? 'Saved to your bookmarks' : 'Removed from bookmarks');
    } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); toast.success('Link copied'); } catch { toast.error('Could not copy. Copy the address from your browser instead.'); }
  };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: a.title, url: window.location.href }); } catch { /* cancelled */ } } else copy();
  };

  const act = 'inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-raised';
  return (
    <>
      <ReadingProgress />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
      <div className="mx-auto max-w-6xl py-10 lg:grid lg:grid-cols-[1fr_16rem] lg:gap-12">
        <article className="mx-auto min-w-0 max-w-3xl">
          {a.status !== 'published' && (
            <div role="status" className="mb-6 rounded-lg border border-accent/60 bg-accent/10 p-4 text-sm">
              <p className="flex items-center gap-2 font-semibold">Preview <StatusBadge status={a.status} /></p>
              <p className="mt-1">Only you and reviewers can see this page.</p>
              {a.reviewNote && <p className="mt-2 whitespace-pre-line"><span className="font-medium">Reviewer note:</span> {a.reviewNote}</p>}
            </div>
          )}
          {a.category && <Link to={`/articles?category=${a.category.slug}`} className="text-sm font-medium text-muted hover:underline">{a.category.name}</Link>}
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{a.title}</h1>
          <p className="mt-3 text-lg text-muted">{a.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <Avatar user={a.author} size={40} />
            <div>
              <Link to={`/users/${a.author.username}`} className="font-semibold hover:underline">{a.author.name}</Link>
              <p className="flex flex-wrap items-center gap-x-3 text-muted">
                <span>{formatDate(a.publishedAt || a.updatedAt)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> {a.readingTime} min read</span>
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden /> {a.viewCount} views</span>
              </p>
            </div>
          </div>
          {a.coverImage && <img src={a.coverImage} alt="" className="mt-8 aspect-[16/9] w-full rounded-xl object-cover" />}

          {a.toc.length > 2 && (
            <nav aria-label="Table of contents" className="mt-8 rounded-xl border border-line p-4 lg:hidden">
              <p className="text-sm font-semibold">In this article</p>
              <ul className="mt-2 space-y-1 text-sm">{a.toc.map((t) => <li key={t.id} style={{ paddingLeft: (t.level - 2) * 14 }}><a className="text-muted hover:text-ink hover:underline" href={`#${t.id}`}>{t.text}</a></li>)}</ul>
            </nav>
          )}

          <div id="article-body" className="mt-8"><ArticleBody html={a.content} /></div>

          {a.tags.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
              {a.tags.map((t) => <li key={t._id}><Link to={`/articles?tag=${t.slug}`} className="rounded-full border border-line px-3 py-1 text-sm hover:bg-raised">#{t.name}</Link></li>)}
            </ul>
          )}

          {a.status === 'published' && (
            <>
              <div className="mt-8 flex flex-wrap gap-2 border-y border-line py-4" role="group" aria-label="Article actions">
                <button className={act} aria-pressed={viewer.liked} onClick={toggle('like')}><Heart className={`h-4 w-4 ${viewer.liked ? 'fill-current text-danger' : ''}`} aria-hidden /> {viewer.liked ? 'Liked' : 'Like'} · {counts.like}</button>
                <button className={act} aria-pressed={viewer.bookmarked} onClick={toggle('bookmark')}><Bookmark className={`h-4 w-4 ${viewer.bookmarked ? 'fill-current' : ''}`} aria-hidden /> {viewer.bookmarked ? 'Saved' : 'Save'}</button>
                <button className={act} onClick={share}><Share2 className="h-4 w-4" aria-hidden /> Share</button>
                <button className={act} onClick={copy}><LinkIcon className="h-4 w-4" aria-hidden /> Copy link</button>
                <button className={`${act} ml-auto`} onClick={() => (user ? setReporting(true) : requireLogin())}><Flag className="h-4 w-4" aria-hidden /> Report</button>
              </div>

              <div className="mt-8 flex gap-4 rounded-xl border border-line bg-surface p-5">
                <Avatar user={a.author} size={56} />
                <div className="min-w-0">
                  <p className="text-sm text-muted">Written by</p>
                  <Link to={`/users/${a.author.username}`} className="text-lg font-semibold hover:underline">{a.author.name}</Link>
                  {a.author.bio && <p className="mt-1 line-clamp-3 text-sm text-muted">{a.author.bio}</p>}
                </div>
              </div>

              <Comments articleId={a._id} onCount={(d) => setCounts((c) => ({ ...c, comment: Math.max(0, c.comment + d) }))} />
            </>
          )}
        </article>

        {a.toc.length > 2 && (
          <aside className="hidden lg:block">
            <nav aria-label="Table of contents" className="sticky top-24">
              <p className="text-sm font-semibold">In this article</p>
              <ul className="mt-3 space-y-2 border-l border-line text-sm">{a.toc.map((t) => <li key={t.id} style={{ paddingLeft: 12 + (t.level - 2) * 12 }}><a className="text-muted hover:text-ink hover:underline" href={`#${t.id}`}>{t.text}</a></li>)}</ul>
            </nav>
          </aside>
        )}
      </div>

      {a.status === 'published' && rel?.articles.length > 0 && (
        <section aria-labelledby="rel-h" className="mx-auto max-w-6xl pb-6">
          <h2 id="rel-h" className="text-xl font-bold">Keep reading</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{rel.articles.map((r) => <ArticleCard key={r._id} article={r} />)}</div>
        </section>
      )}
      <ReportDialog open={reporting} articleId={a._id} onClose={() => setReporting(false)} />
    </>
  );
}
