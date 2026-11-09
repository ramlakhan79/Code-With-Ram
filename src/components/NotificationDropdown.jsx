import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import api from '../api/client';
import { timeAgo } from '../utils/format';
import Dropdown from './ui/Dropdown';
import { Spinner } from './ui/Feedback';

function List({ close, setUnread }) {
  const [items, setItems] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    api.get('/notifications', { params: { limit: 8 } }).then((r) => { setItems(r.data.data.notifications); setUnread(r.data.data.unread); }).catch(() => setItems([]));
  }, [setUnread]);

  const open = async (n) => {
    close();
    if (!n.read) { api.patch(`/notifications/${n._id}/read`).catch(() => {}); setUnread((u) => Math.max(0, u - 1)); }
    if (n.link) navigate(n.link);
  };
  const readAll = async () => { await api.post('/notifications/read-all'); setItems((l) => l.map((n) => ({ ...n, read: true }))); setUnread(0); };

  return (
    <div className="w-80 max-w-[85vw]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 className="text-sm font-semibold">Notifications</h2>
        <button className="text-xs underline" onClick={readAll}>Mark all as read</button>
      </div>
      {!items ? <Spinner className="py-8" /> : items.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted">You're all caught up.</p>
      ) : (
        <ul className="max-h-80 divide-y divide-line overflow-y-auto">
          {items.map((n) => (
            <li key={n._id}>
              <button onClick={() => open(n)} className="flex w-full gap-3 px-4 py-3 text-left hover:bg-raised">
                <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-accent'}`} />
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm ${n.read ? 'text-muted' : ''}`}>{n.title}</span>
                  <span className="text-xs text-muted">{timeAgo(n.createdAt)}{!n.read && <span className="sr-only"> (unread)</span>}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link to="/dashboard/notifications" onClick={close} className="block border-t border-line px-4 py-3 text-center text-sm underline">See all and preferences</Link>
    </div>
  );
}

export default function NotificationDropdown() {
  const [unread, setUnread] = useState(0);
  const poll = useCallback(() => {
    if (document.visibilityState === 'visible') api.get('/notifications/unread-count').then((r) => setUnread(r.data.data.unread)).catch(() => {});
  }, []);
  useEffect(() => {
    poll();
    const t = setInterval(poll, 60000); // simple polling: no paid real-time service needed
    document.addEventListener('visibilitychange', poll);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', poll); };
  }, [poll]);

  return (
    <Dropdown
      label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
      trigger={<span className="relative"><Bell className="h-5 w-5" aria-hidden />{unread > 0 && <span aria-hidden className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">{unread > 9 ? '9+' : unread}</span>}</span>}
    >
      {(close) => <List close={close} setUnread={setUnread} />}
    </Dropdown>
  );
}
