import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import CourseCard from '../../components/CourseCard';
import Button from '../../components/ui/Button';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const API = import.meta.env.VITE_API_URL || '/api';

export default function MyLearning() {
  const { data, loading, error, reload } = useFetch('/courses/enrollments/mine');
  const [tab, setTab] = useState('progress');
  if (loading && !data) return <Spinner className="py-20" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const all = data.enrollments;
  const list = all.filter((e) => (tab === 'progress' ? e.progress < 100 : e.progress === 100));

  return (
    <div>
      <h1 className="text-2xl font-bold">My learning</h1>
      <div role="tablist" aria-label="Filter" className="mt-5 flex gap-2">
        {[['progress', `In progress (${all.filter((e) => e.progress < 100).length})`], ['done', `Completed (${all.filter((e) => e.progress === 100).length})`]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full border px-3 py-1 text-sm ${tab === k ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}>{l}</button>
        ))}
      </div>
      <div className="mt-6">
        {list.length === 0 ? (
          <EmptyState icon={GraduationCap} title={all.length ? 'Nothing in this list' : 'You have not enrolled in a course yet'} action={!all.length && <Link to="/courses"><Button>Browse courses</Button></Link>}>
            {all.length ? 'Switch tabs to see your other courses.' : 'Every course is free. Pick one and start learning.'}
          </EmptyState>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((e) => (
              <div key={e._id} className="flex flex-col gap-2">
                <CourseCard course={e.course} progress={e.progress} />
                <div className="flex gap-2">
                  <Link to={`/courses/${e.course.slug}/learn`} className="flex-1"><Button className="w-full" size="sm">{e.progress === 100 ? 'Review course' : e.progress ? 'Continue' : 'Start'}</Button></Link>
                  {e.certificate && <a href={`${API}/certificates/${e.certificate}/pdf`} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="secondary"><Award className="h-4 w-4" aria-hidden /> Certificate</Button></a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
