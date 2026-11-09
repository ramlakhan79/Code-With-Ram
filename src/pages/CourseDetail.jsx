import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Video, FileText, ListChecks, ClipboardList, Eye, Clock, Users, Check } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import { timeAgo } from '../utils/format';
import { Stars, StarInput } from '../components/StarRating';
import { formatDuration } from '../components/CourseCard';
import LessonContent from '../components/LessonContent';
import Pagination from '../components/Pagination';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { ErrorState, PageSpinner, Spinner } from '../components/ui/Feedback';

const ICON = { video: Video, text: FileText, quiz: ListChecks, assignment: ClipboardList };
const TYPE = { video: 'Video', text: 'Reading', quiz: 'Quiz', assignment: 'Assignment' };

function PreviewDialog({ lessonId, onClose }) {
  const { data, loading, error } = useFetch(`/courses/lessons/${lessonId}`);
  return (
    <ConfirmDialog open title={data?.lesson.title || 'Preview'} confirmLabel="Close" onConfirm={onClose} onCancel={onClose}>
      <div className="max-h-[60vh] overflow-y-auto text-ink">
        {loading ? <Spinner /> : error ? <p>{error}</p> : <LessonContent lesson={data.lesson} />}
      </div>
    </ConfirmDialog>
  );
}

function Reviews({ course, viewer, onChanged }) {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const { data, loading, reload } = useFetch(`/courses/${course.slug}/reviews`, { page, limit: 5 });
  const [rating, setRating] = useState(viewer.myReview?.rating || 0);
  const [comment, setComment] = useState(viewer.myReview?.comment || '');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try { await api.post(`/courses/${course._id}/reviews`, { rating, comment: comment || undefined }); toast.success('Thanks for your review'); reload(); onChanged(); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };
  return (
    <section aria-labelledby="rev-h" className="mt-12">
      <h2 id="rev-h" className="text-xl font-bold">Reviews</h2>
      {viewer.enrolled && (
        <div className="mt-4 rounded-xl border border-line bg-surface p-4">
          <p className="text-sm font-medium">{viewer.myReview ? 'Update your review' : 'Rate this course'}</p>
          <div className="mt-2"><StarInput value={rating} onChange={setRating} /></div>
          <label className="sr-only" htmlFor="rev-text">Your review</label>
          <textarea id="rev-text" rows={3} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you think? (optional)" className="mt-3 w-full rounded-lg border border-line bg-surface p-3 text-sm" />
          <Button className="mt-2" size="sm" disabled={!rating} loading={busy} onClick={save}>{viewer.myReview ? 'Update review' : 'Post review'}</Button>
        </div>
      )}
      <div className="mt-4">
        {loading && !data ? <Spinner /> : data?.reviews.length === 0 ? <p className="text-sm text-muted">No reviews yet.</p> : (
          <ul className="space-y-5">
            {data?.reviews.map((r) => (
              <li key={r._id} className="flex gap-3">
                <Avatar user={r.user} size={36} />
                <div><p className="text-sm"><span className="font-semibold">{r.user?.name}</span> <span className="text-muted">· {timeAgo(r.createdAt)}</span></p><Stars value={r.rating} size={14} />{r.comment && <p className="mt-1 whitespace-pre-line text-sm">{r.comment}</p>}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="reviews" onPage={setPage} />
    </section>
  );
}

export default function CourseDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(`/courses/${slug}`);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const c = data?.course;
  useSeo({ title: c?.title, description: c?.description?.slice(0, 160), image: c?.thumbnail });

  if (loading && !data) return <PageSpinner />;
  if (error) return <div className="py-16"><ErrorState message={error} onRetry={reload} /></div>;
  const { viewer, sections } = data;

  const enroll = async () => {
    if (!user) { navigate('/login', { state: { from: location } }); return; }
    setBusy(true);
    try { await api.post(`/courses/${c._id}/enroll`); toast.success('You are enrolled. Happy learning!'); navigate(`/courses/${c.slug}/learn`); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };

  return (
    <div className="py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          {c.status !== 'published' && <p role="status" className="mb-4 rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm">{c.status === 'draft' ? 'This course is a draft. Only you and admins can see this page.' : 'This course is archived and closed to new learners.'}</p>}
          <p className="text-sm font-medium text-muted">{c.category?.name} · <span className="capitalize">{c.difficulty}</span></p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{c.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            {c.ratingCount > 0 && <span className="flex items-center gap-1.5"><Stars value={c.ratingAvg} /> {c.ratingAvg} ({c.ratingCount})</span>}
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden /> {c.enrollmentCount} learners</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden /> {formatDuration(c.durationMinutes)} · {c.lessonCount} lessons</span>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm"><Avatar user={c.instructor} size={28} /> Taught by <Link to={`/users/${c.instructor.username}`} className="font-semibold hover:underline">{c.instructor.name}</Link></p>
          <p className="mt-6 whitespace-pre-line">{c.description}</p>

          {c.outcomes.length > 0 && (
            <section aria-labelledby="out-h" className="mt-8 rounded-xl border border-line p-5">
              <h2 id="out-h" className="text-lg font-semibold">What you will learn</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">{c.outcomes.map((o) => <li key={o} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden /> {o}</li>)}</ul>
            </section>
          )}
          {c.prerequisites.length > 0 && (
            <section aria-labelledby="pre-h" className="mt-6"><h2 id="pre-h" className="text-lg font-semibold">Before you start</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{c.prerequisites.map((p) => <li key={p}>{p}</li>)}</ul></section>
          )}

          <section aria-labelledby="cur-h" className="mt-8">
            <h2 id="cur-h" className="text-xl font-bold">Curriculum</h2>
            <div className="mt-3 space-y-3">
              {sections.map((s) => (
                <details key={s._id} open className="rounded-xl border border-line bg-surface">
                  <summary className="cursor-pointer px-4 py-3 font-semibold">{s.title} <span className="font-normal text-muted">· {s.lessons.length} lessons</span></summary>
                  <ul className="divide-y divide-line border-t border-line">
                    {s.lessons.map((l) => {
                      const Icon = ICON[l.type];
                      return (
                        <li key={l._id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                          <Icon className="h-4 w-4 shrink-0 text-muted" aria-hidden /><span className="sr-only">{TYPE[l.type]}: </span>
                          <span className="flex-1">{l.title}</span>
                          {l.isPreview && c.status === 'published' && <button className="flex items-center gap-1 text-xs underline" onClick={() => setPreview(l._id)}><Eye className="h-3.5 w-3.5" aria-hidden /> Free preview</button>}
                          {l.durationMinutes > 0 && <span className="text-xs text-muted">{l.durationMinutes}m</span>}
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
            </div>
          </section>
          <Reviews course={c} viewer={viewer} onChanged={reload} />
        </div>

        <aside>
          <div className="sticky top-24 rounded-xl border border-line bg-surface p-5">
            {c.thumbnail && <img src={c.thumbnail} alt="" className="mb-4 aspect-[16/9] w-full rounded-lg object-cover" />}
            <p className="font-display text-2xl font-bold">Free</p>
            {viewer.enrolled ? (
              <>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={viewer.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Your progress"><div className="h-full bg-accent" style={{ width: `${viewer.progress}%` }} /></div>
                <p className="mt-1 text-sm text-muted">{viewer.progress}% complete</p>
                <Link to={`/courses/${c.slug}/learn`}><Button className="mt-4 w-full" size="lg">{viewer.progress ? 'Continue learning' : 'Start learning'}</Button></Link>
              </>
            ) : viewer.canManage ? (
              <>
                <Link to={`/dashboard/instructor/courses/${c._id}`}><Button className="mt-4 w-full">Edit course</Button></Link>
                <Link to={`/courses/${c.slug}/learn`}><Button className="mt-2 w-full" variant="secondary">Preview as a learner</Button></Link>
              </>
            ) : c.status === 'published' ? (
              <Button className="mt-4 w-full" size="lg" loading={busy} onClick={enroll}>{user ? 'Enroll for free' : 'Log in to enroll'}</Button>
            ) : <p className="mt-3 text-sm text-muted">Enrollment is closed.</p>}
            <ul className="mt-4 space-y-1.5 text-sm text-muted"><li>Lifetime access</li><li>Quizzes and assignments</li><li>Certificate of completion</li></ul>
          </div>
        </aside>
      </div>
      {preview && <PreviewDialog lessonId={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
