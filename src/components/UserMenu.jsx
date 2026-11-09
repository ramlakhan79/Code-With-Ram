import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, UserRound, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_ACCESS } from '../constants/navigation';
import Dropdown from './ui/Dropdown';
import Avatar from './ui/Avatar';

const item = 'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-raised';

export default function UserMenu() {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();
  return (
    <Dropdown label="Account menu" trigger={<Avatar user={user} />} panelClassName="w-60 p-1">
      {(close) => (
        <>
          <div className="border-b border-line px-3 py-2">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted">@{user.username}</p>
          </div>
          <nav className="py-1" onClick={close}>
            <Link className={item} to="/dashboard"><LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard</Link>
            <Link className={item} to="/dashboard/profile"><UserRound className="h-4 w-4" aria-hidden /> Profile</Link>
            <Link className={item} to="/dashboard/settings"><Settings className="h-4 w-4" aria-hidden /> Settings</Link>
            {can(ADMIN_ACCESS) && <Link className={item} to="/admin"><Shield className="h-4 w-4" aria-hidden /> Admin</Link>}
          </nav>
          <button className={`${item} border-t border-line`} onClick={async () => { close(); await logout(); navigate('/'); }}>
            <LogOut className="h-4 w-4" aria-hidden /> Log out
          </button>
        </>
      )}
    </Dropdown>
  );
}
