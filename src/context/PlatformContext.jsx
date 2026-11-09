import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const PlatformContext = createContext({ settings: null });
const base = import.meta.env.VITE_API_URL || '/api';

// Site-wide settings (maintenance mode, announcement banner, registration). Fetched without logging in.
export function PlatformProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const load = useCallback(() => axios.get(`${base}/platform/settings`).then((r) => setSettings(r.data.data)).catch(() => {}), []);
  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60000);
    window.addEventListener('platform:maintenance', load); // any API call that gets a maintenance reply refreshes this
    window.addEventListener('focus', load);
    return () => { clearInterval(t); window.removeEventListener('platform:maintenance', load); window.removeEventListener('focus', load); };
  }, [load]);
  return <PlatformContext.Provider value={{ settings, reload: load }}>{children}</PlatformContext.Provider>;
}
export const usePlatform = () => useContext(PlatformContext);
