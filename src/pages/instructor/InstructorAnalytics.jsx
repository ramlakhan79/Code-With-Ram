import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useFetch from '../../hooks/useFetch';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

export default function InstructorAnalytics() {
  const { data, loading, error, reload } = useFetch('/courses/manage/overview');
  if (loading && !data) return <Spinner className="py-20" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const totalLearners = data.courses.reduce((n, c) => n + c.enrollmentCount, 0);
  const totalDone = data.courses.reduce((n, c) => n + c.completed, 0);
  const rated = data.courses.filter((c) => c.ratingCount > 0);
  const avg = rated.length ? (rated.reduce((n, c) => n + c.ratingAvg * c.ratingCount, 0) / rated.reduce((n, c) => n + c.ratingCount, 0)).toFixed(1) : 'n/a';
  const series = data.series.map((d) => ({ ...d, label: d.date.slice(5) }));

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      {data.courses.length === 0 ? <div className="mt-6"><EmptyState title="No courses yet">Create a course to see enrollments, completion and ratings here.</EmptyState></div> : (
        <>
          <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[['Courses', data.courses.length], ['Learners', totalLearners], ['Completions', totalDone], ['Average rating', avg]].map(([l, v]) => <div key={l} className="rounded-xl border border-line bg-surface p-4"><dt className="text-sm text-muted">{l}</dt><dd className="mt-1 font-display text-2xl font-bold">{v}</dd></div>)}
          </dl>
          <section aria-labelledby="enr-h" className="mt-6 rounded-xl border border-line bg-surface p-4">
            <h2 id="enr-h" className="text-sm font-semibold">New enrollments, last 30 days</h2>
            <div className="mt-3 h-56" role="img" aria-label="Bar chart of daily new enrollments over the last 30 days">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series} margin={{ left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'rgb(var(--muted))' }} interval={4} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} />
                  <Tooltip contentStyle={{ background: 'rgb(var(--surface))', border: '1px solid rgb(var(--line))', borderRadius: 8 }} />
                  <Bar dataKey="enrollments" name="Enrollments" fill="rgb(var(--accent))" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <div className="mt-6 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Course</th><th className="px-4 py-2.5 font-medium">Learners</th><th className="px-4 py-2.5 font-medium">Completed</th><th className="px-4 py-2.5 font-medium">Completion rate</th><th className="px-4 py-2.5 font-medium">Rating</th></tr></thead>
              <tbody className="divide-y divide-line">
                {data.courses.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3"><Link className="font-medium hover:underline" to={`/dashboard/instructor/courses/${c._id}`}>{c.title}</Link></td>
                    <td className="px-4 py-3">{c.enrollmentCount}</td><td className="px-4 py-3">{c.completed}</td>
                    <td className="px-4 py-3">{c.enrollmentCount ? `${Math.round((c.completed / c.enrollmentCount) * 100)}%` : 'n/a'}</td>
                    <td className="px-4 py-3">{c.ratingCount ? `${c.ratingAvg} (${c.ratingCount})` : 'No ratings'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
