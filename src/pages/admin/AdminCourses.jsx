import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

export default function AdminCourses() {
  const toast = useToast();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [dq, setDq] = useState('');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null);
  useEffect(() => { const t = setTimeout(() => { setDq(q); setPage(1); }, 350); return () => clearTimeout(t); }, [q]);
  const { data, loading, error, reload } = useFetch('/courses/admin/list', { status: status || undefined, q: dq || undefined, page, limit: 15 });

  const run = async () => {
    const { course, action } = confirm;
    setConfirm(null);
    try {
      if (action === 'delete') await api.delete(`/courses/manage/${course._id}`); else await api.post(`/courses/manage/${course._id}/${action}`);
      toast.success('Done'); reload();
    } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const COPY = { unpublish: 'It disappears for everyone, including enrolled learners, until the instructor publishes it again.', archive: 'It leaves the catalog. Enrolled learners keep access.', delete: 'The course, its lessons and learner progress are permanently deleted. Issued certificates stay valid.' };

  return (
    <div>
      <h1 className="text-2xl font-bold">Courses</h1>
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden /><input aria-label="Search by title" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title" className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm" /></div>
        <select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-10 rounded-lg border border-line bg-surface px-3 text-sm"><option value="">Any status</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select>
      </div>
      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.courses.length === 0 ? <EmptyState title="No courses match">Try another status or clear the search.</EmptyState> : (
          <div className="overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Course</th><th className="px-4 py-2.5 font-medium">Instructor</th><th className="px-4 py-2.5 font-medium">Status</th><th className="px-4 py-2.5 font-medium">Learners</th><th className="px-4 py-2.5 font-medium">Updated</th><th className="px-4 py-2.5"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody className="divide-y divide-line">
                {data.courses.map((c) => (
                  <tr key={c._id}>
                    <td className="max-w-xs px-4 py-3"><Link to={`/courses/${c.slug}`} className="block truncate font-medium hover:underline">{c.title}</Link></td>
                    <td className="px-4 py-3">{c.instructor?.name}</td><td className="px-4 py-3"><StatusBadge status={c.status} /></td><td className="px-4 py-3">{c.enrollmentCount}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(c.updatedAt)}</td>
                    <td className="px-4 py-3"><div className="flex justify-end gap-2">
                      {c.status === 'published' && <Button size="sm" variant="secondary" onClick={() => setConfirm({ course: c, action: 'unpublish' })}>Unpublish</Button>}
                      {c.status === 'published' && <Button size="sm" variant="secondary" onClick={() => setConfirm({ course: c, action: 'archive' })}>Archive</Button>}
                      <Button size="sm" variant="ghost" onClick={() => setConfirm({ course: c, action: 'delete' })}>Delete</Button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="courses" onPage={setPage} />
      <ConfirmDialog open={Boolean(confirm)} danger title={confirm ? `${confirm.action[0].toUpperCase()}${confirm.action.slice(1)} “${confirm.course.title}”?` : ''} confirmLabel={confirm?.action} onConfirm={run} onCancel={() => setConfirm(null)}>{confirm && COPY[confirm.action]}</ConfirmDialog>
    </div>
  );
}
