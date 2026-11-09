import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Bell, BellOff, Bookmark, Flag, Link as LinkIcon, Lock, EyeOff } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import { timeAgo } from '../utils/format';
import ArticleBody from '../components/ArticleBody';
import ArticleEditor from '../components/ArticleEditor';
import ReportDialog from '../components/ReportDialog';
import VoteBox from '../components/VoteBox';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { ErrorState, PageSpinner } from '../components/ui/Feedback';

const link = 'text-xs text-muted hover:text-ink hover:underline';

function Byline({ user, label, when }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-raised/60 p-2 text-sm">
      <Avatar user={user} size={32} />
      <div className="min-w-0"><p className="text-xs text-muted">{label} {when}</p><Link to={`/users/${user?.username}`} className="font-medium hover:underline">{user?.name}</Link> <span className="text-xs text-muted" title="Community reputation">{(user?.reputation || 1).toLocaleString()} rep</span></div>
    </div>
  );
}

function Comments({ comments, discussionId, answerId, canComment, me, canModerate, onChanged, onReport }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const post = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await api.post(`/discussions/${discussionId}/comments`, { body, answerId }); setBody(''); setOpen(false); onChanged(); } catch (err) { toast.error(err.response?.data?.errors?.[0]?.message || getErrorMessage(err)); } finally { setBusy(false); }
  };
  const remove = async (id) => { try { await api.delete(`/discussions/comments/${id}`); onChanged(); } catch (err) { toast.error(getErrorMessage(err)); } };
  return (
    <div className="mt-3 border-t border-line pt-2">
      {comments.length > 0 && (
        <ul className="divide-y divide-line text-sm">
          {comments.map((c) => (
            <li key={c._id} className={`py-2 ${c.status === 'hidden' ? 'opacity-50' : ''}`}>
              {c.body} <span className="text-muted">· <Link to={`/users/${c.author?.username}`} className="hover:underline">{c.author?.name}</Link> {timeAgo(c.createdAt)}</span>
              {c.status === 'hidden' && <span className="ml-2 text-xs">(hidden)</span>}
              {me && <span className="ml-3 space-x-3">{(c.author?._id === me.id || canModerate) && c.status !== 'hidden' && <button className={link} onClick={() => remove(c._id)}>{c.author?._id === me.id ? 'Delete' : 'Remove'}</button>}{c.author?._id !== me.id && <button className={link} onClick={() => onReport(c._id)}>Report</button>}</span>}
            </li>
          ))}
        </ul>
      )}
      {canComment && (open ? (
        <form onSubmit={post} className="mt-2 space-y-2">
          <label className="sr-only" htmlFor={`cm-${answerId || 'q'}`}>Comment</label>
          <textarea id={`cm-${answerId || 'q'}`} autoFocus rows={2} maxLength={600} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a short comment. Use answers for solutions." className="w-full rounded-lg border border-line bg-surface p-2 text-sm" />
          <div className="flex gap-2"><Button size="sm" type="submit" loading={busy} disabled={body.trim().length < 3}>Add comment</Button><Button size="sm" type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button></div>
        </form>
      ) : <button className={`${link} mt-1`} onClick={() => setOpen(true)}>Add a comment</button>)}
    </div>
  );
}

export default function DiscussionPage() {
  const { slug } = useParams();
  const { user, can } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, error, reload } = useFetch(`/discussions/${slug}`, undefined, [user?.id]);
  const { data: rel } = useFetch(`/discussions/${slug}/related`, undefined, [data?.question?._id]);
  const [report, setReport] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editHtml, setEditHtml] = useState('');
  const [answerHtml, setAnswerHtml] = useState('');
  const [editorKey, setEditorKey] = useState(0);
  const [busy, setBusy] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const q = data?.question;
  useSeo({ title: q?.title, description: q?.searchText?.slice(0, 160) || `Question: ${q?.title}`, type: 'article' });

  useEffect(() => {
    if (!q || q.status === 'hidden') return;
    const key = `viewed:q:${q._id}`;
    if (!sessionStorage.getItem(key)) { sessionStorage.setItem(key, '1'); api.post(`/discussions/${q._id}/view`).catch(() => {}); }
  }, [q?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !data) return <PageSpinner />;
  if (error) return <div className="py-16"><ErrorState message={error} onRetry={reload} /></div>;
  const { answers, viewer } = data;
  const mine = user && answers.find((a) => a.author?._id === user.id);
  const canWrite = Boolean(user && can('discussion:write'));
  const needLogin = () => { toast.error('Log in to do that.'); navigate('/login', { state: { from: location } }); };
  const run = async (fn, ok) => { try { await fn(); if (ok) toast.success(ok); reload(); } catch (e) { toast.error(getErrorMessage(e)); } };

  const vote = (url) => (value) => (user ? run(() => api.post(url, { value })) : needLogin());
  const toggle = (what) => () => (user ? run(() => api.post(`/discussions/${q._id}/${what}`)) : needLogin());
  const mod = (url, action) => run(() => api.post(url, { action }));
  const copy = async () => { try { await navigator.clipboard.writeText(window.location.href); toast.success('Link copied'); } catch { toast.error('Could not copy the link.'); } };
  const postAnswer = async () => { setBusy('answer'); try { await api.post(`/discussions/${q._id}/answers`, { body: answerHtml }); setAnswerHtml(''); setEditorKey((k) => k + 1); toast.success('Answer posted'); reload(); } catch (e) { toast.error(e.response?.data?.errors?.[0]?.message || getErrorMessage(e)); } finally { setBusy(''); } };
  const saveEdit = async () => { setBusy('edit'); try { await api.patch(`/discussions/answers/${editing}`, { body: editHtml }); setEditing(null); toast.success('Answer updated'); reload(); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(''); } };
  const deleteQuestion = async () => { try { await api.delete(`/discussions/${q._id}`); toast.success('Question deleted'); navigate('/discussions'); } catch (e) { toast.error(getErrorMessage(e)); setConfirmDelete(false); } };

  const act = 'inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs hover:bg-raised';
  const common = { discussionId: q._id, me: user, canModerate: viewer.canModerate, onChanged: reload };

  return (
    <div className="mx-auto max-w-6xl py-10">
      {q.status === 'hidden' && <p role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm"><EyeOff className="h-4 w-4" aria-hidden /> This question is hidden from the public. {viewer.canModerate ? 'You can restore it below.' : 'Only you and moderators can see it.'}</p>}
      {q.status === 'closed' && <p role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-raised p-3 text-sm"><Lock className="h-4 w-4" aria-hidden /> This question is closed to new answers.</p>}
      <div className="grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-snug sm:text-3xl">{q.title}</h1>
          <p className="mt-2 text-sm text-muted">Asked {timeAgo(q.createdAt)}{q.editedAt && `, edited ${timeAgo(q.editedAt)}`} · {q.viewCount} views</p>

          <article className="mt-6 flex gap-4" aria-label="Question">
            <VoteBox score={q.score} myVote={q.myVote} label="this question" disabled={viewer.isOwner} onVote={vote(`/discussions/${q._id}/vote`)} />
            <div className="min-w-0 flex-1">
              <ArticleBody html={q.body} />
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">{q.tags.map((t) => <li key={t._id}><Link to={`/discussions?tag=${t.slug}`} className="rounded-full border border-line px-2.5 py-0.5 text-xs hover:bg-raised">{t.name}</Link></li>)}</ul>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button className={act} onClick={copy}><LinkIcon className="h-3.5 w-3.5" aria-hidden /> Share</button>
                  <button className={act} aria-pressed={viewer.followed} onClick={toggle('follow')}>{viewer.followed ? <><BellOff className="h-3.5 w-3.5" aria-hidden /> Following</> : <><Bell className="h-3.5 w-3.5" aria-hidden /> Follow</>}</button>
                  <button className={act} aria-pressed={viewer.bookmarked} onClick={toggle('bookmark')}><Bookmark className={`h-3.5 w-3.5 ${viewer.bookmarked ? 'fill-current' : ''}`} aria-hidden /> {viewer.bookmarked ? 'Saved' : 'Save'}</button>
                  {(viewer.isOwner || viewer.canModerate) && <Link to={`/discussions/${q.slug}/edit`} className={act}>Edit</Link>}
                  {viewer.isOwner && q.answerCount === 0 && <button className={act} onClick={() => setConfirmDelete(true)}>Delete</button>}
                  {!viewer.isOwner && <button className={act} onClick={() => (user ? setReport({ title: 'Report this question' }) : needLogin())}><Flag className="h-3.5 w-3.5" aria-hidden /> Report</button>}
                </div>
                <Byline user={q.author} label="asked" when={timeAgo(q.createdAt)} />
              </div>
              {viewer.canModerate && (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-line p-2 text-xs"><span className="font-semibold">Moderator</span>
                  <button className={act} onClick={() => mod(`/discussions/${q._id}/moderate`, q.status === 'closed' ? 'reopen' : 'close')}>{q.status === 'closed' ? 'Reopen' : 'Close'}</button>
                  <button className={act} onClick={() => mod(`/discussions/${q._id}/moderate`, q.status === 'hidden' ? 'restore' : 'hide')}>{q.status === 'hidden' ? 'Restore' : 'Hide'}</button></div>
              )}
              <Comments comments={q.comments} canComment={canWrite} onReport={(cid) => setReport({ commentId: cid, title: 'Report this comment' })} {...common} />
            </div>
          </article>

          <section aria-labelledby="ans-h" className="mt-10">
            <h2 id="ans-h" className="text-xl font-bold">{answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}</h2>
            <div className="mt-4 divide-y divide-line">
              {answers.map((a) => {
                const own = user && a.author?._id === user.id;
                return (
                  <article key={a._id} id={`answer-${a._id}`} className={`flex gap-4 py-6 ${a.status === 'hidden' ? 'opacity-60' : ''}`} aria-label={`Answer by ${a.author?.name}`}>
                    <VoteBox score={a.score} myVote={a.myVote} label="this answer" disabled={own} onVote={vote(`/discussions/answers/${a._id}/vote`)} accepted={a.accepted} canAccept={viewer.isOwner && a.status === 'visible'} onAccept={() => run(() => api.post(`/discussions/answers/${a._id}/accept`, { accepted: !a.accepted }))} />
                    <div className="min-w-0 flex-1">
                      {a.status === 'hidden' && <p className="mb-2 text-xs font-semibold">Hidden by moderators</p>}
                      {editing === a._id ? (
                        <div className="space-y-3"><ArticleEditor images={false} initialHtml={a.body} onChange={setEditHtml} /><div className="flex gap-2"><Button size="sm" loading={busy === 'edit'} onClick={saveEdit}>Save</Button><Button size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button></div></div>
                      ) : <ArticleBody html={a.body} />}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          <button className={act} onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#answer-${a._id}`); toast.success('Link copied'); } catch { toast.error('Could not copy the link.'); } }}><LinkIcon className="h-3.5 w-3.5" aria-hidden /> Share</button>
                          {(own || viewer.canModerate) && editing !== a._id && <button className={act} onClick={() => { setEditing(a._id); setEditHtml(a.body); }}>Edit</button>}
                          {own && !a.accepted && <button className={act} onClick={() => run(() => api.delete(`/discussions/answers/${a._id}`), 'Answer deleted')}>Delete</button>}
                          {!own && <button className={act} onClick={() => (user ? setReport({ answerId: a._id, title: 'Report this answer' }) : needLogin())}><Flag className="h-3.5 w-3.5" aria-hidden /> Report</button>}
                          {viewer.canModerate && <button className={act} onClick={() => mod(`/discussions/answers/${a._id}/moderate`, a.status === 'hidden' ? 'restore' : 'hide')}>{a.status === 'hidden' ? 'Restore' : 'Hide'} (mod)</button>}
                        </div>
                        <Byline user={a.author} label="answered" when={timeAgo(a.createdAt)} />
                      </div>
                      <Comments comments={a.comments} answerId={a._id} canComment={canWrite && a.status === 'visible'} onReport={(cid) => setReport({ commentId: cid, title: 'Report this comment' })} {...common} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="your-h" className="mt-8 border-t border-line pt-8">
            <h2 id="your-h" className="text-xl font-bold">Your answer</h2>
            {!user ? <p className="mt-3 rounded-lg border border-dashed border-line p-4 text-sm text-muted"><Link to="/login" state={{ from: location }} className="font-medium text-ink underline">Log in</Link> or <Link to="/register" className="font-medium text-ink underline">create a free account</Link> to answer.</p>
              : q.status === 'closed' ? <p className="mt-3 text-sm text-muted">This question is closed.</p>
              : mine ? <p className="mt-3 text-sm text-muted">You have already answered. Use Edit on your answer to improve it.</p>
              : !canWrite ? <p className="mt-3 text-sm text-muted">Your account cannot post answers.</p>
              : <div className="mt-3 space-y-4"><ArticleEditor key={editorKey} images={false} initialHtml="" onChange={setAnswerHtml} /><Button loading={busy === 'answer'} onClick={postAnswer}>Post your answer</Button></div>}
          </section>
        </div>

        <aside>
          {rel?.discussions.length > 0 && <section aria-labelledby="rel-h" className="sticky top-24 rounded-xl border border-line p-4"><h2 id="rel-h" className="text-sm font-semibold">Related questions</h2><ul className="mt-3 space-y-3 text-sm">{rel.discussions.map((d) => <li key={d._id} className="flex gap-2"><span className={`mt-0.5 h-fit rounded px-1.5 text-xs ${d.accepted ? 'bg-ok/20' : 'bg-raised'}`}>{d.score}</span><Link to={`/discussions/${d.slug}`} className="hover:underline">{d.title}</Link></li>)}</ul></section>}
        </aside>
      </div>

      <ReportDialog open={Boolean(report)} endpoint={`/discussions/${q._id}/report`} extra={{ answerId: report?.answerId }} commentId={report?.commentId} title={report?.title} onClose={() => setReport(null)} />
      <ConfirmDialog open={confirmDelete} danger title="Delete this question?" confirmLabel="Delete" onConfirm={deleteQuestion} onCancel={() => setConfirmDelete(false)}>It will be permanently removed. This is only possible while nobody has answered.</ConfirmDialog>
    </div>
  );
}
