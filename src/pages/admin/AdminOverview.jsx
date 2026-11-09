import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import { ADMIN_NAV } from '../../constants/navigation';
import { ErrorState, Spinner } from '../../components/ui/Feedback';

function Cards() {
  const { data: o, loading, error, reload } = useFetch('/admin/analytics/overview');
  if (loading && !o) return <Spinner className="py-16" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const rate = o.problems.submissions ? Math.round((o.problems.accepted / o.problems.submissions) * 100) : 0;
  const cards = [
    ['Total users', o.users.total, `${o.users.active} active · ${o.users.last7d} new this week`, '/admin/users'],
    ['Articles', o.articles.total, `${o.articles.published} published · ${o.articles.pending} awaiting review`, '/admin/articles'],
    ['Courses', o.courses.total, `${o.courses.published} published · ${o.courses.enrollments} enrollments`, '/admin/courses'],
    ['Problems', o.problems.total, `${o.problems.published} published`, '/admin/problems'],
    ['Submissions', o.problems.submissions, `${rate}% accepted`, '/admin/submissions'],
    ['Contests', o.contests.total, `${o.contests.running} live · ${o.contests.upcoming} upcoming`, '/admin/contests'],
    ['Discussions', o.discussions.total, `${o.discussions.open} visible`, '/admin/reports'],
    ['Open reports', o.moderation.openReports, 'waiting for a moderator', '/admin/reports'],
    ['Open feedback', o.platform.feedbackOpen, 'messages to read', '/admin/feedback'],
    ['Newsletter', o.platform.subscribers, 'confirmed subscribers', '/admin/newsletter'],
  ];
  return (
    <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map(([label, value, sub, to]) => <div key={label} className="rounded-xl border border-line bg-surface p-5"><dt className="text-sm text-muted"><Link to={to} className="hover:underline">{label}</Link></dt><dd className="mt-1 font-display text-3xl font-bold">{value.toLocaleString()}</dd><p className="mt-1 text-xs text-muted">{sub}</p></div>)}
    </dl>
  );
}

export default function AdminOverview() {
  const { can } = useAuth();
  const links = ADMIN_NAV.filter((i) => i.permission && can(i.permission));
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin overview</h1>
      {can('analytics:read') ? (
        <><p className="mt-1 text-sm text-muted">Live counts across the platform. <Link to="/admin/analytics" className="underline">See trends and top content</Link>.</p><Cards /></>
      ) : (
        <><p className="mt-1 text-sm text-muted">Your role gives you access to these tools.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">{links.map(({ to, label, icon: Icon }) => <li key={to}><Link to={to} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 hover:bg-raised"><Icon className="h-5 w-5" aria-hidden /> {label}</Link></li>)}</ul></>
      )}
    </div>
  );
}
