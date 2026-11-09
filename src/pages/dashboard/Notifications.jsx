import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Trash2 } from 'lucide-react';
import api, { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useFetch from '../../hooks/useFetch';
import { timeAgo } from '../../utils/format';
import Button from '../../components/ui/Button';
import Pagination from '../../components/Pagination';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/Feedback';

const PREFS = [['likes', 'Likes on my articles'], ['comments', 'Comments on my articles'], ['replies', 'Replies to my comments']];

export default function Notifications() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useFetch('/notifications', { page, limit: 20 });

  const open = async (n) => {
    if (!n.read) await api.patch(`/notifications/${n._id}/read`).catch(() => {});
    if (n.link) navigate(n.link); else reload();
  };
  const remove = async (id) => { try { await api.delete(`/notifications/${id}`); reload(); } catch (e) { toast.error(getErrorMessage(e)); } };
  const readAll = async () => { try { await api.post('/notifications/read-all'); reload(); } catch (e) { toast.error(getErrorMessage(e)); } };
  const setPref = async (key, value) => {
    try { const r = await api.patch('/notifications/preferences', { [key]: value }); setUser(r.data.data.user); } catch (e) { toast.error(getErrorMessage(e)); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {data?.unread > 0 && <Button variant="secondary" size="sm" onClick={readAll}>Mark all as read</Button>}
      </div>

      <div className="mt-6">
        {loading && !data ? <Spinner className="py-16" /> : error ? <ErrorState message={error} onRetry={reload} /> : data.notifications.length === 0 ? (
          <EmptyState icon={Bell} title="Nothing yet">Likes, comments and review decisions will appear here.</EmptyState>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {data.notifications.map((n) => (
              <li key={n._id} className="flex items-center gap-3 p-4">
                <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-accent'}`} />
                <button onClick={() => open(n)} className="min-w-0 flex-1 text-left">
                  <span className={`block text-sm ${n.read ? 'text-muted' : 'font-medium'}`}>{n.title}{!n.read && <span className="sr-only"> (unread)</span>}</span>
                  <span className="text-xs text-muted">{timeAgo(n.createdAt)}</span>
                </button>
                <button aria-label="Delete notification" onClick={() => remove(n._id)} className="rounded-lg p-2 text-muted hover:bg-raised hover:text-ink"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Pagination pagination={data?.pagination} noun="notifications" onPage={setPage} />

      <section className="mt-10" aria-labelledby="pref-h">
        <h2 id="pref-h" className="text-lg font-semibold">Preferences</h2>
        <p className="mt-1 text-sm text-muted">Review decisions and announcements are always delivered.</p>
        <ul className="mt-3 space-y-2">
          {PREFS.map(([k, label]) => (
            <li key={k}><label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[rgb(var(--accent))]" checked={user.notificationPrefs?.[k] !== false} onChange={(e) => setPref(k, e.target.checked)} /> {label}</label></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
