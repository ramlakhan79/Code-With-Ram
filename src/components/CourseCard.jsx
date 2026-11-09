import { Link } from 'react-router-dom';
import { Clock, Users, BookOpen } from 'lucide-react';
import { Stars } from './StarRating';
import Avatar from './ui/Avatar';

const LEVEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
export const formatDuration = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}` : `${m}m`);

export default function CourseCard({ course: c, progress }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <Link to={`/courses/${c.slug}`} tabIndex={-1} aria-hidden>
        {c.thumbnail
          ? <img src={c.thumbnail} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
          : <div className="flex aspect-[16/9] items-center justify-center bg-raised"><BookOpen className="h-10 w-10 text-muted" aria-hidden /></div>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium text-muted">{c.category?.name}{c.category && ' · '}{LEVEL[c.difficulty]}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug"><Link to={`/courses/${c.slug}`} className="hover:underline">{c.title}</Link></h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{c.description}</p>
        <div className="mt-auto pt-4">
          {typeof progress === 'number' && (
            <div className="mb-3">
              <div className="h-2 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress"><div className="h-full bg-accent" style={{ width: `${progress}%` }} /></div>
              <p className="mt-1 text-xs text-muted">{progress}% complete</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm"><Avatar user={c.instructor} size={22} /><span className="truncate">{c.instructor?.name}</span></div>
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted" aria-label="Course details">
            {c.ratingCount > 0 && <li className="flex items-center gap-1"><Stars value={c.ratingAvg} size={13} /> {c.ratingAvg} ({c.ratingCount})</li>}
            <li className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden /> {formatDuration(c.durationMinutes)} · {c.lessonCount} lessons</li>
            <li className="flex items-center gap-1"><Users className="h-3.5 w-3.5" aria-hidden /> {c.enrollmentCount}</li>
          </ul>
        </div>
      </div>
    </article>
  );
}
