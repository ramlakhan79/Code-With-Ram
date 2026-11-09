import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { ROLE_LABELS } from '../../constants/navigation';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const ALL_ROLES = Object.keys(ROLE_LABELS);
const select = 'h-10 rounded-lg border border-line bg-surface px-3 text-sm';

function useDebounced(value, ms = 350) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}

function RolesDialog({ target, onClose, onSaved }) {
  const toast = useToast();
  const [roles, setRoles] = useState(target.roles);
  const [busy, setBusy] = useState(false);
  const toggle = (r) => setRoles((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));

  const save = async () => {
    setBusy(true);
    try {
      await api.patch(`/users/admin/${target.id}/roles`, { roles });
      toast.success(`Roles updated for @${target.username}`);
      onSaved();
    } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };
  return (
    <ConfirmDialog open title={`Roles for @${target.username}`} confirmLabel="Save roles" loading={busy} onConfirm={save} onCancel={onClose}>
      <fieldset className="mt-2 space-y-2 text-ink">
        <legend className="sr-only">Roles</legend>
        {ALL_ROLES.map((r) => (
          <label key={r} className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--accent))]" checked={roles.includes(r) || r === 'student'} disabled={r === 'student'} onChange={() => toggle(r)} />
            {ROLE_LABELS[r]}
          </label>
        ))}
      </fieldset>
      <p className="mt-3 text-xs">The person is signed out of all devices when roles change. Only a super admin can manage admin roles.</p>
    </ConfirmDialog>
  );
}

export default function AdminUsers() {
  const { user: me, can } = useAuth();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [statusChange, setStatusChange] = useState(null);
  const [busy, setBusy] = useState(false);
  const dq = useDebounced(q);

  useEffect(() => setPage(1), [dq, role, status]);
  const params = { page, limit: 15, ...(dq && { q: dq }), ...(role && { role }), ...(status && { status }) };
  const { data, loading, error, reload } = useFetch('/users/admin', params);

  const applyStatus = async () => {
    setBusy(true);
    try {
      await api.patch(`/users/admin/${statusChange.user.id}/status`, { status: statusChange.status });
      toast.success(`@${statusChange.user.username} is now ${statusChange.status}`);
      setStatusChange(null);
      reload();
    } catch (e) { toast.error(getErrorMessage(e)); setStatusChange(null); } finally { setBusy(false); }
  };

  const canStatus = can('user:manage') || can('user:suspend');
  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted" aria-hidden />
          <input aria-label="Search users" placeholder="Search name, username or email" value={q} onChange={(e) => setQ(e.target.value)} className={`${select} w-full pl-9`} />
        </div>
        <select aria-label="Filter by role" className={select} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>{ALL_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
        <select aria-label="Filter by status" className={select} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="deactivated">Deactivated</option>
        </select>
      </div>

      <div className="mt-5">
        {loading && !data ? <Spinner className="py-16" />
          : error ? <ErrorState message={error} onRetry={reload} />
          : data.users.length === 0 ? <EmptyState title="No users match these filters">Try a different search or clear the filters.</EmptyState>
          : (
            <div className={`overflow-x-auto rounded-xl border border-line ${loading ? 'opacity-60' : ''}`}>
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-raised text-muted"><tr>
                  <th className="px-4 py-2.5 font-medium">User</th><th className="px-4 py-2.5 font-medium">Roles</th>
                  <th className="px-4 py-2.5 font-medium">Status</th><th className="px-4 py-2.5 font-medium">Joined</th><th className="px-4 py-2.5"><span className="sr-only">Actions</span></th>
                </tr></thead>
                <tbody className="divide-y divide-line">
                  {data.users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar user={u} size={32} /><div className="min-w-0"><p className="truncate font-medium">{u.name}</p><p className="truncate text-xs text-muted">{u.email}</p></div></div></td>
                      <td className="px-4 py-3">{u.roles.filter((r) => r !== 'student').map((r) => ROLE_LABELS[r]).join(', ') || <span className="text-muted">Student</span>}</td>
                      <td className="px-4 py-3 capitalize">{u.status}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        {u.id !== me.id && (
                          <div className="flex justify-end gap-2">
                            {can('role:assign') && <Button size="sm" variant="secondary" onClick={() => setEditing(u)}>Roles</Button>}
                            {canStatus && (u.status === 'active'
                              ? <Button size="sm" variant="secondary" onClick={() => setStatusChange({ user: u, status: 'suspended' })}>Suspend</Button>
                              : <Button size="sm" variant="secondary" onClick={() => setStatusChange({ user: u, status: 'active' })}>Activate</Button>)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {data && data.pagination.pages > 1 && (
        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted">Page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} users)</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button size="sm" variant="secondary" disabled={page >= data.pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </nav>
      )}

      {editing && <RolesDialog target={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
      <ConfirmDialog
        open={Boolean(statusChange)} danger={statusChange?.status === 'suspended'} loading={busy}
        title={statusChange?.status === 'suspended' ? 'Suspend this user?' : 'Activate this user?'}
        confirmLabel={statusChange?.status === 'suspended' ? 'Suspend' : 'Activate'}
        onConfirm={applyStatus} onCancel={() => setStatusChange(null)}
      >
        {statusChange?.status === 'suspended'
          ? `@${statusChange?.user.username} will be signed out everywhere and cannot log in until activated.`
          : `@${statusChange?.user.username} will be able to log in again.`}
      </ConfirmDialog>
    </div>
  );
}
