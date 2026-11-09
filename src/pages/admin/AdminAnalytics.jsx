import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useFetch from '../../hooks/useFetch';
import { ErrorState, Spinner } from '../../components/ui/Feedback';

const tip = { background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', borderRadius: 8 };
const tick = { fontSize: 10, fill: 'rgb(var(--muted))' };

function Chart({ title, data, kind = 'line', color }) {
  const rows = data.map((d) => ({ ...d, label: d.date.slice(5) }));
  const total = rows.reduce((n, r) => n + r.count, 0);
  const C = kind === 'bar' ? BarChart : LineChart;
  return (
    <section aria-label={`${title}, last 30 days: ${total} in total`} className="rounded-xl border border-line bg-surface p-4">
      <h2 className="text-sm font-semibold">{title} <span className="font-normal text-muted">· {total} in 30 days</span></h2>
      <div className="mt-3 h-48" role="img" aria-label={`${kind} chart of daily ${title.toLowerCase()} over the last 30 days`}>
        <ResponsiveContainer width="100%" height="100%">
          <C data={rows} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" /><XAxis dataKey="label" tick={tick} interval={4} /><YAxis allowDecimals={false} tick={tick} /><Tooltip contentStyle={tip} />
            {kind === 'bar' ? <Bar dataKey="count" name={title} fill={color} radius={[3, 3, 0, 0]} /> : <Line type="monotone" dataKey="count" name={title} stroke={color} strokeWidth={2} dot={false} />}
          </C>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default function AdminAnalytics() {
  const { data, loading, error, reload } = useFetch('/admin/analytics/series');
  if (loading && !data) return <Spinner className="py-20" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-1 text-sm text-muted">The last 30 days, in UTC. For visitor traffic, use your Umami dashboard if you have set it up.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Chart title="New users" data={data.signups} color="rgb(var(--accent))" />
        <Chart title="Practice submissions" data={data.submissions} color="rgb(var(--focus))" />
        <Chart title="Course enrollments" data={data.enrollments} kind="bar" color="rgb(var(--accent))" />
        <Chart title="New questions" data={data.questions} kind="bar" color="rgb(var(--focus))" />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="ta-h" className="rounded-xl border border-line bg-surface p-4"><h2 id="ta-h" className="text-sm font-semibold">Most read articles</h2>
          {data.topArticles.length === 0 ? <p className="mt-3 text-sm text-muted">Nothing published yet.</p> : <ol className="mt-3 space-y-2 text-sm">{data.topArticles.map((a) => <li key={a._id} className="flex justify-between gap-3"><Link to={`/articles/${a.slug}`} className="min-w-0 truncate hover:underline">{a.title}</Link><span className="shrink-0 text-muted">{a.viewCount} views</span></li>)}</ol>}</section>
        <section aria-labelledby="tc-h" className="rounded-xl border border-line bg-surface p-4"><h2 id="tc-h" className="text-sm font-semibold">Most popular courses</h2>
          {data.topCourses.length === 0 ? <p className="mt-3 text-sm text-muted">No courses published yet.</p> : <ol className="mt-3 space-y-2 text-sm">{data.topCourses.map((c) => <li key={c._id} className="flex justify-between gap-3"><Link to={`/courses/${c.slug}`} className="min-w-0 truncate hover:underline">{c.title}</Link><span className="shrink-0 text-muted">{c.enrollmentCount} learners</span></li>)}</ol>}</section>
      </div>
    </div>
  );
}
