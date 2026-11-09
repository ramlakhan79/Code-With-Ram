import { useState } from 'react';
import { Users } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { formatDate, timeAgo } from '../../utils/format';
import Pagination from '../../components/Pagination';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

export default function InstructorStudents() {
  const [page, setPage] = useState(1);
  const [courseId, setCourseId] = useState('');
  const { data: mine } = useFetch('/courses/manage/mine', { limit: 30 });
  const { data, loading, error, reload } = useFetch('/courses/manage/students', { page, limit: 20, courseId: courseId || undefined });
  return (
    <div>
      <h1 className="text-2xl font-bold">Students</h1>
      <select aria-label="Filter by course" value={courseId} onChange={(e) => { setCourseId(e.target.value); setPage(1); }} className="mt-5 h-10 rounded-lg border border-line bg-surface px-3 text-sm">
        <option value="">All my courses</option>{mine?.courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.students.length === 0 ? <EmptyState icon={Users} title="No learners yet">Learners appear here after they enroll in one of your courses.</EmptyState> : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Learner</th><th className="px-4 py-2.5 font-medium">Course</th><th className="px-4 py-2.5 font-medium">Progress</th><th className="px-4 py-2.5 font-medium">Enrolled</th><th className="px-4 py-2.5 font-medium">Last active</th></tr></thead>
              <tbody className="divide-y divide-line">
                {data.students.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-3"><p className="font-medium">{s.user?.name}</p><p className="text-xs text-muted">@{s.user?.username}</p></td>
                    <td className="px-4 py-3">{s.course?.title}</td>
                    <td className="px-4 py-3">{s.progress}%{s.completed && ' · done'}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(s.enrolledAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{timeAgo(s.lastActivityAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="learners" onPage={setPage} />
    </div>
  );
}
