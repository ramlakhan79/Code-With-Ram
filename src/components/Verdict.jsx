const VERDICTS = {
  accepted: ['Accepted', 'border-ok/50 bg-ok/10'],
  ok: ['Passed', 'border-ok/50 bg-ok/10'],
  wrong_answer: ['Wrong answer', 'border-danger/50 bg-danger/10'],
  time_limit_exceeded: ['Time limit exceeded', 'border-accent/60 bg-accent/15'],
  runtime_error: ['Runtime error', 'border-danger/50 bg-danger/10'],
  compile_error: ['Compile error', 'border-danger/50 bg-danger/10'],
  internal_error: ['Judge error', 'border-line bg-raised'],
};
export const VERDICT_LABELS = Object.fromEntries(Object.entries(VERDICTS).map(([k, v]) => [k, v[0]]));

export function VerdictBadge({ verdict }) {
  const [label, cls] = VERDICTS[verdict] || [verdict, 'border-line'];
  return <span className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

const LEVELS = { easy: ['Easy', 'border-ok/50 bg-ok/10'], medium: ['Medium', 'border-accent/60 bg-accent/15'], hard: ['Hard', 'border-danger/50 bg-danger/10'] };
export function DifficultyBadge({ difficulty }) {
  const [label, cls] = LEVELS[difficulty] || [difficulty, 'border-line'];
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}
