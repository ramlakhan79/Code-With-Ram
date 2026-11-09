import { useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from './ui/ConfirmDialog';

const REASONS = [
  ['spam', 'Spam or advertising'], ['abuse', 'Harassment or abuse'], ['inappropriate', 'Inappropriate content'],
  ['copyright', 'Copyright problem'], ['other', 'Something else'],
];

export default function ReportDialog({ open, articleId, commentId, endpoint, extra, onClose, title }) {
  const toast = useToast();
  const [reason, setReason] = useState('spam');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setBusy(true);
    try {
      const res = await api.post(endpoint || `/articles/${articleId}/report`, { reason, details: details || undefined, commentId, ...extra });
      toast.success(res.data.message);
      setDetails('');
      onClose();
    } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };
  return (
    <ConfirmDialog open={open} title={title || (commentId ? 'Report this comment' : 'Report this article')} confirmLabel="Send report" loading={busy} onConfirm={send} onCancel={onClose}>
      <fieldset className="mt-2 space-y-2 text-ink">
        <legend className="sr-only">Reason</legend>
        {REASONS.map(([v, l]) => (
          <label key={v} className="flex items-center gap-2 text-sm"><input type="radio" name="reason" checked={reason === v} onChange={() => setReason(v)} className="accent-[rgb(var(--accent))]" /> {l}</label>
        ))}
      </fieldset>
      <label className="mt-3 block text-sm text-ink">Details (optional)
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={500} rows={3} className="mt-1 w-full rounded-lg border border-line bg-surface p-2 text-sm" />
      </label>
    </ConfirmDialog>
  );
}
