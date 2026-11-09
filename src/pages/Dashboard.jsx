import { Link } from 'react-router-dom';
import { Check, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { ROLE_LABELS } from '../constants/navigation';

const MODULES = [
  { name: 'Accounts, roles and security', ready: true },
  { name: 'Articles and editorial review', ready: true },
  { name: 'Courses and progress tracking', ready: true },
  { name: 'Coding practice', ready: true },
  { name: 'Contests', ready: true },
  { name: 'Community Q&A', ready: true },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data: sessions } = useFetch('/auth/sessions');
  const { data: game } = useFetch('/gamification/me');
  const { data: contests } = useFetch('/contests', { state: 'upcoming', limit: 3 });
  const { data: practice } = useFetch('/practice/stats/me', { tz: Intl.DateTimeFormat().resolvedOptions().timeZone });

  // Completeness is computed from real profile fields
  const checks = [
    { label: 'Add a profile photo', done: Boolean(user.avatar) },
    { label: 'Write a short bio', done: Boolean(user.bio) },
    { label: 'Add your location', done: Boolean(user.location) },
    { label: 'List your skills', done: user.skills.length > 0 },
    { label: 'Link your GitHub', done: Boolean(user.githubUrl) },
  ];
  const done = checks.filter((c) => c.done).length;

  return (
    <div>
      <h1 className="text-2xl font-bold sm:text-3xl">Welcome, {user.name.split(' ')[0]}</h1>
      <p className="mt-1 text-muted">Your learning, practice and contest activity will collect here as those features go live.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-line bg-surface p-5" aria-labelledby="profile-h">
          <h2 id="profile-h" className="text-lg font-semibold">Complete your profile</h2>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={checks.length} aria-label="Profile completion">
            <div className="h-full bg-accent" style={{ width: `${(done / checks.length) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">{done} of {checks.length} done</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                {c.done ? <Check className="h-4 w-4 text-ok" aria-hidden /> : <Circle className="h-4 w-4 text-muted" aria-hidden />}
                <span className={c.done ? 'text-muted line-through' : ''}>{c.label}</span>
              </li>
            ))}
          </ul>
          {done < checks.length && <Link to="/dashboard/profile" className="mt-4 inline-block text-sm font-medium underline">Edit profile</Link>}
        </section>

        <section className="rounded-xl border border-line bg-surface p-5" aria-labelledby="acct-h">
          <h2 id="acct-h" className="text-lg font-semibold">Your account</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Email</dt><dd className="truncate">{user.email}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Roles</dt><dd>{user.roles.map((r) => ROLE_LABELS[r] || r).join(', ')}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Member since</dt><dd>{new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Signed-in devices</dt><dd>{sessions ? sessions.sessions.length : '…'}</dd></div>
          </dl>
          <Link to="/dashboard/settings" className="mt-4 inline-block text-sm font-medium underline">Manage security</Link>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 md:col-span-2" aria-labelledby="game-h">
          <h2 id="game-h" className="text-lg font-semibold">Achievements</h2>
          {game ? (
            <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-muted">Level</dt><dd className="font-display text-2xl font-bold">{game.level}</dd></div>
              <div><dt className="text-muted">Points</dt><dd className="font-display text-2xl font-bold">{game.points.toLocaleString()}</dd></div>
              <div><dt className="text-muted">Badges</dt><dd className="font-display text-2xl font-bold">{game.badges.filter((b) => b.earned).length}/{game.badges.length}</dd></div>
            </dl>
          ) : <p className="mt-3 text-sm text-muted">Loading…</p>}
          <div className="mt-4 flex gap-4 text-sm"><Link to="/dashboard/achievements" className="font-medium underline">All badges</Link><Link to="/leaderboard" className="font-medium underline">Leaderboard</Link></div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 md:col-span-2" aria-labelledby="prac-h">
          <h2 id="prac-h" className="text-lg font-semibold">Practice</h2>
          {practice ? (
            <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
              <div><dt className="text-muted">Problems solved</dt><dd className="font-display text-2xl font-bold">{practice.solved}</dd></div>
              <div><dt className="text-muted">Current streak</dt><dd className="font-display text-2xl font-bold">{practice.streak.current} d</dd></div>
              <div><dt className="text-muted">Accuracy</dt><dd className="font-display text-2xl font-bold">{practice.accuracy}%</dd></div>
            </dl>
          ) : <p className="mt-3 text-sm text-muted">Loading your progress…</p>}
          <div className="mt-4 flex gap-4 text-sm"><Link to="/practice" className="font-medium underline">Find a problem</Link><Link to="/dashboard/submissions" className="font-medium underline">See all progress</Link></div>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 md:col-span-2" aria-labelledby="cont-h">
          <h2 id="cont-h" className="text-lg font-semibold">Upcoming contests</h2>
          {!contests ? <p className="mt-3 text-sm text-muted">Loading…</p> : contests.contests.length === 0 ? <p className="mt-3 text-sm text-muted">No contests are scheduled right now.</p> : (
            <ul className="mt-3 space-y-2 text-sm">{contests.contests.map((c) => <li key={c._id} className="flex flex-wrap items-center gap-2"><Link to={`/contests/${c.slug}`} className="font-medium underline">{c.title}</Link><span className="text-muted">{new Date(c.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>{c.registered && <span className="rounded-full border border-ok/50 bg-ok/10 px-2 py-0.5 text-xs">Registered</span>}</li>)}</ul>
          )}
          <Link to="/contests" className="mt-4 inline-block text-sm font-medium underline">All contests</Link>
        </section>

        <section className="rounded-xl border border-line bg-surface p-5 md:col-span-2" aria-labelledby="road-h">
          <h2 id="road-h" className="text-lg font-semibold">What's available</h2>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {MODULES.map((m) => (
              <li key={m.name} className="flex items-center gap-2">
                {m.ready ? <Check className="h-4 w-4 text-ok" aria-hidden /> : <Circle className="h-4 w-4 text-muted" aria-hidden />}
                <span className={m.ready ? '' : 'text-muted'}>{m.name}</span>
                <span className="ml-auto text-xs text-muted">{m.ready ? 'Live' : 'Coming soon'}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
