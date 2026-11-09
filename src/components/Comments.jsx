import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { timeAgo } from '../utils/format';
import Avatar from './ui/Avatar';
import Button from './ui/Button';
import ReportDialog from './ReportDialog';
import { Spinner, ErrorState } from './ui/Feedback';

function CommentForm({ articleId, parentId, onPosted, onCancel, autoFocus, placeholder = 'Add to the discussion' }) {
  const toast = useToast();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    try {
      const res = await api.post(`/articles/${articleId}/comments`, { body, parentId });
      setBody('');
      onPosted(res.data.data.comment);
    } catch (err) { toast.error(getErrorMessage(err)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="sr-only" htmlFor={`c-${parentId || 'new'}`}>{placeholder}</label>
      <textarea id={`c-${parentId || 'new'}`} autoFocus={autoFocus} value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} rows={parentId ? 2 : 3} placeholder={placeholder} className="w-full rounded-lg border border-line bg-surface p-3 text-sm" />
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={busy} disabled={!body.trim()}>{parentId ? 'Reply' : 'Post comment'}</Button>
        {onCancel && <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}

function Item({ c, articleId, canReply, onReply, onRemoved, onReport, depth = 0 }) {
  const { user, can } = useAuth();
  const toast = useToast();
  const [replying, setReplying] = useState(false);
  const mine = user && c.author?._id === user.id;
  const remove = async () => {
    try { await api.delete(`/articles/comments/${c.id}`); onRemoved(c.id); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  return (
    <li className="flex gap-3">
      <Avatar user={c.author} size={32} />
      <div className="min-w-0 flex-1">
        <p className="text-sm"><Link to={`/users/${c.author?.username}`} className="font-semibold hover:underline">{c.author?.name}</Link> <span className="text-muted">· {timeAgo(c.createdAt)}{c.edited && ' (edited)'}</span></p>
        {c.removed ? <p className="mt-1 text-sm italic text-muted">This comment was removed.</p> : <p className="mt-1 whitespace-pre-line text-sm">{c.body}</p>}
        {!c.removed && user && (
          <div className="mt-1.5 flex gap-3 text-xs text-muted">
            {canReply && <button className="hover:text-ink hover:underline" onClick={() => setReplying((r) => !r)}>Reply</button>}
            {(mine || can('comment:moderate')) && <button className="hover:text-ink hover:underline" onClick={remove}>{mine ? 'Delete' : 'Remove (moderator)'}</button>}
            {!mine && <button className="hover:text-ink hover:underline" onClick={() => onReport(c.id)}>Report</button>}
          </div>
        )}
        {replying && (
          <div className="mt-3"><CommentForm autoFocus articleId={articleId} parentId={c.id} placeholder={`Reply to ${c.author?.name}`} onCancel={() => setReplying(false)} onPosted={(r) => { setReplying(false); onReply(c.id, r); }} /></div>
        )}
        {c.replies?.length > 0 && (
          <ul className="mt-4 space-y-4 border-l border-line pl-4">
            {c.replies.map((r) => <Item key={r.id} c={r} articleId={articleId} canReply={depth === 0} onReply={onReply} onRemoved={onRemoved} onReport={onReport} depth={1} />)}
          </ul>
        )}
      </div>
    </li>
  );
}

export default function Comments({ articleId, onCount }) {
  const { user } = useAuth();
  const location = useLocation();
  const [state, setState] = useState({ comments: [], pagination: null, loading: true, error: '' });
  const [reportId, setReportId] = useState(null);

  const load = useCallback(async (page = 1, append = false) => {
    try {
      const r = await api.get(`/articles/${articleId}/comments`, { params: { page, limit: 10 } });
      setState((s) => ({ comments: append ? [...s.comments, ...r.data.data.comments] : r.data.data.comments, pagination: r.data.data.pagination, loading: false, error: '' }));
    } catch (e) { setState((s) => ({ ...s, loading: false, error: getErrorMessage(e) })); }
  }, [articleId]);
  useEffect(() => { load(); }, [load]);

  const addTop = (c) => { setState((s) => ({ ...s, comments: [c, ...s.comments] })); onCount?.(1); };
  const addReply = (parentId, r) => { setState((s) => ({ ...s, comments: s.comments.map((c) => (c.id === parentId ? { ...c, replies: [...c.replies, r] } : c)) })); onCount?.(1); };
  const removed = (id) => {
    setState((s) => ({
      ...s,
      comments: s.comments.map((c) => (c.id === id ? { ...c, removed: true, body: '' } : { ...c, replies: c.replies.filter((r) => r.id !== id) })),
    }));
    onCount?.(-1);
  };

  return (
    <section aria-labelledby="comments-h" className="mt-12 border-t border-line pt-8">
      <h2 id="comments-h" className="text-xl font-bold">Discussion</h2>
      <div className="mt-4">
        {user ? <CommentForm articleId={articleId} onPosted={addTop} /> : (
          <p className="rounded-lg border border-dashed border-line p-4 text-sm text-muted">
            <Link to="/login" state={{ from: location }} className="font-medium text-ink underline">Log in</Link> or <Link to="/register" className="font-medium text-ink underline">create a free account</Link> to join the discussion.
          </p>
        )}
      </div>
      <div className="mt-6">
        {state.loading ? <Spinner /> : state.error ? <ErrorState message={state.error} onRetry={() => load()} /> : state.comments.length === 0 ? (
          <p className="text-sm text-muted">No comments yet. Be the first to share a thought.</p>
        ) : (
          <ul className="space-y-6">
            {state.comments.map((c) => <Item key={c.id} c={c} articleId={articleId} canReply onReply={addReply} onRemoved={removed} onReport={setReportId} />)}
          </ul>
        )}
        {state.pagination && state.pagination.page < state.pagination.pages && (
          <Button variant="secondary" size="sm" className="mt-6" onClick={() => load(state.pagination.page + 1, true)}>Load more comments</Button>
        )}
      </div>
      <ReportDialog open={Boolean(reportId)} articleId={articleId} commentId={reportId} onClose={() => setReportId(null)} />
    </section>
  );
}
