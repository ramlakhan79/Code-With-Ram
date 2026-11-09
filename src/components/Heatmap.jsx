const LEVELS = ['bg-raised', 'bg-accent/30', 'bg-accent/55', 'bg-accent/80', 'bg-accent'];
const level = (n) => (n === 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 7 ? 3 : 4);
const shift = (ymd, d) => { const t = new Date(`${ymd}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + d); return t.toISOString().slice(0, 10); };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// GitHub-style activity grid for the last 52 weeks. `data` is [{date: 'YYYY-MM-DD', count}].
export default function Heatmap({ data, timezone = 'UTC', noun = 'submissions' }) {
  const counts = new Map(data.map((d) => [d.date, d.count]));
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date());
  const dow = new Date(`${today}T00:00:00Z`).getUTCDay();
  const start = shift(today, -(52 * 7 + dow));
  const cells = Array.from({ length: 52 * 7 + dow + 1 }, (_, i) => { const date = shift(start, i); return { date, count: counts.get(date) || 0 }; });
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const total = cells.reduce((n, c) => n + c.count, 0);

  return (
    <figure>
      <div className="overflow-x-auto pb-2">
        <div role="img" aria-label={`${total} ${noun} in the last year`} className="inline-block min-w-max">
          <div aria-hidden className="mb-1 flex gap-1 text-[10px] text-muted">
            {weeks.map((w, i) => { const m = Number(w[0].date.slice(5, 7)) - 1; const prev = i > 0 ? Number(weeks[i - 1][0].date.slice(5, 7)) - 1 : -1; return <span key={w[0].date} className="w-3">{m !== prev ? MONTHS[m] : ''}</span>; })}
          </div>
          <div aria-hidden className="flex gap-1">
            {weeks.map((w) => (
              <div key={w[0].date} className="grid grid-rows-7 gap-1">
                {w.map((c) => <span key={c.date} title={`${c.count} ${noun} on ${c.date}`} className={`h-3 w-3 rounded-sm ${LEVELS[level(c.count)]}`} />)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mt-1 flex items-center justify-between text-xs text-muted">
        <span>{total} {noun} in the last year</span>
        <span aria-hidden className="flex items-center gap-1">Less {LEVELS.map((c) => <span key={c} className={`h-3 w-3 rounded-sm ${c}`} />)} More</span>
      </figcaption>
    </figure>
  );
}
