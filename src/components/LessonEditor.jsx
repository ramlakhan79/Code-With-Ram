import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import ArticleEditor from './ArticleEditor';
import Button from './ui/Button';
import Field from './ui/Field';
import { FormError, Spinner } from './ui/Feedback';

const BLANK_Q = () => ({ prompt: '', options: ['', ''], correctIndex: 0, explanation: '' });

function QuizBuilder({ quiz, onChange }) {
  const setQ = (i, patch) => onChange({ ...quiz, questions: quiz.questions.map((q, qi) => (qi === i ? { ...q, ...patch } : q)) });
  return (
    <div className="space-y-5">
      <Field label="Passing score (%)" type="number" min={1} max={100} value={quiz.passingScore} onChange={(e) => onChange({ ...quiz, passingScore: Number(e.target.value) })} className="max-w-[12rem]" />
      {quiz.questions.map((q, qi) => (
        <fieldset key={qi} className="space-y-3 rounded-xl border border-line p-4">
          <legend className="px-1 text-sm font-semibold">Question {qi + 1}</legend>
          <Field label="Question" value={q.prompt} onChange={(e) => setQ(qi, { prompt: e.target.value })} maxLength={500} />
          <div className="space-y-2">
            <p className="text-sm font-medium">Answers (select the correct one)</p>
            {q.options.map((o, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input type="radio" name={`correct-${qi}`} aria-label={`Mark answer ${oi + 1} as correct`} checked={q.correctIndex === oi} onChange={() => setQ(qi, { correctIndex: oi })} className="accent-[rgb(var(--accent))]" />
                <input aria-label={`Answer ${oi + 1}`} value={o} maxLength={200} onChange={(e) => setQ(qi, { options: q.options.map((x, xi) => (xi === oi ? e.target.value : x)) })} className="h-10 flex-1 rounded-lg border border-line bg-surface px-3 text-sm" />
                {q.options.length > 2 && (
                  <button type="button" aria-label={`Remove answer ${oi + 1}`} className="rounded-lg p-2 text-muted hover:bg-raised" onClick={() => setQ(qi, { options: q.options.filter((_, xi) => xi !== oi), correctIndex: q.correctIndex === oi ? 0 : q.correctIndex > oi ? q.correctIndex - 1 : q.correctIndex })}><Trash2 className="h-4 w-4" /></button>
                )}
              </div>
            ))}
            {q.options.length < 6 && <Button type="button" size="sm" variant="ghost" onClick={() => setQ(qi, { options: [...q.options, ''] })}><Plus className="h-4 w-4" aria-hidden /> Add answer</Button>}
          </div>
          <Field label="Explanation (shown after answering)" value={q.explanation} maxLength={500} onChange={(e) => setQ(qi, { explanation: e.target.value })} />
          <Button type="button" size="sm" variant="ghost" onClick={() => onChange({ ...quiz, questions: quiz.questions.filter((_, i) => i !== qi) })}>Remove question</Button>
        </fieldset>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={() => onChange({ ...quiz, questions: [...quiz.questions, BLANK_Q()] })}><Plus className="h-4 w-4" aria-hidden /> Add question</Button>
    </div>
  );
}

function Resources({ items, onChange }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const addLink = () => {
    if (!name.trim() || !/^https:\/\//i.test(url.trim())) return toast.error('Give the resource a name and an https:// link.');
    onChange([...items, { name: name.trim(), url: url.trim() }]);
    setName(''); setUrl('');
  };
  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setBusy(true);
    try { const r = await api.post('/uploads/file', fd); onChange([...items, { name: r.data.data.name, url: r.data.data.url }]); } catch (err) { toast.error(getErrorMessage(err)); } finally { setBusy(false); }
  };
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Downloadable resources</p>
      {items.length > 0 && (
        <ul className="mb-3 divide-y divide-line rounded-xl border border-line">
          {items.map((r, i) => (
            <li key={r.url} className="flex items-center gap-3 p-3 text-sm"><span className="flex-1 truncate">{r.name}</span><button type="button" aria-label={`Remove ${r.name}`} className="rounded-lg p-1.5 text-muted hover:bg-raised" onClick={() => onChange(items.filter((_, x) => x !== i))}><Trash2 className="h-4 w-4" /></button></li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-end gap-2">
        <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} className="min-w-[10rem] flex-1" maxLength={80} />
        <Field label="Link" placeholder="https://" value={url} onChange={(e) => setUrl(e.target.value)} className="min-w-[12rem] flex-[2]" />
        <Button type="button" variant="secondary" onClick={addLink}>Add link</Button>
        <Button type="button" variant="secondary" loading={busy} onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" aria-hidden /> Upload file</Button>
        <input ref={fileRef} type="file" accept=".pdf,.zip,.txt,.md,.csv" className="sr-only" aria-label="Upload a resource file" onChange={upload} />
      </div>
      <p className="mt-1.5 text-xs text-muted">PDF, ZIP, TXT, Markdown or CSV up to 10 MB. If file downloads are blocked on your free Cloudinary plan, link to a file hosted elsewhere instead.</p>
    </div>
  );
}

export default function LessonEditor({ lessonId, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/courses/manage/lessons/${lessonId}`).then((r) => setForm(r.data.data.lesson)).catch((e) => setLoadError(getErrorMessage(e)));
  }, [lessonId]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const save = async () => {
    setError('');
    setBusy(true);
    try {
      const body = { title: form.title, durationMinutes: Number(form.durationMinutes) || 0, isPreview: form.isPreview, resources: form.resources };
      if (form.type === 'video') body.videoUrl = form.videoUrl;
      if (form.type === 'text') body.content = form.content;
      if (form.type === 'quiz') body.quiz = form.quiz;
      if (form.type === 'assignment') body.assignment = form.assignment;
      await api.patch(`/courses/manage/lessons/${lessonId}`, body);
      toast.success('Lesson saved');
      onSaved();
    } catch (e) {
      const list = e.response?.data?.errors;
      setError(list ? list.map((x) => `${x.field}: ${x.message}`).join(' · ') : getErrorMessage(e));
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="Edit lesson" className="mx-auto my-6 w-full max-w-3xl rounded-xl border border-line bg-surface p-6 shadow-xl">
        {loadError ? <FormError>{loadError}</FormError> : !form ? <Spinner className="py-12" /> : (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold capitalize">Edit {form.type} lesson</h2>
            <FormError>{error}</FormError>
            <Field label="Title" value={form.title} maxLength={120} onChange={(e) => set({ title: e.target.value })} />
            <div className="flex flex-wrap items-end gap-4">
              <Field label="Duration (minutes)" type="number" min={0} max={600} value={form.durationMinutes} onChange={(e) => set({ durationMinutes: e.target.value })} className="w-40" />
              <label className="flex items-center gap-2 pb-2 text-sm"><input type="checkbox" checked={form.isPreview} onChange={(e) => set({ isPreview: e.target.checked })} className="h-4 w-4 accent-[rgb(var(--accent))]" /> Free preview (visible before enrolling)</label>
            </div>
            {form.type === 'video' && <Field label="Video link" placeholder="https://www.youtube.com/watch?v=..." hint="YouTube, Vimeo, or a direct .mp4/.webm link. Unlisted YouTube videos work well and cost nothing." value={form.videoUrl} onChange={(e) => set({ videoUrl: e.target.value })} />}
            {form.type === 'text' && <div><p className="mb-1.5 text-sm font-medium">Lesson content</p><ArticleEditor initialHtml={form.content} onChange={(html) => set({ content: html })} /></div>}
            {form.type === 'quiz' && <QuizBuilder quiz={form.quiz} onChange={(quiz) => set({ quiz })} />}
            {form.type === 'assignment' && <Field as="textarea" rows={6} label="Instructions" maxLength={3000} value={form.assignment.instructions} onChange={(e) => set({ assignment: { instructions: e.target.value } })} />}
            <Resources items={form.resources || []} onChange={(resources) => set({ resources })} />
            <div className="flex justify-end gap-2 border-t border-line pt-4"><Button variant="secondary" onClick={onClose}>Close</Button><Button loading={busy} onClick={save}>Save lesson</Button></div>
          </div>
        )}
      </div>
    </div>
  );
}
