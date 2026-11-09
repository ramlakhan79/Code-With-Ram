import { useState } from 'react';
import { Download } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { downloadFile } from '../../utils/download';
import { formatDate } from '../../utils/format';
import Pagination from '../../components/Pagination';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Field from '../../components/ui/Field';
import { ErrorState, FormError, Spinner } from '../../components/ui/Feedback';

export default function AdminNewsletter() {
  const toast = useToast();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch('/admin/newsletter', { status: status || undefined, page, limit: 20 });
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [issue, setIssue] = useState(null); // { issueId, remaining, sent }
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const counts = data?.counts || {};

  const send = async () => {
    setConfirm(false); setErr(''); setBusy(true);
    try {
      const r = await api.post('/admin/newsletter/send', { subject, body, issueId: issue?.issueId });
      const d = r.data.data;
      setIssue({ issueId: d.issueId, remaining: d.remaining, sent: (issue?.sent || 0) + d.sent });
      toast.success(`Sent ${d.sent}${d.failed ? `, ${d.failed} failed` : ''}. ${d.remaining} still to go.`);
    } catch (e) { setErr(e.response?.data?.errors?.map((x) => x.message).join(' ') || getErrorMessage(e)); } finally { setBusy(false); }
  };
  const exportCsv = async () => { try { await downloadFile('/admin/newsletter/export.csv', 'newsletter-subscribers.csv'); } catch (e) { toast.error(getErrorMessage(e)); } };

  return (
    <div>
      <h1 className="text-2xl font-bold">Newsletter</h1>
      <dl className="mt-5 grid grid-cols-3 gap-3">{[['Confirmed', counts.confirmed || 0], ['Waiting to confirm', counts.pending || 0], ['Unsubscribed', counts.unsubscribed || 0]].map(([l, v]) => <div key={l} className="rounded-xl border border-line bg-surface p-4"><dt className="text-sm text-muted">{l}</dt><dd className="font-display text-2xl font-bold">{v}</dd></div>)}</dl>

      <section aria-labelledby="comp-h" className="mt-8 max-w-2xl rounded-xl border border-line bg-surface p-5">
        <h2 id="comp-h" className="font-semibold">Send an issue</h2>
        <p className="mt-1 text-xs text-muted">Each person gets their own email with an unsubscribe link. To respect email limits (Gmail allows roughly 500 a day) a batch is capped on the server. If people remain, send the next batch of the same issue: nobody receives it twice.</p>
        <form onSubmit={(e) => { e.preventDefault(); setConfirm(true); }} className="mt-4 space-y-4" noValidate>
          <FormError>{err}</FormError>
          <Field label="Subject" value={subject} maxLength={150} onChange={(e) => setSubject(e.target.value)} disabled={Boolean(issue)} />
          <Field as="textarea" rows={8} label="Message (plain text)" value={body} maxLength={20000} onChange={(e) => setBody(e.target.value)} disabled={Boolean(issue)} />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" loading={busy} disabled={subject.trim().length < 3 || body.trim().length < 10 || (issue && issue.remaining === 0)}>{issue ? (issue.remaining === 0 ? 'Issue complete' : `Send next batch (${issue.remaining} left)`) : 'Send to subscribers'}</Button>
            {issue && <><span className="text-sm text-muted">{issue.sent} sent so far</span><Button type="button" variant="ghost" onClick={() => { setIssue(null); setSubject(''); setBody(''); }}>Start a new issue</Button></>}
          </div>
        </form>
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Subscribers</h2>
        <div className="flex gap-3"><select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-9 rounded-lg border border-line bg-surface px-3 text-sm"><option value="">All</option><option value="confirmed">Confirmed</option><option value="pending">Waiting</option><option value="unsubscribed">Unsubscribed</option></select><Button variant="secondary" size="sm" onClick={exportCsv}><Download className="h-4 w-4" aria-hidden /> Export confirmed</Button></div>
      </div>
      <div className="mt-3">
        {loading && !data ? <Spinner className="py-10" /> : error ? <ErrorState message={error} onRetry={reload} /> : (
          <div className="overflow-x-auto rounded-xl border border-line"><table className="w-full min-w-[480px] text-left text-sm"><thead className="bg-raised text-muted"><tr><th className="px-4 py-2.5 font-medium">Email</th><th className="px-4 py-2.5 font-medium">Status</th><th className="px-4 py-2.5 font-medium">Joined</th></tr></thead>
            <tbody className="divide-y divide-line">{data.subscribers.map((s) => <tr key={s._id}><td className="px-4 py-3">{s.email}</td><td className="px-4 py-3 capitalize">{s.status}</td><td className="px-4 py-3 text-muted">{formatDate(s.confirmedAt || s.createdAt)}</td></tr>)}{data.subscribers.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-muted">No subscribers yet.</td></tr>}</tbody></table></div>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="subscribers" onPage={setPage} />
      <ConfirmDialog open={confirm} title={issue ? 'Send the next batch?' : 'Send this newsletter?'} confirmLabel="Send" onConfirm={send} onCancel={() => setConfirm(false)}>Emails go to confirmed subscribers and cannot be recalled. Check the subject and message first.</ConfirmDialog>
    </div>
  );
}
