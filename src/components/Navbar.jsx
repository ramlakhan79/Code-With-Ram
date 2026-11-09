import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_LINKS } from '../constants/navigation';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import NotificationDropdown from './NotificationDropdown';
import UserMenu from './UserMenu';
import Button from './ui/Button';
import SearchBox from './SearchBox';

const linkClass = ({ isActive }) => `rounded-lg px-3 py-2 text-sm hover:bg-raised ${isActive ? 'font-semibold' : 'text-muted'}`;

export default function Navbar() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {PUBLIC_LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>)}
          </nav>
        </div>
        <SearchBox className="mx-4 hidden max-w-sm flex-1 lg:block" />
        <div className="flex items-center gap-1">
          <Link to="/search" aria-label="Search" className="rounded-lg p-2 hover:bg-raised lg:hidden"><Search className="h-5 w-5" /></Link>
          <ThemeToggle />
          {user && <NotificationDropdown />}
          {user ? <UserMenu /> : !loading && (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/register"><Button size="sm">Sign up free</Button></Link>
            </div>
          )}
          <button className="rounded-lg p-2 hover:bg-raised md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line md:hidden"
            onClick={() => setOpen(false)}
          >
            <div className="flex flex-col gap-1 p-4">
              {PUBLIC_LINKS.map((l) => <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink>)}
              {!user && (
                <div className="mt-2 flex gap-2">
                  <Link to="/login" className="flex-1"><Button variant="secondary" className="w-full">Log in</Button></Link>
                  <Link to="/register" className="flex-1"><Button className="w-full">Sign up free</Button></Link>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
