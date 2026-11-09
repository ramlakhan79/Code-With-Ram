import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBox from '../components/SearchBox';
import { ADMIN_NAV, DASHBOARD_NAV } from '../constants/navigation';
import Logo from '../components/Logo';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import ThemeToggle from '../components/ThemeToggle';
import NotificationDropdown from '../components/NotificationDropdown';
import UserMenu from '../components/UserMenu';

const KEY = 'cwr-sidebar-collapsed';

export default function DashboardLayout({ area = 'dashboard' }) {
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } });
  const [drawer, setDrawer] = useState(false);
  const { pathname } = useLocation();
  const items = area === 'admin' ? ADMIN_NAV : DASHBOARD_NAV;

  useEffect(() => setDrawer(false), [pathname]);
  const toggle = () => setCollapsed((c) => { try { localStorage.setItem(KEY, c ? '0' : '1'); } catch { /* ignore */ } return !c; });

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">Skip to content</a>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg/90 px-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 hover:bg-raised lg:hidden" aria-label={drawer ? 'Close navigation' : 'Open navigation'} aria-expanded={drawer} onClick={() => setDrawer((d) => !d)}>
            {drawer ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo to="/dashboard" />
        </div>
        <SearchBox className="mx-4 hidden max-w-sm flex-1 lg:block" />
        <div className="flex items-center gap-1"><Link to="/search" aria-label="Search" className="rounded-lg p-2 hover:bg-raised lg:hidden"><Search className="h-5 w-5" /></Link><ThemeToggle /><NotificationDropdown /><UserMenu /></div>
      </header>

      <div className="flex">
        {drawer && <div className="fixed inset-0 top-16 z-20 bg-black/40 lg:hidden" onClick={() => setDrawer(false)} aria-hidden />}
        <aside
          className={`fixed bottom-0 left-0 top-16 z-20 w-60 border-r border-line bg-bg transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${drawer ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-16' : 'lg:w-60'} lg:shrink-0`}
        >
          <Sidebar items={items} collapsed={collapsed} onToggle={toggle} onNavigate={() => setDrawer(false)} />
        </aside>
        <main id="main" className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-5xl"><Breadcrumbs /><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
