const MAP = {
  draft: ['Draft', 'border-line bg-raised'],
  pending: ['In review', 'border-accent/60 bg-accent/15'],
  changes_requested: ['Changes requested', 'border-accent/60 bg-accent/15'],
  rejected: ['Rejected', 'border-danger/50 bg-danger/10'],
  published: ['Published', 'border-ok/50 bg-ok/10'],
  archived: ['Archived', 'border-line bg-raised text-muted'],
};
export const STATUS_LABELS = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [k, v[0]]));

export default function StatusBadge({ status }) {
  const [label, cls] = MAP[status] || [status, 'border-line'];
  return <span className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}
