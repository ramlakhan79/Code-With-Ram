import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/format';
import ArticleBody from '../../components/ArticleBody';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ErrorState, FormError, PageSpinner } from '../../components/ui/Feedback';

const COPY = {
  approve: { title: 'Approve and publish?', label: 'Approve', note: 'The article goes live immediately and the author is notified.' },
  request_changes: { title: 'Request changes?', label: 'Request changes', note: 'The author is notified and can edit and resubmit.' },
  reject: { title: 'Reject this article?', label: 'Reject', note: 'The author is notified with your note. They can still revise and resubmit.' },
};

export default function ArticleReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(`/articles/manage/${id}`);
  const [note, setNote] = useState('');
  const [decision, setDecision] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  if (loading) return <PageSpinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const a = data.article;
  const pending = a.status === 'pending';

  const start = (d) => {
    if (d !== 'approve' && note.trim().length < 5) return setFormError('Write a note for the author (at least 5 characters) before requesting changes or rejecting.');
    setFormError('');
    setDecision(d);
  };
  const send = async () => {
    setBusy(true);
    try {
      await api.post(`/articles/manage/${id}/review`, { decision, note: note.trim() || undefined });
      toast.success('Decision sent to the author');
      navigate('/admin/articles');
    } catch (e) { toast.error(getErrorMessage(e)); setDecision(null); } finally { setBusy(false); }
  };

  return (
    <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:gap-8">
      <article className="min-w-0">
        <div className="flex flex-wrap items-center gap-3"><StatusBadge status={a.status} /><span className="text-sm text-muted">by {a.author.name} (@{a.author.username}) · {a.readingTime} min read</span></div>
        <h1 className="mt-3 text-3xl font-bold">{a.title}</h1>
        <p className="mt-2 text-muted">{a.description}</p>
        {a.coverImage && <img src={a.coverImage} alt="" className="mt-6 aspect-[16/9] w-full rounded-xl object-cover" />}
        <div className="mt-8"><ArticleBody html={a.content} /></div>
      </article>

      <aside className="mt-10 lg:mt-0">
        <div className="sticky top-24 space-y-4 rounded-xl border border-line bg-surface p-4">
          <h2 className="text-lg font-semibold">Review</h2>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted">Category</dt><dd>{a.category?.name || 'None'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Tags</dt><dd className="text-right">{a.tags.map((t) => t.name).join(', ') || 'None'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted">Submitted</dt><dd>{formatDate(a.submittedAt) || 'n/a'}</dd></div>
          </dl>
          {pending ? (
            <>
              <FormError>{formError}</FormError>
              <label className="block text-sm font-medium">Note to the author
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5} maxLength={1000} className="mt-1.5 w-full rounded-lg border border-line bg-surface p-2.5 text-sm font-normal" placeholder="Required when requesting changes or rejecting" />
              </label>
              <div className="flex flex-col gap-2">
                <Button onClick={() => start('approve')}>Approve</Button>
                <Button variant="secondary" onClick={() => start('request_changes')}>Request changes</Button>
                <Button variant="danger" onClick={() => start('reject')}>Reject</Button>
              </div>
            </>
          ) : <p className="text-sm text-muted">This article is not waiting for review.{a.reviewNote && ` Last note: ${a.reviewNote}`}</p>}
          <Link to="/admin/articles" className="block text-sm underline">Back to the list</Link>
        </div>
      </aside>

      <ConfirmDialog open={Boolean(decision)} danger={decision === 'reject'} loading={busy} title={COPY[decision]?.title || ''} confirmLabel={COPY[decision]?.label} onConfirm={send} onCancel={() => setDecision(null)}>
        {COPY[decision]?.note}
      </ConfirmDialog>
    </div>
  );
}
