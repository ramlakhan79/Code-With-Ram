import { useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';
import Field from './ui/Field';
import { FormError } from './ui/Feedback';

export default function AssignmentPanel({ lesson, submission, onSubmitted }) {
  const toast = useToast();
  const [text, setText] = useState(submission?.text || '');
  const [link, setLink] = useState(submission?.link || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async (e) => {
    e.preventDefault();
    setError('');
    if (!text.trim() && !link.trim()) return setError('Add some text or a link to your work.');
    setBusy(true);
    try {
      const res = await api.post(`/courses/lessons/${lesson._id}/assignment`, { text, link });
      toast.success('Submitted');
      onSubmitted(res.data.data);
    } catch (err) {
      const list = err.response?.data?.errors;
      setError(list ? list.map((x) => x.message).join(' ') : getErrorMessage(err));
    } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="rounded-xl border border-line bg-raised p-4"><h2 className="text-sm font-semibold">Instructions</h2><p className="mt-1 whitespace-pre-line text-sm">{lesson.assignment.instructions}</p></div>
      {submission?.status === 'graded' && (
        <div role="status" className="mt-4 rounded-xl border border-ok/50 bg-ok/10 p-4 text-sm">
          <p className="font-semibold">Reviewed{typeof submission.score === 'number' && `: ${submission.score}/100`}</p>
          {submission.feedback && <p className="mt-1 whitespace-pre-line">{submission.feedback}</p>}
        </div>
      )}
      {submission?.status === 'submitted' && <p role="status" className="mt-4 text-sm text-muted">Submitted. Your instructor will review it. You can resubmit any time.</p>}
      <form onSubmit={send} className="mt-4 space-y-4" noValidate>
        <FormError>{error}</FormError>
        <Field as="textarea" rows={6} label="Your answer" value={text} onChange={(e) => setText(e.target.value)} maxLength={5000} />
        <Field label="Link to your work (optional)" placeholder="https://github.com/you/project" value={link} onChange={(e) => setLink(e.target.value)} />
        <Button type="submit" loading={busy}>{submission ? 'Resubmit' : 'Submit assignment'}</Button>
      </form>
    </div>
  );
}
