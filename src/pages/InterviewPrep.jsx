import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';

const WEEKS = [
  ['Week 1: Foundations', 'Arrays, Strings, Two Pointers and Sliding Window. Solve 10 easy problems and explain each solution out loud.'],
  ['Week 2: Core structures', 'Linked Lists, Stack, Queue, Binary Search and Sorting. Mix easy and medium, and review the editorial after every solved problem.'],
  ['Week 3: Recursion and trees', 'Recursion, Backtracking, Trees and Binary Search Trees. Draw the call stack on paper before coding.'],
  ['Week 4: Harder patterns', 'Graphs, Dynamic Programming, Greedy and Heap. Take one live contest to practise under time pressure.'],
];

export default function InterviewPrep() {
  useSeo({ title: 'Interview preparation', description: 'A four-week plan to prepare for coding interviews using practice problems, contests and courses.' });
  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold">Interview preparation</h1>
      <p className="mt-1 text-muted">A simple plan that uses what is already on the platform. Adjust the pace to your schedule.</p>

      <ol className="mt-8 space-y-4">{WEEKS.map(([t, d]) => <li key={t} className="rounded-xl border border-line bg-surface p-5"><h2 className="font-semibold">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></li>)}</ol>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="how-h" className="rounded-xl border border-line p-5">
          <h2 id="how-h" className="font-semibold">Practise like the real thing</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Use the <Link to="/practice" className="underline">daily problem</Link> to build a habit. A 7-day streak earns a badge.</li>
            <li>Time yourself: 20 minutes for easy, 35 for medium. Stop and read the hints if you are stuck.</li>
            <li>Join a <Link to="/contests" className="underline">contest</Link> to get used to pressure and to partial progress.</li>
            <li>Explain your approach before you code, then state time and space complexity.</li>
          </ul>
        </section>
        <section aria-labelledby="learn-h" className="rounded-xl border border-line p-5">
          <h2 id="learn-h" className="font-semibold">Fill the gaps</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Brush up on <Link to="/courses?category=dsa" className="underline">DSA</Link>, <Link to="/courses?category=dbms" className="underline">databases</Link> and <Link to="/courses?category=system-design" className="underline">system design</Link>.</li>
            <li>Read <Link to="/articles" className="underline">articles</Link> for worked examples, and ask in <Link to="/discussions" className="underline">discussions</Link> when something does not click.</li>
            <li>Follow the <Link to="/roadmaps" className="underline">DSA roadmap</Link> so you do not skip a topic.</li>
          </ul>
        </section>
        <section aria-labelledby="beh-h" className="rounded-xl border border-line p-5">
          <h2 id="beh-h" className="font-semibold">Behavioural questions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Prepare 4 or 5 short stories: a challenge, a conflict, a failure, a project you led, a time you learned something fast.</li>
            <li>Structure each as situation, task, action, result, and keep it under two minutes.</li>
          </ul>
        </section>
        <section aria-labelledby="cv-h" className="rounded-xl border border-line p-5">
          <h2 id="cv-h" className="font-semibold">Resume and portfolio</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Keep it to one page. Lead with projects and measurable results.</li>
            <li>Link your public profile here: it shows your badges, solved problems and published work.</li>
            <li>Make sure your GitHub projects have a clear README and a live demo.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
