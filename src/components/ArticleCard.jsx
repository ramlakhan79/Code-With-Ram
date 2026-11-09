import { Link } from 'react-router-dom';
import { Clock, Heart, MessageSquare, Eye } from 'lucide-react';
import { formatDate } from '../utils/format';
import Avatar from './ui/Avatar';

export default function ArticleCard({ article: a }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      {a.coverImage && (
        <Link to={`/articles/${a.slug}`} tabIndex={-1} aria-hidden>
          <img src={a.coverImage} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-4">
        {a.category && <Link to={`/articles?category=${a.category.slug}`} className="mb-2 w-fit text-xs font-medium text-muted underline-offset-2 hover:underline">{a.category.name}</Link>}
        <h3 className="text-lg font-semibold leading-snug"><Link to={`/articles/${a.slug}`} className="hover:underline">{a.title}</Link></h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{a.description}</p>
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Avatar user={a.author} size={24} />
            <Link to={`/users/${a.author?.username}`} className="font-medium hover:underline">{a.author?.name}</Link>
            <span className="text-muted">· {formatDate(a.publishedAt)}</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-label="Article stats">
            <li className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> {a.readingTime} min read</li>
            <li className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden /> {a.viewCount}</li>
            <li className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" aria-hidden /> {a.likeCount}</li>
            <li className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" aria-hidden /> {a.commentCount}</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
