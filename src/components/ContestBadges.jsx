const STATE = {
  running: ['Live', 'border-ok/50 bg-ok/10'],
  upcoming: ['Upcoming', 'border-accent/60 bg-accent/15'],
  ended: ['Ended', 'border-line bg-raised text-muted'],
};
export function StateBadge({ state }) {
  const [label, cls] = STATE[state] || [state, 'border-line'];
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}
export const TYPE_LABELS = { weekly: 'Weekly', biweekly: 'Biweekly', monthly: 'Monthly', topic: 'Topic', beginner: 'Beginner friendly' };
export const fmtRange = (s, e) => `${new Date(s).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} to ${new Date(e).toLocaleString(undefined, { timeStyle: 'short' })}`;
