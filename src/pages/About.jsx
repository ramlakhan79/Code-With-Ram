import { Link } from 'react-router-dom';
import { BookOpen, Code2, FileText, MessagesSquare, Trophy, Award } from 'lucide-react';
import useSeo from '../hooks/useSeo';

const PARTS = [
  [FileText, 'Articles', 'Read and write technical posts. Contributors submit, editors review, readers learn.', '/articles'],
  [BookOpen, 'Courses', 'Structured lessons with quizzes, assignments and a verifiable certificate.', '/courses'],
  [Code2, 'Practice', 'Solve problems in Java, C++, C, Python or JavaScript, run in an isolated judge.', '/practice'],
  [Trophy, 'Contests', 'Timed rounds with live leaderboards and server-kept clocks.', '/contests'],
  [MessagesSquare, 'Discussions', 'Ask questions, share answers and earn reputation.', '/discussions'],
  [Award, 'Achievements', 'Points, badges and leaderboards that reward real progress.', '/leaderboard'],
];

export default function About() {
  useSeo({ title: 'About', description: 'Code With Ram is a free place to learn, practice and compete with other developers.' });
  return (
    <div className="mx-auto max-w-4xl py-12">
      <h1 className="text-4xl font-bold">Learn, practice and grow with other developers</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">Code With Ram brings reading, learning, coding practice, contests and a developer community into one free platform, so you do not have to jump between five different sites to get better at programming.</p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {PARTS.map(([Icon, name, text, to]) => <li key={name} className="rounded-xl border border-line bg-surface p-5"><Icon className="h-6 w-6 text-muted" aria-hidden /><h2 className="mt-3 text-lg font-semibold"><Link to={to} className="hover:underline">{name}</Link></h2><p className="mt-1 text-sm text-muted">{text}</p></li>)}
      </ul>
      <section className="mt-12" aria-labelledby="princ-h">
        <h2 id="princ-h" className="text-2xl font-bold">What we care about</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted">
          <li><strong className="text-ink">Free to start.</strong> No paid APIs are needed to run the platform, and learning is never behind a paywall.</li>
          <li><strong className="text-ink">Fair play.</strong> Contest clocks and judging happen on the server, and points follow real outcomes.</li>
          <li><strong className="text-ink">Respect.</strong> Moderators and clear rules keep the community helpful.</li>
          <li><strong className="text-ink">Accessible.</strong> The site works on phones and laptops, with keyboard and screen reader support.</li>
        </ul>
      </section>
      <p className="mt-10 text-sm text-muted">Questions or ideas? <Link to="/contact" className="underline">Get in touch</Link>.</p>
    </div>
  );
}
