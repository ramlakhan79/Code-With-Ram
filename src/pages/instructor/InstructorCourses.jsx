import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Presentation, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api, { applyServerErrors, getErrorMessage } from '../../api/client';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import { EmptyState, ErrorState, FormError, Spinner } from '../../components/ui/Feedback';

export function CourseCreate() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const schema = z.object({ title: z.string().trim().min(5, 'Title needs at least 5 characters').max(120), description: z.string().max(5000) });
  const { register, handleSubmit, setError: setField, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { description: '' } });
  const onSubmit = async (v) => {
    setError('');
    try { const r = await api.post('/courses', v); navigate(`/dashboard/instructor/courses/${r.data.data.course._id}`, { replace: true }); } catch (e) { if (!applyServerErrors(e, setField)) setError(getErrorMessage(e)); }
  };
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">New course</h1>
      <p className="mt-1 text-sm text-muted">Start with a title. You can add everything else in the editor, and nothing is public until you publish.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <FormError>{error}</FormError>
        <Field label="Course title" error={errors.title?.message} {...register('title')} />
        <Field as="textarea" rows={4} label="Description (optional for now)" error={errors.description?.message} {...register('description')} />
        <Button type="submit" loading={isSubmitting}>Create course</Button>
      </form>
    </div>
  );
}

export default function InstructorCourses() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch('/courses/manage/mine', { page, limit: 10 });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Teaching</h1>
        <Link to="/dashboard/instructor/courses/create"><Button><Plus className="h-4 w-4" aria-hidden /> New course</Button></Link>
      </div>
      <div className="mt-6">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.courses.length === 0 ? (
          <EmptyState icon={Presentation} title="You have not created a course yet" action={<Link to="/dashboard/instructor/courses/create"><Button>Create your first course</Button></Link>}>Courses have sections, lessons, quizzes and assignments. Learners get a certificate when they finish.</EmptyState>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {data.courses.map((c) => (
              <li key={c._id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <Link to={`/dashboard/instructor/courses/${c._id}`} className="font-semibold hover:underline">{c.title}</Link>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted"><StatusBadge status={c.status} /> <span>{c.lessonCount} lessons</span><span>{c.enrollmentCount} learners</span>{c.ratingCount > 0 && <span>{c.ratingAvg} ★ ({c.ratingCount})</span>}<span>Updated {formatDate(c.updatedAt)}</span></p>
                </div>
                <Link to={`/dashboard/instructor/courses/${c._id}`}><Button size="sm" variant="secondary">Manage</Button></Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="courses" onPage={setPage} />
    </div>
  );
}
