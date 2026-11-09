import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import useServerClock from '../hooks/useServerClock';
import ProblemWorkspace from '../components/ProblemWorkspace';
import Countdown from '../components/Countdown';

export default function ContestProblemPage() {
  const { slug, label } = useParams();
  const { data, reload } = useFetch(`/contests/${slug}`);
  const now = useServerClock(data?.serverTime);
  const c = data?.contest;
  const L = label.toUpperCase();

  const header = (
    <div className="flex h-12 items-center gap-3 border-b border-line bg-surface px-4 text-sm">
      <Link to={`/contests/${slug}`} className="flex items-center gap-1.5 hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden /> <span className="max-w-[10rem] truncate sm:max-w-xs">{c?.title || 'Contest'}</span></Link>
      <nav aria-label="Contest problems" className="flex flex-1 items-center gap-1 overflow-x-auto">
        {data?.problems?.map((p) => <Link key={p.label} to={`/contests/${slug}/problems/${p.label}`} aria-current={p.label === L ? 'page' : undefined} className={`flex items-center gap-1 rounded-lg px-2.5 py-1 ${p.label === L ? 'bg-accent font-semibold text-accent-ink' : 'hover:bg-raised'}`}>{p.label}{p.solved && <CheckCircle2 className="h-3.5 w-3.5" aria-label="solved" />}</Link>)}
      </nav>
      {c && data.viewer.standing && <span className="hidden text-xs text-muted sm:inline">{data.viewer.standing.score} pts</span>}
      {c?.state === 'running' && <span className="text-xs text-muted">Left: <Countdown target={c.endTime} now={now} className="text-sm font-semibold text-ink" /></span>}
      {c?.state === 'ended' && <span className="rounded-full border border-line px-2.5 py-0.5 text-xs">Ended: read only</span>}
      {c?.state === 'upcoming' && <span className="rounded-full border border-accent/60 px-2.5 py-0.5 text-xs">Not started</span>}
    </div>
  );
  return <ProblemWorkspace key={`${slug}-${L}`} base={`/contests/${slug}/problems/${L}`} storageId={`contest-${slug}-${L}`} mode="contest" codeUrl={(id) => `/contests/${slug}/submissions/${id}`} header={header} onSubmitted={reload} />;
}
