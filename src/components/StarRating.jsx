import { Star } from 'lucide-react';

export function Stars({ value = 0, size = 16 }) {
  return (
    <span className="inline-flex" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} width={size} height={size} aria-hidden className={n <= Math.round(value) ? 'fill-accent text-accent' : 'text-line'} />
      ))}
    </span>
  );
}

export function StarInput({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Your rating" className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => onChange(n)} className="rounded p-0.5">
          <Star className={`h-6 w-6 ${n <= value ? 'fill-accent text-accent' : 'text-muted'}`} aria-hidden />
        </button>
      ))}
    </div>
  );
}
