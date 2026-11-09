import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import ArticleEditor from './ArticleEditor';
import TagInput from './TagInput';
import Button from './ui/Button';
import Field from './ui/Field';
import { FormError } from './ui/Feedback';

const BLANK_TEST = (isSample) => ({ input: '', expectedOutput: '', isSample, explanation: '' });

// Shared by admins (full control, hidden tests, limits, editorial) and contributors (suggestions: sample cases only).
export default function ProblemForm({ initial, initialTests, mode = 'admin', submitLabel, onSubmit, error, busy }) {
  const suggest = mode === 'suggest';
  const { data: meta } = useFetch('/practice/topics');
  const [f, setF] = useState(() => ({
    title: initial?.title || '', description: initial?.description || '', inputFormat: initial?.inputFormat || '', outputFormat: initial?.outputFormat || '', constraints: initial?.constraints || '',
    difficulty: initial?.difficulty || 'easy', topics: initial?.topics || [], tags: (initial?.tags || []).map((t) => t.name), hints: initial?.hints || [],
    editorial: initial?.editorial || '', timeLimitMs: initial?.timeLimitMs || 2000, memoryLimitMb: initial?.memoryLimitMb || 256, status: initial?.status && initial.status !== 'suggested' ? initial.status : 'draft',
  }));
  const [tests, setTests] = useState(initialTests?.length ? initialTests.map(({ input, expectedOutput, isSample, explanation }) => ({ input, expectedOutput, isSample, explanation })) : [BLANK_TEST(true)]);
  const set = (p) => setF((x) => ({ ...x, ...p }));
  const setTest = (i, p) => setTests((t) => t.map((x, xi) => (xi === i ? { ...x, ...p } : x)));
  const toggleTopic = (t) => set({ topics: f.topics.includes(t) ? f.topics.filter((x) => x !== t) : f.topics.length < 5 ? [...f.topics, t] : f.topics });

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...f, timeLimitMs: Number(f.timeLimitMs), memoryLimitMb: Number(f.memoryLimitMb), hints: f.hints.map((h) => h.trim()).filter(Boolean), tests: tests.filter((t) => t.input !== '' || t.expectedOutput !== '') };
    if (suggest) ['editorial', 'timeLimitMs', 'memoryLimitMb', 'status'].forEach((k) => delete payload[k]);
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-6" noValidate>
      <FormError>{error}</FormError>
      <Field label="Title" value={f.title} maxLength={120} onChange={(e) => set({ title: e.target.value })} />
      <div><p className="mb-1.5 text-sm font-medium">Problem statement</p><ArticleEditor initialHtml={f.description} onChange={(description) => set({ description })} /></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field as="textarea" rows={3} label="Input format" value={f.inputFormat} maxLength={2000} onChange={(e) => set({ inputFormat: e.target.value })} />
        <Field as="textarea" rows={3} label="Output format" value={f.outputFormat} maxLength={2000} onChange={(e) => set({ outputFormat: e.target.value })} />
      </div>
      <Field as="textarea" rows={3} label="Constraints" value={f.constraints} maxLength={2000} onChange={(e) => set({ constraints: e.target.value })} />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field as="select" label="Difficulty" value={f.difficulty} onChange={(e) => set({ difficulty: e.target.value })}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></Field>
        {!suggest && <Field label="Time limit (ms)" type="number" min={100} max={10000} value={f.timeLimitMs} onChange={(e) => set({ timeLimitMs: e.target.value })} />}
        {!suggest && <Field label="Memory limit (MB)" type="number" min={16} max={512} value={f.memoryLimitMb} onChange={(e) => set({ memoryLimitMb: e.target.value })} />}
      </div>
      <fieldset><legend className="mb-1.5 text-sm font-medium">Topics (up to 5)</legend><div className="flex flex-wrap gap-2">{meta?.topics.map((t) => <label key={t} className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${f.topics.includes(t) ? 'border-accent bg-accent/20 font-semibold' : 'border-line hover:bg-raised'}`}><input type="checkbox" className="sr-only" checked={f.topics.includes(t)} onChange={() => toggleTopic(t)} />{t}</label>)}</div></fieldset>
      <TagInput label="Tags" value={f.tags} onChange={(tags) => set({ tags })} />

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Hints (up to 5, most general first)</legend>
        <div className="space-y-2">
          {f.hints.map((h, i) => (
            <div key={i} className="flex gap-2"><input aria-label={`Hint ${i + 1}`} value={h} maxLength={500} onChange={(e) => set({ hints: f.hints.map((x, xi) => (xi === i ? e.target.value : x)) })} className="h-10 flex-1 rounded-lg border border-line bg-surface px-3 text-sm" /><button type="button" aria-label={`Remove hint ${i + 1}`} className="rounded-lg p-2 text-muted hover:bg-raised" onClick={() => set({ hints: f.hints.filter((_, xi) => xi !== i) })}><Trash2 className="h-4 w-4" /></button></div>
          ))}
          {f.hints.length < 5 && <Button type="button" variant="ghost" size="sm" onClick={() => set({ hints: [...f.hints, ''] })}><Plus className="h-4 w-4" aria-hidden /> Add hint</Button>}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 text-sm font-medium">Test cases</legend>
        <p className="mb-3 text-sm text-muted">{suggest ? 'Add sample cases that show the input and expected output. An admin adds hidden cases before publishing.' : 'Sample cases are shown to learners. Hidden cases are never shown. Learners are told only which hidden case number failed. Publishing needs at least one of each.'}</p>
        <div className="space-y-4">
          {tests.map((t, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-line p-4">
              <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">Case {i + 1}{!suggest && <span className="ml-2 font-normal text-muted">{t.isSample ? 'sample' : 'hidden'}</span>}</p><button type="button" aria-label={`Remove case ${i + 1}`} className="rounded-lg p-1.5 text-muted hover:bg-raised" onClick={() => setTests((x) => x.filter((_, xi) => xi !== i))}><Trash2 className="h-4 w-4" /></button></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field as="textarea" rows={4} label="Input" className="[&_textarea]:font-mono [&_textarea]:text-xs" value={t.input} onChange={(e) => setTest(i, { input: e.target.value })} />
                <Field as="textarea" rows={4} label="Expected output" className="[&_textarea]:font-mono [&_textarea]:text-xs" value={t.expectedOutput} onChange={(e) => setTest(i, { expectedOutput: e.target.value })} />
              </div>
              {!suggest && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={t.isSample} onChange={(e) => setTest(i, { isSample: e.target.checked })} className="h-4 w-4 accent-[rgb(var(--accent))]" /> Show as a sample to learners</label>}
              {(suggest || t.isSample) && <Field label="Explanation (optional)" value={t.explanation} maxLength={500} onChange={(e) => setTest(i, { explanation: e.target.value })} />}
            </div>
          ))}
          {tests.length < 30 && <Button type="button" variant="secondary" size="sm" onClick={() => setTests((x) => [...x, BLANK_TEST(suggest ? true : false)])}><Plus className="h-4 w-4" aria-hidden /> Add test case</Button>}
        </div>
      </fieldset>

      {!suggest && <div><p className="mb-1.5 text-sm font-medium">Editorial (unlocks after a learner solves the problem)</p><ArticleEditor initialHtml={f.editorial} onChange={(editorial) => set({ editorial })} /></div>}
      {!suggest && <Field as="select" label="Status" value={f.status} onChange={(e) => set({ status: e.target.value })} className="max-w-xs"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></Field>}
      <Button type="submit" loading={busy}>{submitLabel}</Button>
    </form>
  );
}
