import { useState } from 'react';
import api, { getErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ErrorState, FormError, Spinner } from '../../components/ui/Feedback';

export default function AdminCategories() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch('/categories');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const add = async (e) => {
    e.preventDefault();
    setFormError('');
    setAdding(true);
    try {
      await api.post('/categories', { name, description: description || undefined, scopes: ['article', 'course'] });
      setName(''); setDescription(''); toast.success('Category added'); reload();
    } catch (err) {
      const list = err.response?.data?.errors;
      setFormError(list ? list.map((x) => x.message).join(' ') : getErrorMessage(err));
    } finally { setAdding(false); }
  };
  const saveEdit = async () => {
    try { await api.patch(`/categories/${editing._id}`, { name: editing.name, description: editing.description }); toast.success('Category updated'); setEditing(null); reload(); } catch (e) { toast.error(getErrorMessage(e)); }
  };
  const remove = async () => {
    try { await api.delete(`/categories/${deleting._id}`); toast.success('Category deleted'); reload(); } catch (e) { toast.error(getErrorMessage(e)); } finally { setDeleting(null); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>
      <form onSubmit={add} className="mt-6 grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-[1fr_2fr_auto] sm:items-end" noValidate>
        <div className="sm:col-span-3"><FormError>{formError}</FormError></div>
        <Field label="Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
        <Field label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
        <Button type="submit" loading={adding} disabled={name.trim().length < 2}>Add category</Button>
      </form>

      <div className="mt-6">
        {loading ? <Spinner className="py-12" /> : error ? <ErrorState message={error} onRetry={reload} /> : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {data.categories.map((c) => (
              <li key={c._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0"><p className="font-medium">{c.name}</p><p className="text-xs text-muted">/{c.slug}{c.description && ` · ${c.description}`}</p></div>
                <div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => setEditing({ ...c })}>Edit</Button><Button size="sm" variant="ghost" onClick={() => setDeleting(c)}>Delete</Button></div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog open={Boolean(editing)} title="Edit category" confirmLabel="Save" onConfirm={saveEdit} onCancel={() => setEditing(null)}>
        {editing && (
          <div className="mt-2 space-y-3 text-ink">
            <Field label="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <Field label="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            <p className="text-xs text-muted">The web address (/{editing.slug}) stays the same so existing links keep working.</p>
          </div>
        )}
      </ConfirmDialog>
      <ConfirmDialog open={Boolean(deleting)} danger title="Delete this category?" confirmLabel="Delete" onConfirm={remove} onCancel={() => setDeleting(null)}>
        “{deleting?.name}” will be removed. Categories used by articles cannot be deleted.
      </ConfirmDialog>
    </div>
  );
}
