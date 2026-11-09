import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus, History } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { timeAgo } from '../../utils/format';
import ArticleEditor from '../../components/ArticleEditor';
import TagInput from '../../components/TagInput';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ErrorState, FormError, PageSpinner, Spinner } from '../../components/ui/Feedback';

const BLANK = { title: '', description: '', category: '', tags: [], coverImage: '', seo: { title: '', description: '' }, content: '' };

function Revisions({ id, canRestore, onRestored }) {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(`/articles/manage/${id}/revisions`);
  const restore = async (rev) => {
    try { const r = await api.post(`/articles/manage/${id}/revisions/${rev._id}/restore`); onRestored(r.data.data.article); reload(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  return (
    <ul className="divide-y divide-line rounded-xl border border-line text-sm">
      {data.revisions.map((r) => (
        <li key={r._id} className="flex flex-wrap items-center justify-between gap-2 p-3">
          <div><p className="font-medium">{r.title}</p><p className="text-xs text-muted">{timeAgo(r.createdAt)} by {r.editor?.name}{r.note && ` · ${r.note}`}</p></div>
          {canRestore && <Button size="sm" variant="secondary" onClick={() => restore(r)}>Restore</Button>}
        </li>
      ))}
    </ul>
  );
}

export default function ArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(BLANK);
  const [meta, setMeta] = useState({ status: 'draft', reviewNote: '' });
  const [loaded, setLoaded] = useState(!id);
  const [loadError, setLoadError] = useState('');
  const [editorKey, setEditorKey] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmPublished, setConfirmPublished] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const coverRef = useRef(null);
  const { data: cats } = useFetch('/categories', { scope: 'article' });

  const hydrate = useCallback((a) => {
    setForm({ title: a.title, description: a.description, category: a.category?._id || '', tags: (a.tags || []).map((t) => t.name), coverImage: a.coverImage || '', seo: a.seo || BLANK.seo, content: a.content });
    setMeta({ status: a.status, reviewNote: a.reviewNote });
  }, []);

  useEffect(() => {
    if (!id) return;
    api.get(`/articles/manage/${id}`).then((r) => { hydrate(r.data.data.article); setLoaded(true); }).catch((e) => setLoadError(getErrorMessage(e)));
  }, [id, hydrate]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = (patch) => { setForm((f) => ({ ...f, ...patch })); setDirty(true); };
  const editable = ['draft', 'changes_requested', 'rejected', 'published'].includes(meta.status);

  const save = async ({ confirmReview = false } = {}) => {
    setError('');
    if (form.title.trim().length < 5) { setError('Give your article a title of at least 5 characters.'); return null; }
    if (meta.status === 'published' && !confirmReview) { setConfirmPublished(true); return null; }
    setSaving(true);
    try {
      const body = { ...form, category: form.category || '', confirmReview: confirmReview || undefined };
      const res = id ? await api.patch(`/articles/manage/${id}`, body) : await api.post('/articles', body);
      const a = res.data.data.article;
      setDirty(false);
      setMeta({ status: a.status, reviewNote: a.reviewNote });
      toast.success(a.status === 'pending' ? 'Saved and sent back for review' : 'Draft saved');
      if (!id) navigate(`/dashboard/articles/edit/${a._id}`, { replace: true });
      return a;
    } catch (e) {
      const list = e.response?.data?.errors;
      setError(list ? list.map((x) => `${x.field}: ${x.message}`).join(' · ') : getErrorMessage(e));
      return null;
    } finally { setSaving(false); }
  };

  const submit = async () => {
    const saved = dirty || !id ? await save() : { _id: id };
    if (!saved) return;
    try {
      await api.post(`/articles/manage/${saved._id}/submit`);
      toast.success('Submitted for review. You will be notified of the decision.');
      setDirty(false);
      navigate('/dashboard/articles');
    } catch (e) { setError(getErrorMessage(e)); }
  };

  const onCover = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try { const r = await api.post('/uploads/image', fd); set({ coverImage: r.data.data.url }); } catch (err) { toast.error(getErrorMessage(err)); } finally { setUploading(false); }
  };

  if (loadError) return <ErrorState message={loadError} />;
  if (!loaded) return <PageSpinner />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{id ? 'Edit article' : 'New article'}</h1>
        <div className="flex items-center gap-3">{id && <StatusBadge status={meta.status} />}{dirty && <span className="text-sm text-muted">Unsaved changes</span>}</div>
      </div>

      {['changes_requested', 'rejected'].includes(meta.status) && meta.reviewNote && (
        <div role="status" className="mt-4 rounded-lg border border-accent/60 bg-accent/10 p-4 text-sm"><p className="font-semibold">{meta.status === 'rejected' ? 'Not approved' : 'Changes requested'}</p><p className="mt-1 whitespace-pre-line">{meta.reviewNote}</p></div>
      )}
      {meta.status === 'pending' && <div role="status" className="mt-4 rounded-lg border border-line bg-raised p-4 text-sm">This article is in review and locked for editing. Withdraw it from My articles to make changes.</div>}
      {meta.status === 'archived' && <div role="status" className="mt-4 rounded-lg border border-line bg-raised p-4 text-sm">This article is archived. Restore it from My articles to edit.</div>}
      {meta.status === 'published' && <div role="status" className="mt-4 rounded-lg border border-line bg-raised p-4 text-sm">This article is live. Saving changes sends it back for review and hides it until approved.</div>}

      <fieldset disabled={!editable} className="mt-6 space-y-5 disabled:opacity-70">
        <FormError>{error}</FormError>
        <Field label="Title" value={form.title} maxLength={150} onChange={(e) => set({ title: e.target.value })} placeholder="A clear, specific title" />
        <Field as="textarea" rows={3} label="Short description" maxLength={300} hint={`${form.description.length}/300. Shown in listings and search results.`} value={form.description} onChange={(e) => set({ description: e.target.value })} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field as="select" label="Category" value={form.category} onChange={(e) => set({ category: e.target.value })}>
            <option value="">Choose a category</option>
            {cats?.categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </Field>
          <TagInput label="Tags" value={form.tags} onChange={(tags) => set({ tags })} />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium">Cover image</p>
          {form.coverImage ? (
            <div className="flex items-start gap-4"><img src={form.coverImage} alt="Cover preview" className="aspect-[16/9] w-48 rounded-lg object-cover" /><Button type="button" variant="secondary" size="sm" onClick={() => set({ coverImage: '' })}>Remove</Button></div>
          ) : (
            <Button type="button" variant="secondary" loading={uploading} onClick={() => coverRef.current?.click()}><ImagePlus className="h-4 w-4" aria-hidden /> Upload cover</Button>
          )}
          <input ref={coverRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" aria-label="Upload cover image" onChange={onCover} />
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium">Content</p>
          <ArticleEditor key={editorKey} editable={editable} initialHtml={form.content} onChange={(html) => set({ content: html })} />
        </div>

        <details className="rounded-xl border border-line p-4">
          <summary className="cursor-pointer text-sm font-medium">Search engine settings (optional)</summary>
          <div className="mt-4 grid gap-4">
            <Field label="SEO title" maxLength={70} hint="Defaults to your article title." value={form.seo.title} onChange={(e) => set({ seo: { ...form.seo, title: e.target.value } })} />
            <Field as="textarea" rows={2} label="SEO description" maxLength={160} hint="Defaults to your short description." value={form.seo.description} onChange={(e) => set({ seo: { ...form.seo, description: e.target.value } })} />
          </div>
        </details>
      </fieldset>

      <div className="mt-6 flex flex-wrap gap-3">
        {editable && <Button variant="secondary" loading={saving} onClick={() => save()}>{meta.status === 'published' ? 'Save and resubmit' : 'Save draft'}</Button>}
        {editable && meta.status !== 'published' && <Button loading={saving} onClick={submit}>Submit for review</Button>}
        {id && <Button variant="ghost" onClick={() => setShowHistory((s) => !s)} aria-expanded={showHistory}><History className="h-4 w-4" aria-hidden /> Version history</Button>}
      </div>
      {showHistory && id && (
        <div className="mt-4"><Revisions id={id} canRestore={['draft', 'changes_requested', 'rejected'].includes(meta.status)} onRestored={(a) => { hydrate(a); setEditorKey((k) => k + 1); setDirty(false); toast.success('Version restored'); }} /></div>
      )}

      <ConfirmDialog open={Boolean(confirmPublished)} title="Send this article back for review?" confirmLabel="Save and resubmit" onCancel={() => setConfirmPublished(null)} onConfirm={async () => { setConfirmPublished(null); await save({ confirmReview: true }); }}>
        Your published article will be hidden from readers until an editor approves the changes. Likes and comments are kept.
      </ConfirmDialog>
    </div>
  );
}
