import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BREADCRUMB_LABELS, NON_LINK_SEGMENTS } from '../constants/navigation';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter((p) => p && !/^[a-f0-9]{24}$/i.test(p)); // hide record ids
  if (parts.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {parts.map((p, i) => {
          const to = `/${parts.slice(0, i + 1).join('/')}`;
          const label = BREADCRUMB_LABELS[p] || p;
          const last = i === parts.length - 1;
          return (
            <li key={to} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
              {last || NON_LINK_SEGMENTS.includes(p) ? <span aria-current={last ? 'page' : undefined} className={last ? 'text-ink' : ''}>{label}</span> : <Link className="hover:text-ink" to={to}>{label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
