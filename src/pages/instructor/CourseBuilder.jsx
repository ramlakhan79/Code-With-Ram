import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate, timeAgo } from '../../utils/format';
import LessonEditor from '../../components/LessonEditor';
import TagInput from '../../components/TagInput';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { EmptyState, ErrorState, FormError, PageSpinner, Spinner } from '../../components/ui/Feedback';

const TABS = [['details', 'Details'], ['curriculum', 'Curriculum'], ['students', 'Students'], ['announcements', 'Announcements']];
const TYPES = [['video', 'Video'], ['text', 'Reading'], ['quiz', 'Quiz'], ['assignment', 'Assignment']];
const lines = (a) => (a || []).join('\n');
const toList = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean);

function Details({ course, onSaved }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const { data: cats } = useFetch('/categories', { scope: 'course' });
  const [f, setF] = useState({
    title: course.title, description: course.description, thumbnail: course.thumbnail, category: course.category?._id || '', difficulty: course.difficulty,
    tags: (course.tags || []).map((t) => t.name), prerequisites: lines(course.prerequisites), outcomes: lines(course.outcomes),
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (p) => setF((x) => ({ ...x, ...p }));

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.patch(`/courses/manage/${course._id}`, { ...f, category: f.category || '', prerequisites: toList(f.prerequisites), outcomes: toList(f.outcomes) });
      toast.success('Course saved');
      onSaved();
    } catch (err) {
      const list = err.response?.data?.errors;
      setError(list ? list.map((x) => `${x.field}: ${x.message}`).join(' · ') : getErrorMessage(err));
    } finally { setBusy(false); }
  };
  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try { const r = await api.post('/uploads/image', fd); set({ thumbnail: r.data.data.url }); } catch (err) { toast.error(getErrorMessage(err)); } finally { setUploading(false); }
  };

  return (
    <form onSubmit={save} className="space-y-5" noValidate>
      <FormError>{error}</FormError>
      <Field label="Title" value={f.title} maxLength={120} onChange={(e) => set({ title: e.target.value })} />
      <Field as="textarea" rows={6} label="Description" maxLength={5000} hint="At least 50 characters before you can publish." value={f.description} onChange={(e) => set({ description: e.target.value })} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field as="select" label="Category" value={f.category} onChange={(e) => set({ category: e.target.value })}><option value="">Choose a category</option>{cats?.categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}</Field>
        <Field as="select" label="Difficulty" value={f.difficulty} onChange={(e) => set({ difficulty: e.target.value })}><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></Field>
      </div>
      <TagInput label="Tags" value={f.tags} onChange={(tags) => set({ tags })} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field as="textarea" rows={5} label="What learners will achieve" hint="One per line, up to 8." value={f.outcomes} onChange={(e) => set({ outcomes: e.target.value })} />
        <Field as="textarea" rows={5} label="Prerequisites" hint="One per line, up to 6." value={f.prerequisites} onChange={(e) => set({ prerequisites: e.target.value })} />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium">Thumbnail</p>
        {f.thumbnail ? <div className="flex items-start gap-4"><img src={f.thumbnail} alt="Thumbnail preview" className="aspect-[16/9] w-48 rounded-lg object-cover" /><Button type="button" variant="secondary" size="sm" onClick={() => set({ thumbnail: '' })}>Remove</Button></div>
          : <Button type="button" variant="secondary" loading={uploading} onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4" aria-hidden /> Upload thumbnail</Button>}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" aria-label="Upload thumbnail" onChange={upload} />
      </div>
      <Button type="submit" loading={busy}>Save details</Button>
    </form>
  );
}

function Curriculum({ course, sections, reload }) {
  const toast = useToast();
  const [local, setLocal] = useState(sections);
  const [newSection, setNewSection] = useState('');
  const [adding, setAdding] = useState({});
  const [renaming, setRenaming] = useState(null);
  const [editLesson, setEditLesson] = useState(null);
  const [confirm, setConfirm] = useState(null);
  useEffect(() => setLocal(sections), [sections]);

  const run = async (fn, ok) => { try { await fn(); if (ok) toast.success(ok); reload(); } catch (e) { toast.error(getErrorMessage(e)); reload(); } };
  const persist = async (next) => {
    setLocal(next);
    try { await api.post(`/courses/manage/${course._id}/reorder`, { sections: next.map((s) => ({ id: s._id, lessons: s.lessons.map((l) => l._id) })) }); } catch (e) { toast.error(getErrorMessage(e)); reload(); }
  };
  const swap = (arr, i, j) => { const a = [...arr]; [a[i], a[j]] = [a[j], a[i]]; return a; };
  const moveSection = (i, d) => persist(swap(local, i, i + d));
  const moveLesson = (si, li, d) => persist(local.map((s, x) => (x === si ? { ...s, lessons: swap(s.lessons, li, li + d) } : s)));
  const moveToSection = (si, li, toId) => {
    const lesson = local[si].lessons[li];
    persist(local.map((s, x) => (x === si ? { ...s, lessons: s.lessons.filter((_, y) => y !== li) } : s._id === toId ? { ...s, lessons: [...s.lessons, lesson] } : s)));
  };
  const icon = 'rounded-lg p-1.5 text-muted hover:bg-raised hover:text-ink disabled:opacity-30';

  return (
    <div className="space-y-4">
      {local.length === 0 && <EmptyState title="No sections yet">Add a section, then add lessons to it. Sections group lessons into modules.</EmptyState>}
      {local.map((s, si) => (
        <section key={s._id} className="rounded-xl border border-line bg-surface">
          <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
            {renaming?.id === s._id ? (
              <form className="flex flex-1 gap-2" onSubmit={(e) => { e.preventDefault(); run(() => api.patch(`/courses/manage/sections/${s._id}`, { title: renaming.title }), 'Section renamed'); setRenaming(null); }}>
                <input aria-label="Section title" autoFocus value={renaming.title} onChange={(e) => setRenaming({ id: s._id, title: e.target.value })} className="h-9 flex-1 rounded-lg border border-line bg-surface px-3 text-sm" />
                <Button size="sm" type="submit">Save</Button><Button size="sm" type="button" variant="ghost" onClick={() => setRenaming(null)}>Cancel</Button>
              </form>
            ) : <h3 className="flex-1 font-semibold">{s.title}</h3>}
            <button className={icon} aria-label={`Move ${s.title} up`} disabled={si === 0} onClick={() => moveSection(si, -1)}><ArrowUp className="h-4 w-4" /></button>
            <button className={icon} aria-label={`Move ${s.title} down`} disabled={si === local.length - 1} onClick={() => moveSection(si, 1)}><ArrowDown className="h-4 w-4" /></button>
            <button className={icon} aria-label={`Rename ${s.title}`} onClick={() => setRenaming({ id: s._id, title: s.title })}><Pencil className="h-4 w-4" /></button>
            <button className={icon} aria-label={`Delete ${s.title}`} onClick={() => setConfirm({ kind: 'section', id: s._id, label: s.title })}><Trash2 className="h-4 w-4" /></button>
          </div>
          <ul className="divide-y divide-line">
            {s.lessons.map((l, li) => (
              <li key={l._id} className="flex flex-wrap items-center gap-2 px-3 py-2 text-sm">
                <span className="w-20 shrink-0 text-xs capitalize text-muted">{l.type}</span>
                <span className="min-w-0 flex-1 truncate">{l.title}{l.isPreview && <span className="ml-2 rounded bg-raised px-1.5 py-0.5 text-xs">Preview</span>}</span>
                {local.length > 1 && (
                  <select aria-label={`Move ${l.title} to another section`} value="" onChange={(e) => e.target.value && moveToSection(si, li, e.target.value)} className="h-8 max-w-[9rem] rounded-lg border border-line bg-surface px-2 text-xs">
                    <option value="">Move to…</option>{local.filter((x) => x._id !== s._id).map((x) => <option key={x._id} value={x._id}>{x.title}</option>)}
                  </select>
                )}
                <button className={icon} aria-label={`Move ${l.title} up`} disabled={li === 0} onClick={() => moveLesson(si, li, -1)}><ArrowUp className="h-4 w-4" /></button>
                <button className={icon} aria-label={`Move ${l.title} down`} disabled={li === s.lessons.length - 1} onClick={() => moveLesson(si, li, 1)}><ArrowDown className="h-4 w-4" /></button>
                <Button size="sm" variant="secondary" onClick={() => setEditLesson(l._id)}>Edit</Button>
                <button className={icon} aria-label={`Delete ${l.title}`} onClick={() => setConfirm({ kind: 'lesson', id: l._id, label: l.title })}><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
          <form className="flex flex-wrap items-center gap-2 border-t border-line p-3" onSubmit={(e) => {
            e.preventDefault();
            const a = adding[s._id] || {};
            if (!a.title?.trim()) return;
            run(() => api.post(`/courses/manage/sections/${s._id}/lessons`, { title: a.title.trim(), type: a.type || 'video' }), 'Lesson added');
            setAdding((x) => ({ ...x, [s._id]: {} }));
          }}>
            <input aria-label={`New lesson title in ${s.title}`} placeholder="New lesson title" value={adding[s._id]?.title || ''} onChange={(e) => setAdding((x) => ({ ...x, [s._id]: { ...x[s._id], title: e.target.value } }))} className="h-9 min-w-[10rem] flex-1 rounded-lg border border-line bg-surface px-3 text-sm" />
            <select aria-label="Lesson type" value={adding[s._id]?.type || 'video'} onChange={(e) => setAdding((x) => ({ ...x, [s._id]: { ...x[s._id], type: e.target.value } }))} className="h-9 rounded-lg border border-line bg-surface px-2 text-sm">{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            <Button size="sm" type="submit" variant="secondary"><Plus className="h-4 w-4" aria-hidden /> Add lesson</Button>
          </form>
        </section>
      ))}
      <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); if (newSection.trim().length < 2) return; run(() => api.post(`/courses/manage/${course._id}/sections`, { title: newSection.trim() }), 'Section added'); setNewSection(''); }}>
        <input aria-label="New section title" placeholder="New section title, for example Getting started" value={newSection} onChange={(e) => setNewSection(e.target.value)} className="h-10 min-w-[14rem] flex-1 rounded-lg border border-line bg-surface px-3 text-sm" />
        <Button type="submit"><Plus className="h-4 w-4" aria-hidden /> Add section</Button>
      </form>

      {editLesson && <LessonEditor lessonId={editLesson} onClose={() => setEditLesson(null)} onSaved={() => { setEditLesson(null); reload(); }} />}
      <ConfirmDialog open={Boolean(confirm)} danger title={`Delete this ${confirm?.kind}?`} confirmLabel="Delete" onCancel={() => setConfirm(null)}
        onConfirm={() => { const c = confirm; setConfirm(null); run(() => api.delete(`/courses/manage/${c.kind === 'section' ? 'sections' : 'lessons'}/${c.id}`), 'Deleted'); }}>
        “{confirm?.label}” {confirm?.kind === 'section' ? 'and all its lessons ' : ''}will be removed, along with learners' progress on {confirm?.kind === 'section' ? 'them' : 'it'}.
      </ConfirmDialog>
    </div>
  );
}

function Students({ courseId }) {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch('/courses/manage/students', { courseId, page, limit: 15 });
  if (loading && !data) return <Spinner className="py-12" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.students.length) return <EmptyState title="No learners yet">Learners appear here after they enroll.</EmptyState>;
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Learner</th><th className="px-4 py-2.5 font-medium">Progress</th><th className="px-4 py-2.5 font-medium">Enrolled</th><th className="px-4 py-2.5 font-medium">Last active</th></tr></thead>
          <tbody className="divide-y divide-line">
            {data.students.map((s) => (
              <tr key={s._id}>
                <td className="px-4 py-3"><p className="font-medium">{s.user?.name}</p><p className="text-xs text-muted">@{s.user?.username}</p></td>
                <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded-full bg-raised" role="progressbar" aria-valuenow={s.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.user?.name} progress`}><div className="h-full bg-accent" style={{ width: `${s.progress}%` }} /></div><span className="text-xs">{s.progress}%{s.completed && ' · done'}</span></div></td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(s.enrolledAt)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">{timeAgo(s.lastActivityAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination pagination={data.pagination} noun="learners" onPage={setPage} />
    </>
  );
}

function Announcements({ course }) {
  const toast = useToast();
  const { data, reload } = useFetch(`/courses/${course.slug}/announcements`);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { const r = await api.post(`/courses/manage/${course._id}/announcements`, { title, body }); toast.success(`Sent to ${r.data.data.notified} learner${r.data.data.notified === 1 ? '' : 's'}`); setTitle(''); setBody(''); reload(); } catch (err) { toast.error(getErrorMessage(err)); } finally { setBusy(false); }
  };
  return (
    <div>
      <form onSubmit={send} className="space-y-4 rounded-xl border border-line bg-surface p-4" noValidate>
        <Field label="Title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
        <Field as="textarea" rows={4} label="Message" value={body} maxLength={3000} onChange={(e) => setBody(e.target.value)} hint="Every enrolled learner gets a notification." />
        <Button type="submit" loading={busy} disabled={title.trim().length < 3 || !body.trim()}>Send announcement</Button>
      </form>
      <ul className="mt-6 space-y-3">
        {data?.announcements.map((a) => <li key={a._id} className="rounded-xl border border-line p-4 text-sm"><p className="font-medium">{a.title}</p><p className="mt-1 whitespace-pre-line text-muted">{a.body}</p><p className="mt-1 text-xs text-muted">{timeAgo(a.createdAt)}</p></li>)}
      </ul>
    </div>
  );
}

export default function CourseBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(`/courses/manage/${id}`);
  const [tab, setTab] = useState('details');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading && !data) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const { course, sections } = data;

  const act = async (action, ok) => { setBusy(true); try { await api.post(`/courses/manage/${id}/${action}`); toast.success(ok); reload(); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); } };
  const remove = async () => {
    try { await api.delete(`/courses/manage/${id}`); toast.success('Course deleted'); navigate('/dashboard/instructor/courses'); } catch (e) { toast.error(getErrorMessage(e)); setConfirmDelete(false); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0"><h1 className="truncate text-2xl font-bold">{course.title}</h1><p className="mt-1 flex items-center gap-3 text-sm text-muted"><StatusBadge status={course.status} /> {course.lessonCount} lessons · {course.enrollmentCount} learners</p></div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/courses/${course.slug}`}><Button variant="secondary" size="sm">View page</Button></Link>
          <Link to={`/courses/${course.slug}/learn`}><Button variant="secondary" size="sm">Preview as learner</Button></Link>
          {course.status !== 'published' && <Button size="sm" loading={busy} onClick={() => act('publish', 'Course published')}>Publish</Button>}
          {course.status === 'published' && <Button size="sm" variant="secondary" loading={busy} onClick={() => act('archive', 'Course archived')}>Archive</Button>}
          {course.status === 'published' && <Button size="sm" variant="secondary" loading={busy} onClick={() => act('unpublish', 'Course moved to drafts')}>Unpublish</Button>}
          <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)}>Delete</Button>
        </div>
      </div>

      <div role="tablist" aria-label="Course sections" className="mt-6 flex gap-2 overflow-x-auto border-b border-line pb-px">
        {TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`whitespace-nowrap rounded-t-lg px-4 py-2 text-sm ${tab === k ? 'border-b-2 border-accent font-semibold' : 'text-muted hover:text-ink'}`}>{l}</button>)}
      </div>
      <div className="mt-6" role="tabpanel">
        {tab === 'details' && <Details course={course} onSaved={reload} />}
        {tab === 'curriculum' && <Curriculum course={course} sections={sections} reload={reload} />}
        {tab === 'students' && <Students courseId={id} />}
        {tab === 'announcements' && <Announcements course={course} />}
      </div>

      <ConfirmDialog open={confirmDelete} danger title="Delete this course?" confirmLabel="Delete" onConfirm={remove} onCancel={() => setConfirmDelete(false)}>
        All lessons and learner progress will be removed. If learners are enrolled you will be asked to archive the course instead. Certificates already issued stay valid.
      </ConfirmDialog>
    </div>
  );
}
