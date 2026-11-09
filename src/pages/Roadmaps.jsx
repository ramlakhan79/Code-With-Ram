import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';

const PATHS = [
  { title: 'Web developer', steps: [['JavaScript', 'javascript'], ['React', 'react'], ['Node.js', 'node-js'], ['MERN Stack', 'mern-stack'], ['SQL and databases', 'sql'], ['System Design', 'system-design']] },
  { title: 'Software engineer foundations', steps: [['Python or Java', 'python'], ['Data structures and algorithms', 'dsa'], ['Databases', 'dbms'], ['Operating Systems', 'operating-systems'], ['Computer Networks', 'computer-networks']] },
  { title: 'Systems and C-family', steps: [['C', 'c'], ['C++', 'cplusplus'], ['Operating Systems', 'operating-systems'], ['Computer Networks', 'computer-networks']] },
];

export default function Roadmaps() {
  const { user } = useAuth();
  useSeo({ title: 'Roadmaps', description: 'Learning paths and a topic-by-topic data structures and algorithms roadmap.' });
  const { data: meta } = useFetch('/practice/topics');
  const { data: stats } = useFetch(user ? '/practice/stats/me' : null, { tz: Intl.DateTimeFormat().resolvedOptions().timeZone });
  const progress = new Map((stats?.byTopic || []).map((t) => [t.topic, t]));

  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold">Roadmaps</h1>
      <p className="mt-1 text-muted">Pick a direction, then work through it step by step. Each step links to courses you can take here.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {PATHS.map((p) => (
          <section key={p.title} aria-labelledby={`p-${p.title}`} className="rounded-xl border border-line bg-surface p-5">
            <h2 id={`p-${p.title}`} className="font-semibold">{p.title}</h2>
            <ol className="mt-3 space-y-2 text-sm">{p.steps.map(([label, slug], i) => <li key={label} className="flex gap-2"><span className="w-5 text-muted">{i + 1}.</span><Link to={`/courses?category=${slug}`} className="hover:underline">{label}</Link></li>)}</ol>
          </section>
        ))}
      </div>

      <section className="mt-12" aria-labelledby="dsa-h">
        <h2 id="dsa-h" className="text-2xl font-bold">Data structures and algorithms, topic by topic</h2>
        <p className="mt-1 text-sm text-muted">{user ? 'Your solved count for each topic is shown next to it.' : 'Log in to see your progress on each topic.'} Aim to solve a handful of easy problems before moving on.</p>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {meta?.topics.map((t, i) => {
            const pr = progress.get(t);
            const done = pr && pr.total > 0 && pr.solved === pr.total;
            return (
              <li key={t}><Link to={`/practice?topic=${encodeURIComponent(t)}`} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 hover:bg-raised">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${done ? 'bg-ok/20 text-ok' : 'bg-raised'}`}>{done ? <Check className="h-4 w-4" aria-label="Completed" /> : i + 1}</span>
                <span className="flex-1 font-medium">{t}</span>{pr && <span className="text-xs text-muted">{pr.solved}/{pr.total}</span>}
              </Link></li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
