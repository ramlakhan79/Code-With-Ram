import { useState } from 'react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import ProblemForm from '../../components/ProblemForm';
import { DifficultyBadge } from '../../components/Verdict';
import StatusBadge from '../../components/StatusBadge';

export default function SuggestProblem() {
  const toast = useToast();
  const { data, reload } = useFetch('/practice/suggestions/mine');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const send = async (payload) => {
    setError('');
    setBusy(true);
    try {
      await api.post('/practice/suggestions', payload);
      toast.success('Thanks! Your suggestion is with the admins.');
      setFormKey((k) => k + 1);
      reload();
      window.scrollTo({ top: 0 });
    } catch (e) {
      const list = e.response?.data?.errors;
      setError(list ? list.map((x) => `${x.field}: ${x.message}`).join(' · ') : getErrorMessage(e));
    } finally { setBusy(false); }
  };
  const label = { suggested: 'In review', published: 'published', draft: 'draft', archived: 'archived' };

  return (
    <div>
      <h1 className="text-2xl font-bold">Suggest a problem</h1>
      <p className="mt-1 text-sm text-muted">Describe a problem and give a few sample cases. An admin adds hidden test cases and publishes it.</p>
      {data?.problems.length > 0 && (
        <section aria-labelledby="mine-h" className="mt-6"><h2 id="mine-h" className="text-sm font-semibold">Your suggestions</h2>
          <ul className="mt-2 divide-y divide-line rounded-xl border border-line bg-surface text-sm">{data.problems.map((p) => <li key={p._id} className="flex flex-wrap items-center gap-3 p-3"><span className="font-medium">{p.title}</span><DifficultyBadge difficulty={p.difficulty} /><span className="rounded-full border border-line px-2.5 py-0.5 text-xs capitalize">{label[p.status] || p.status}</span></li>)}</ul>
        </section>
      )}
      <div className="mt-8"><ProblemForm key={formKey} mode="suggest" submitLabel="Send suggestion" onSubmit={send} error={error} busy={busy} /></div>
    </div>
  );
}
