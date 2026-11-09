import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { formatDate, timeAgo } from '../../utils/format';
import ArticleEditor from '../../components/ArticleEditor';
import { StateBadge, TYPE_LABELS } from '../../components/ContestBadges';
import { DifficultyBadge, VerdictBadge, VERDICT_LABELS } from '../../components/Verdict';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Field from '../../components/ui/Field';
import { EmptyState, ErrorState, FormError, PageSpinner, Spinner } from '../../components/ui/Feedback';

const toLocal = (d) => { const t = new Date(d); return new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const select = 'h-10 rounded-lg border border-line bg-surface px-3 text-sm';
const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

function ProblemPicker({ value, onChange, locked }) {
  const [q, setQ] = useState('');
  const { data } = useFetch('/practice/admin/problems', { q: q || undefined, limit: 8 });
  const add = (p) => onChange([...value, { problemId: p._id, title: p.title, difficulty: p.difficulty, points: 100 }]);
  const move = (i, d) => { const a = [...value]; [a[i], a[i + d]] = [a[i + d], a[i]]; onChange(a); };
  return (
    <div className="space-y-5">
      {locked && <p role="status" className="rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm">Problems and points are locked once a contest has started.</p>}
      <div>
        <h3 className="text-sm font-semibold">Contest problems (in order)</h3>
        {value.length === 0 ? <p className="mt-2 text-sm text-muted">No problems yet. Search below to add some.</p> : (
          <ol className="mt-2 divide-y divide-line rounded-xl border border-line">
            {value.map((p, i) => (
              <li key={p.problemId} className="flex flex-wrap items-center gap-3 p-3 text-sm">
                <span className="w-6 font-semibold">{String.fromCharCode(65 + i)}</span><span className="min-w-0 flex-1 truncate">{p.title}</span>{p.difficulty && <DifficultyBadge difficulty={p.difficulty} />}
                <label className="flex items-center gap-1.5 text-xs text-muted">Points <input type="number" min={1} max={1000} disabled={locked} value={p.points} onChange={(e) => onChange(value.map((x, xi) => (xi === i ? { ...x, points: Number(e.target.value) } : x)))} className="h-8 w-20 rounded-lg border border-line bg-surface px-2 text-sm text-ink" aria-label={`Points for problem ${String.fromCharCode(65 + i)}`} /></label>
                <button type="button" disabled={locked || i === 0} aria-label="Move up" className="rounded-lg p-1.5 text-muted hover:bg-raised disabled:opacity-30" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></button>
                <button type="button" disabled={locked || i === value.length - 1} aria-label="Move down" className="rounded-lg p-1.5 text-muted hover:bg-raised disabled:opacity-30" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></button>
                <button type="button" disabled={locked} aria-label={`Remove ${p.title}`} className="rounded-lg p-1.5 text-muted hover:bg-raised disabled:opacity-30" onClick={() => onChange(value.filter((_, xi) => xi !== i))}><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ol>
        )}
      </div>
      {!locked && (
        <div>
          <label className="text-sm font-semibold" htmlFor="pp-search">Add from problem bank</label>
          <input id="pp-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search problems by title" className={`${select} mt-2 w-full max-w-sm`} />
          <p className="mt-1 text-xs text-muted">Use draft problems. Problems already published in Practice are public, so contestants could see them early.</p>
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line text-sm">
            {data?.problems.map((p) => {
              const used = value.some((v) => v.problemId === p._id);
              const pub = p.status === 'published';
              return <li key={p._id} className="flex flex-wrap items-center gap-3 p-3"><span className="min-w-0 flex-1 truncate">{p.title}</span><DifficultyBadge difficulty={p.difficulty} /><span className="text-xs capitalize text-muted">{p.status}</span><Button type="button" size="sm" variant="secondary" disabled={used || pub} onClick={() => add(p)}><Plus className="h-4 w-4" aria-hidden /> {used ? 'Added' : pub ? 'Public' : 'Add'}</Button></li>;
            })}
            {data?.problems.length === 0 && <li className="p-3 text-muted">No problems match.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

function Participants({ id, resultsPublished }) {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState(null);
  const [reason, setReason] = useState('');
  const { data, loading, error, reload } = useFetch(`/contests/admin/${id}/participants`, { page, limit: 25 });
  const apply = async () => {
    const t = target; setTarget(null);
    try { await api.patch(`/contests/admin/${id}/participants/${t.user._id}`, { disqualified: !t.disqualified, reason }); toast.success(t.disqualified ? 'Reinstated' : 'Disqualified'); setReason(''); reload(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  if (loading && !data) return <Spinner className="py-12" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.participants.length) return <EmptyState title="Nobody has registered yet" />;
  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Participant</th><th className="px-4 py-2.5 font-medium">Score</th><th className="px-4 py-2.5 font-medium">Penalty</th><th className="px-4 py-2.5 font-medium">Submissions</th><th className="px-4 py-2.5 font-medium">Registered</th><th className="px-4 py-2.5"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody className="divide-y divide-line">{data.participants.map((p) => (
            <tr key={p.user._id} className={p.disqualified ? 'opacity-60' : ''}>
              <td className="px-4 py-3"><p className="font-medium">{p.user.name}</p><p className="text-xs text-muted">@{p.user.username}{p.disqualified && ` · disqualified${p.disqualifiedReason ? `: ${p.disqualifiedReason}` : ''}`}</p></td>
              <td className="px-4 py-3">{p.score}{p.finalRank ? ` (#${p.finalRank})` : ''}</td><td className="px-4 py-3">{p.penaltyMinutes}</td><td className="px-4 py-3">{p.submissionCount}</td><td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(p.registeredAt)}</td>
              <td className="px-4 py-3 text-right"><Button size="sm" variant="secondary" disabled={resultsPublished} onClick={() => setTarget(p)}>{p.disqualified ? 'Reinstate' : 'Disqualify'}</Button></td>
            </tr>))}</tbody>
        </table>
      </div>
      <Pagination pagination={data.pagination} noun="participants" onPage={setPage} />
      <ConfirmDialog open={Boolean(target)} danger={target && !target.disqualified} title={target?.disqualified ? 'Reinstate this participant?' : 'Disqualify this participant?'} confirmLabel={target?.disqualified ? 'Reinstate' : 'Disqualify'} onConfirm={apply} onCancel={() => setTarget(null)}>
        {target?.disqualified ? 'They will return to the leaderboard and can submit again.' : (<><p>They are removed from the leaderboard and cannot submit. You can reinstate them until results are published.</p><label className="mt-3 block text-ink">Reason (internal)<input value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} className="mt-1 h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm" /></label></>)}
      </ConfirmDialog>
    </>
  );
}

function Submissions({ id }) {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [verdict, setVerdict] = useState('');
  const [user, setUser] = useState('');
  const [view, setView] = useState(null);
  const { data, loading, error, reload } = useFetch(`/contests/admin/${id}/submissions`, { page, limit: 25, verdict: verdict || undefined, user: user || undefined });
  const open = async (sid) => { try { setView((await api.get(`/contests/admin/${id}/submissions/${sid}`)).data.data.submission); } catch (e) { toast.error(getErrorMessage(e)); } };
  return (
    <div>
      <div className="flex flex-wrap gap-3"><select aria-label="Result" className={select} value={verdict} onChange={(e) => { setVerdict(e.target.value); setPage(1); }}><option value="">Any result</option>{Object.entries(VERDICT_LABELS).filter(([k]) => k !== 'ok').map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select><input aria-label="Username" placeholder="Username" value={user} onChange={(e) => { setUser(e.target.value); setPage(1); }} className={`${select} w-40`} /></div>
      <div className="mt-4">
        {loading && !data ? <Spinner className="py-12" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.submissions.length === 0 ? <EmptyState title="No submissions" /> : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface text-sm">{data.submissions.map((s) => <li key={s._id} className="flex flex-wrap items-center gap-3 p-3"><span>@{s.user?.username}</span><span className="font-semibold">{s.label}</span><VerdictBadge verdict={s.verdict} /><span className="capitalize text-muted">{s.language}</span><span className="text-muted">minute {s.minutes}</span><span className="ml-auto text-xs text-muted">{timeAgo(s.submittedAt)}</span><Button size="sm" variant="ghost" onClick={() => open(s._id)}>Code</Button></li>)}</ul>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="submissions" onPage={setPage} />
      <ConfirmDialog open={Boolean(view)} title={view ? `@${view.user?.username} · problem ${view.label}` : ''} confirmLabel="Close" onConfirm={() => setView(null)} onCancel={() => setView(null)}><pre className="mt-2 max-h-[50vh] overflow-auto rounded-lg border border-line bg-raised p-3 font-mono text-xs text-ink">{view?.code}</pre></ConfirmDialog>
    </div>
  );
}

function Announce({ id }) {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async (e) => {
    e.preventDefault(); setBusy(true);
    try { const r = await api.post(`/contests/admin/${id}/announcements`, { title, body }); toast.success(`Sent to ${r.data.data.notified} participant${r.data.data.notified === 1 ? '' : 's'}`); setTitle(''); setBody(''); } catch (err) { toast.error(getErrorMessage(err)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={send} className="max-w-xl space-y-4 rounded-xl border border-line bg-surface p-4" noValidate>
      <p className="text-sm text-muted">Use this for clarifications during the contest. Registered participants get a notification and see it on the contest page.</p>
      <Field label="Title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
      <Field as="textarea" rows={4} label="Message" value={body} maxLength={3000} onChange={(e) => setBody(e.target.value)} />
      <Button type="submit" loading={busy} disabled={title.trim().length < 3 || !body.trim()}>Send announcement</Button>
    </form>
  );
}

export default function ContestEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(id ? `/contests/admin/${id}` : null);
  const [f, setF] = useState(null);
  const [tab, setTab] = useState('details');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState('');
  const [confirm, setConfirm] = useState(null);

  const c = data?.contest;
  useEffect(() => {
    if (id && !c) return;
    setF({
      title: c?.title || '', type: c?.type || 'weekly', topic: c?.topic || '', description: c?.description || '', rules: c?.rules || '',
      startTime: c ? toLocal(c.startTime) : '', endTime: c ? toLocal(c.endTime) : '', wrongPenaltyMinutes: c?.wrongPenaltyMinutes ?? 10,
      problems: (c?.problems || []).map((p) => ({ problemId: p.problemId, title: p.title, difficulty: p.difficulty, points: p.points })),
    });
  }, [id, c]);
  const { data: meta } = useFetch('/practice/topics');

  if (id && loading && !data) return <PageSpinner />;
  if (id && error) return <ErrorState message={error} onRetry={reload} />;
  if (!f) return <PageSpinner />;
  const state = data?.state || 'upcoming';
  const started = Boolean(id) && state !== 'upcoming';
  const set = (p) => setF((x) => ({ ...x, ...p }));

  const save = async (e) => {
    e?.preventDefault();
    setFormError(''); setBusy('save');
    try {
      const body = { title: f.title, type: f.type, topic: f.type === 'topic' && f.topic ? f.topic : null, description: f.description, rules: f.rules, startTime: new Date(f.startTime).toISOString(), endTime: new Date(f.endTime).toISOString(), wrongPenaltyMinutes: Number(f.wrongPenaltyMinutes), problems: f.problems.map((p) => ({ problemId: p.problemId, points: p.points })) };
      if (!f.startTime || !f.endTime) { setFormError('Choose a start and end time.'); return; }
      if (started) { delete body.problems; delete body.wrongPenaltyMinutes; delete body.startTime; if (state === 'ended') delete body.endTime; }
      if (id) { await api.patch(`/contests/admin/${id}`, body); toast.success('Contest saved'); reload(); }
      else { const r = await api.post('/contests/admin', body); toast.success('Contest created'); navigate(`/admin/contests/${r.data.data.contest._id}`, { replace: true }); }
    } catch (err) {
      const list = err.response?.data?.errors;
      setFormError(list ? list.map((x) => `${x.field}: ${x.message}`).join(' · ') : getErrorMessage(err));
      window.scrollTo({ top: 0 });
    } finally { setBusy(''); }
  };
  const action = async (path, ok, after) => {
    setBusy(path);
    try { await api.post(`/contests/admin/${id}/${path}`); toast.success(ok); if (after) after(); else reload(); } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(''); setConfirm(null); }
  };
  const remove = async () => { try { await api.delete(`/contests/admin/${id}`); toast.success('Contest deleted'); navigate('/admin/contests'); } catch (e) { toast.error(getErrorMessage(e)); setConfirm(null); } };

  const tabs = [['details', 'Details'], ['problems', 'Problems'], ...(id ? [['participants', 'Participants'], ['submissions', 'Submissions'], ['announce', 'Announcements'], ['results', 'Results']] : [])];
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h1 className="text-2xl font-bold">{id?c?.title : 'New contest'}</h1>{id && <p className="mt-1 flex items-center gap-3 text-sm text-muted"><StateBadge state={state} /> {TYPE_LABELS[c?.type]} · {c?.status === 'published' ? 'published' : 'draft'} · {c?.participantCount} registered</p>}</div>
        {id && (
          <div className="flex flex-wrap gap-2">
            {c?.status === 'published' && <Link to={`/contests/${c?.slug}`}><Button size="sm" variant="secondary">View page</Button></Link>}
            {c?.status === 'draft' && <Button size="sm" loading={busy === 'publish'} onClick={() => action('publish', 'Contest published')}>Publish</Button>}
            {c?.status === 'published' && state === 'upcoming' && <Button size="sm" variant="secondary" loading={busy === 'unpublish'} onClick={() => action('unpublish', 'Moved to drafts')}>Unpublish</Button>}
            <Button size="sm" variant="ghost" onClick={() => setConfirm('delete')}>Delete</Button>
          </div>
        )}
      </div>

      <div role="tablist" aria-label="Contest sections" className="mt-6 flex gap-1 overflow-x-auto border-b border-line">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`whitespace-nowrap px-4 py-2 text-sm ${tab === k ? 'border-b-2 border-accent font-semibold' : 'text-muted hover:text-ink'}`}>{l}</button>)}</div>

      <div className="mt-6" role="tabpanel">
        {(tab === 'details' || tab === 'problems') && (
          <form onSubmit={save} className="space-y-6" noValidate>
            <FormError>{formError}</FormError>
            {tab === 'details' ? (
              <>
                <Field label="Title" value={f.title} maxLength={120} onChange={(e) => set({ title: e.target.value })} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field as="select" label="Type" value={f.type} onChange={(e) => set({ type: e.target.value })}>{Object.entries(TYPE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Field>
                  {f.type === 'topic' && <Field as="select" label="Topic" value={f.topic} onChange={(e) => set({ topic: e.target.value })}><option value="">Choose a topic</option>{meta?.topics.map((t) => <option key={t} value={t}>{t}</option>)}</Field>}
                </div>
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Starts" type="datetime-local" disabled={started} value={f.startTime} onChange={(e) => set({ startTime: e.target.value })} hint={`Your time zone: ${TZ}`} />
                  <Field label="Ends" type="datetime-local" disabled={state === 'ended'} value={f.endTime} onChange={(e) => set({ endTime: e.target.value })} hint="10 minutes to 7 days. You can extend it while running." />
                  <Field label="Penalty per wrong run (min)" type="number" min={0} max={120} disabled={started} value={f.wrongPenaltyMinutes} onChange={(e) => set({ wrongPenaltyMinutes: e.target.value })} hint="Compile errors are free." />
                </div>
                <div><p className="mb-1.5 text-sm font-medium">Description</p><ArticleEditor initialHtml={f.description} onChange={(description) => set({ description })} /></div>
                <Field as="textarea" rows={5} label="Rules" maxLength={5000} value={f.rules} onChange={(e) => set({ rules: e.target.value })} />
              </>
            ) : <ProblemPicker value={f.problems} onChange={(problems) => set({ problems })} locked={started} />}
            <Button type="submit" loading={busy === 'save'}>{id ? 'Save changes' : 'Create contest'}</Button>
          </form>
        )}
        {tab === 'participants' && <Participants id={id} resultsPublished={Boolean(c.resultsPublishedAt)} />}
        {tab === 'submissions' && <Submissions id={id} />}
        {tab === 'announce' && <Announce id={id} />}
        {tab === 'results' && (
          <div className="max-w-xl rounded-xl border border-line bg-surface p-5">
            <h2 className="text-lg font-semibold">Final results</h2>
            {c.resultsPublishedAt ? <p className="mt-2 text-sm">Published {timeAgo(c.resultsPublishedAt)}. Ranks are final and every participant was notified.</p> : state !== 'ended' ? <p className="mt-2 text-sm text-muted">Results can be published after the contest ends. Until then the leaderboard is provisional.</p> : (
              <><p className="mt-2 text-sm text-muted">This freezes the ranking, stores each participant's final rank, and notifies everyone. Review disqualifications first: they cannot change afterwards.</p><Button className="mt-4" loading={busy === 'publish-results'} onClick={() => setConfirm('results')}>Publish final results</Button></>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog open={confirm === 'delete'} danger title="Delete this contest?" confirmLabel="Delete" onConfirm={remove} onCancel={() => setConfirm(null)}>Finished contests and contests with participants are kept: unpublish a contest that has not started if you need to remove it.</ConfirmDialog>
      <ConfirmDialog open={confirm === 'results'} title="Publish final results?" confirmLabel="Publish" onConfirm={() => action('publish-results', 'Results published')} onCancel={() => setConfirm(null)}>Ranks become final and cannot be changed afterwards.</ConfirmDialog>
    </div>
  );
}
