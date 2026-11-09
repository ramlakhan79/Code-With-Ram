import { NavLink } from 'react-router-dom';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ items, collapsed, onToggle, onNavigate }) {
  const { can } = useAuth();
  return (
    <nav aria-label="Sidebar" className="flex h-full flex-col justify-between p-3">
      <ul className="space-y-1">
        {items.filter((i) => !i.permission || can(i.permission)).map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-raised font-semibold' : 'text-muted hover:bg-raised hover:text-ink'} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className={collapsed ? 'lg:sr-only' : ''}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <button
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-raised hover:text-ink lg:flex"
      >
        {collapsed ? <ChevronsRight className="h-5 w-5" aria-hidden /> : <><ChevronsLeft className="h-5 w-5" aria-hidden /> Collapse</>}
      </button>
    </nav>
  );
}
