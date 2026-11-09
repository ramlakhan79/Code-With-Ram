import { Link } from 'react-router-dom';

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 font-display text-lg font-bold ${className}`} aria-label="Code With Ram, home">
      <span aria-hidden className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-accent font-mono text-xs font-bold text-accent-ink">{'</>'}</span>
      Code With Ram
    </Link>
  );
}
