import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import ProblemForm from '../../components/ProblemForm';
import { ErrorState, PageSpinner } from '../../components/ui/Feedback';

export default function ProblemEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(id ? `/practice/admin/problems/${id}` : null);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  if (id && loading && !data) return <PageSpinner />;
  if (id && error) return <ErrorState message={error} onRetry={reload} />;

  const save = async (payload) => {
    setFormError('');
    setBusy(true);
    try {
      if (id) await api.patch(`/practice/admin/problems/${id}`, payload); else await api.post('/practice/admin/problems', payload);
      toast.success('Problem saved');
      navigate('/admin/problems');
    } catch (e) {
      const list = e.response?.data?.errors;
      setFormError(list ? list.map((x) => `${x.field}: ${x.message}`).join(' · ') : getErrorMessage(e));
      window.scrollTo({ top: 0 });
    } finally { setBusy(false); }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold">{id ? 'Edit problem' : 'New problem'}</h1>
      {data?.problem.suggestedBy && <p className="mt-2 rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm">Suggested by {data.problem.suggestedBy.name} (@{data.problem.suggestedBy.username}). Add hidden test cases, then set the status to Published.</p>}
      <div className="mt-6"><ProblemForm initial={data?.problem} initialTests={data?.tests} submitLabel="Save problem" onSubmit={save} error={formError} busy={busy} /></div>
    </div>
  );
}
