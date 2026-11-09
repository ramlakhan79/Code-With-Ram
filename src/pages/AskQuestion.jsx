import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import ArticleEditor from '../components/ArticleEditor';
import TagInput from '../components/TagInput';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import { ErrorState, FormError, PageSpinner } from '../components/ui/Feedback';

// Used for both asking (/discussions/ask) and editing (/discussions/:slug/edit)
export default function AskQuestion() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(slug ? `/discussions/${slug}` : null);
  const [f, setF] = useState(null);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  useSeo({ title: slug ? 'Edit question' : 'Ask a question', description: 'Ask the developer community.' });

  const q = data?.question;
  if (slug && loading && !data) return <PageSpinner />;
  if (slug && error) return <div className="py-16"><ErrorState message={error} onRetry={reload} /></div>;
  if (slug && q && !data.viewer.isOwner && !data.viewer.canModerate) return <div className="py-16"><ErrorState message="You can only edit your own questions." /></div>;
  const form = f || { title: q?.title || '', body: q?.body || '', tags: (q?.tags || []).map((t) => t.name) };
  const set = (p) => setF({ ...form, ...p });

  const submit = async (e) => {
    e.preventDefault();
    setFormError(''); setBusy(true);
    try {
      const res = slug ? await api.patch(`/discussions/${q._id}`, form) : await api.post('/discussions', form);
      toast.success(slug ? 'Question updated' : 'Question posted');
      navigate(`/discussions/${res.data.data.discussion.slug}`);
    } catch (err) {
      const list = err.response?.data?.errors;
      setFormError(list ? list.map((x) => x.message).join(' ') : getErrorMessage(err));
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-3xl py-10">
      <h1 className="text-3xl font-bold">{slug ? 'Edit your question' : 'Ask a question'}</h1>
      {!slug && (
        <ul className="mt-4 list-disc space-y-1 rounded-xl border border-line bg-surface p-4 pl-8 text-sm text-muted">
          <li>Search first. Your question may already be answered.</li>
          <li>Write a specific title, as if asking a colleague.</li>
          <li>Show what you tried, and include code and error messages.</li>
        </ul>
      )}
      <form onSubmit={submit} className="mt-6 space-y-6" noValidate>
        <FormError>{formError}</FormError>
        <Field label="Title" value={form.title} maxLength={150} hint="At least 15 characters." onChange={(e) => set({ title: e.target.value })} />
        <div><p className="mb-1.5 text-sm font-medium">Details</p><ArticleEditor images={false} initialHtml={form.body} onChange={(body) => set({ body })} /></div>
        <TagInput label="Tags" value={form.tags} onChange={(tags) => set({ tags })} />
        <div className="flex gap-3"><Button type="submit" loading={busy}>{slug ? 'Save changes' : 'Post your question'}</Button><Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button></div>
      </form>
    </div>
  );
}
