import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { timeAgo } from '../utils/format';

export default function DiscussionCard({ d }) {
  const stat = 'flex w-16 shrink-0 flex-col items-center rounded-lg px-2 py-1 text-xs';
  return (
    <li className="flex gap-4 p-4">
      <div className="hidden shrink-0 gap-2 sm:flex" aria-hidden="false">
        <div className={`${stat} text-muted`}><span className="text-base font-semibold text-ink">{d.score}</span>votes</div>
        <div className={`${stat} ${d.accepted ? 'bg-ok/15 text-ok ring-1 ring-ok/50' : d.answerCount ? 'ring-1 ring-ok/40' : ''}`}><span className="flex items-center gap-1 text-base font-semibold">{d.accepted && <Check className="h-4 w-4" aria-label="Has an accepted answer" />}{d.answerCount}</span>answers</div>
        <div className={`${stat} text-muted`}><span className="text-base font-semibold text-ink">{d.viewCount}</span>views</div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold leading-snug"><Link to={`/discussions/${d.slug}`} className="hover:underline">{d.title}</Link></h3>
        <p className="mt-1 text-xs text-muted sm:hidden">{d.score} votes · {d.answerCount} answers{d.accepted && ' · solved'}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {d.tags.map((t) => <Link key={t._id} to={`/discussions?tag=${t.slug}`} className="rounded-full border border-line px-2.5 py-0.5 text-xs hover:bg-raised">{t.name}</Link>)}
          <span className="ml-auto text-xs text-muted"><Link to={`/users/${d.author?.username}`} className="hover:underline">{d.author?.name}</Link> · {timeAgo(d.lastActivityAt || d.createdAt)}</span>
        </div>
      </div>
    </li>
  );
}
