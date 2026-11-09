import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bookmark, Check, CheckCircle2, Circle, ListChecks, Video, FileText, ClipboardList, Award } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import { timeAgo } from '../utils/format';
import LessonContent from '../components/LessonContent';
import QuizPlayer from '../components/QuizPlayer';
import AssignmentPanel from '../components/AssignmentPanel';
import ThemeToggle from '../components/ThemeToggle';
import Button from '../components/ui/Button';
import { ErrorState, PageSpinner, Spinner } from '../components/ui/Feedback';

const ICON = { video: Video, text: FileText, quiz: ListChecks, assignment: ClipboardList };
const API = import.meta.env.VITE_API_URL || '/api';

function Announcements({ slug }) {
  const { data } = useFetch(`/courses/${slug}/announcements`);
  if (!data?.announcements.length) return null;
  return (
    <details className="mt-4 rounded-xl border border-line">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">Announcements ({data.announcements.length})</summary>
      <ul className="divide-y divide-line border-t border-line">
        {data.announcements.map((a) => <li key={a._id} className="p-4 text-sm"><p className="font-medium">{a.title}</p><p className="mt-1 whitespace-pre-line text-muted">{a.body}</p><p className="mt-1 text-xs text-muted">{a.author?.name} · {timeAgo(a.createdAt)}</p></li>)}
      </ul>
    </details>
  );
}

export default function CoursePlayer() {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(`/courses/${slug}/learn`);
  const { data: ld, loading: ll, error: le, reload: reloadLesson } = useFetch(lessonId ? `/courses/lessons/${lessonId}` : null);
  const [busy, setBusy] = useState(false);
  useSeo({ title: data?.course.title ? `Learn: ${data.course.title}` : undefined, description: 'Course lesson' });

  useEffect(() => {
    if (data && !lessonId && data.resumeLessonId) navigate(`/courses/${slug}/learn/${data.resumeLessonId}`, { replace: true });
  }, [data, lessonId, slug, navigate]);

  if (loading && !data) return <PageSpinner />;
  if (error) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <ErrorState message={error} onRetry={reload} />
        <Link to={`/courses/${slug}`} className="mt-4 inline-block text-sm underline">Go to the course page</Link>
      </div>
    );
  }
  const flat = data.sections.flatMap((s) => s.lessons);
  const idx = flat.findIndex((l) => l._id === lessonId);
  const prev = flat[idx - 1];
  const next = flat[idx + 1];
  const lesson = ld?.lesson;
  const go = (l) => navigate(`/courses/${slug}/learn/${l._id}`);
  const refresh = () => { reload(); reloadLesson(); };

  const complete = async (done, thenNext) => {
    setBusy(true);
    try {
      const res = await api.post(`/courses/lessons/${lessonId}/complete`, { done });
      if (res.data.data.progress.certificate && !data.certificate) toast.success('Course complete! Your certificate is ready.');
      refresh();
      if (thenNext && next) go(next);
    } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };
  const bookmark = async () => {
    try { const r = await api.post(`/courses/lessons/${lessonId}/bookmark`); toast.success(r.data.data.bookmarked ? 'Lesson bookmarked' : 'Bookmark removed'); reload(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const current = flat[idx];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-bg/90 px-4 backdrop-blur">
        <Link to={`/courses/${slug}`} className="flex items-center gap-1.5 text-sm hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden /> Course page</Link>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold">{data.course.title}</p>
        <div className="hidden w-32 sm:block"><div className="h-2 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={data.progress.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress"><div className="h-full bg-accent" style={{ width: `${data.progress.percent}%` }} /></div></div>
        <span className="text-xs text-muted">{data.progress.percent}%</span>
        <ThemeToggle />
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 lg:grid-cols-[1fr_20rem]">
        <main id="main" className="min-w-0">
          {data.preview && <p role="status" className="mb-4 rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm">Preview mode: you are not enrolled, so progress is not saved.</p>}
          {data.certificate && (
            <div role="status" className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-ok/50 bg-ok/10 p-3 text-sm">
              <Award className="h-5 w-5 text-ok" aria-hidden /> <span className="font-medium">You completed this course.</span>
              <a className="underline" href={`${API}/certificates/${data.certificate}/pdf`} target="_blank" rel="noopener noreferrer">Download certificate</a>
              <Link className="underline" to={`/certificates/${data.certificate}`}>Verification page</Link>
            </div>
          )}

          {!lessonId || ((!ld || ld.lesson._id !== lessonId) && !le) ? <Spinner className="py-24" /> : le ? <ErrorState message={le} onRetry={reloadLesson} /> : lesson && (
            <article>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-sm text-muted capitalize">{lesson.type}{lesson.durationMinutes > 0 && ` · ${lesson.durationMinutes} min`}</p><h1 className="mt-1 text-2xl font-bold">{lesson.title}</h1></div>
                {!data.preview && <Button variant="ghost" size="sm" onClick={bookmark} aria-pressed={Boolean(current?.bookmarked)}><Bookmark className={`h-4 w-4 ${current?.bookmarked ? 'fill-current' : ''}`} aria-hidden /> {current?.bookmarked ? 'Bookmarked' : 'Bookmark'}</Button>}
              </div>
              <div className="mt-6">
                {lesson.type === 'quiz' ? <QuizPlayer key={lesson._id} lesson={lesson} lastAttempt={ld.attempt} onResult={(r) => { if (r.passed) refresh(); }} />
                  : lesson.type === 'assignment' ? <AssignmentPanel key={lesson._id} lesson={lesson} submission={ld.submission} onSubmitted={refresh} />
                  : <LessonContent lesson={lesson} />}
                {['quiz', 'assignment'].includes(lesson.type) && <div className="mt-6"><LessonContent lesson={{ ...lesson, type: 'resources' }} /></div>}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
                {prev && <Button variant="secondary" onClick={() => go(prev)}><ArrowLeft className="h-4 w-4" aria-hidden /> Previous</Button>}
                {['video', 'text'].includes(lesson.type) && !data.preview && (
                  ld.completed ? <Button variant="secondary" loading={busy} onClick={() => complete(false)}><Check className="h-4 w-4" aria-hidden /> Completed (undo)</Button>
                    : <Button loading={busy} onClick={() => complete(true, true)}>{next ? 'Mark complete and continue' : 'Mark complete'}</Button>
                )}
                {['quiz', 'assignment'].includes(lesson.type) && ld.completed && <span className="flex items-center gap-1.5 text-sm text-ok"><CheckCircle2 className="h-4 w-4" aria-hidden /> Completed</span>}
                {next && <Button variant="secondary" className="ml-auto" onClick={() => go(next)}>Next <ArrowRight className="h-4 w-4" aria-hidden /></Button>}
              </div>
            </article>
          )}
        </main>

        <aside aria-label="Course curriculum">
          <details open className="rounded-xl border border-line bg-surface lg:[&>summary]:pointer-events-none" id="curriculum">
            <summary className="cursor-pointer px-4 py-3 font-semibold lg:cursor-default">Curriculum</summary>
            <div className="max-h-[70vh] overflow-y-auto border-t border-line">
              {data.sections.map((s) => (
                <section key={s._id}>
                  <h2 className="bg-raised px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">{s.title}</h2>
                  <ul>
                    {s.lessons.map((l) => {
                      const Icon = ICON[l.type];
                      return (
                        <li key={l._id}>
                          <Link to={`/courses/${slug}/learn/${l._id}`} aria-current={l._id === lessonId ? 'page' : undefined} className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-raised ${l._id === lessonId ? 'bg-raised font-semibold' : ''}`}>
                            {l.completed ? <CheckCircle2 className="h-4 w-4 shrink-0 text-ok" aria-label="Completed" /> : <Circle className="h-4 w-4 shrink-0 text-muted" aria-label="Not completed" />}
                            <span className="flex-1">{l.title}</span><Icon className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </details>
          <Announcements slug={slug} />
        </aside>
      </div>
    </div>
  );
}
