const pad = (n) => String(n).padStart(2, '0');
export function formatRemaining(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  return `${d ? `${d}d ` : ''}${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

// aria-live is off on purpose: a screen reader announcing every second would be unusable
export default function Countdown({ target, now, className = '' }) {
  return <span role="timer" aria-live="off" className={`font-mono tabular-nums ${className}`}>{formatRemaining(new Date(target).getTime() - now())}</span>;
}
