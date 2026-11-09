import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const KEY = 'cwr-theme';
const ThemeContext = createContext(null);
const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(theme, animate) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), 300);
  }
  root.classList.toggle('dark', theme === 'dark' || (theme === 'system' && systemDark()));
}
const readStored = () => {
  try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; }
};

export function ThemeProvider({ children }) {
  const { user } = useAuth();
  const [theme, setThemeState] = useState(readStored);

  // Logged-in users: the database value wins over the local one
  useEffect(() => {
    if (user?.theme) {
      setThemeState(user.theme);
      try { localStorage.setItem(KEY, user.theme); } catch { /* storage unavailable */ }
    }
  }, [user?.id, user?.theme]);

  useEffect(() => {
    applyTheme(theme, false);
    if (theme !== 'system') return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system', true);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next) => {
    applyTheme(next, true);
    setThemeState(next);
    try { localStorage.setItem(KEY, next); } catch { /* storage unavailable */ }
    if (user) api.patch('/users/me/theme', { theme: next }).catch(() => {});
  }, [user]);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
