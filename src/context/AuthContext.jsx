import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { setCsrfToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/auth/me')
      .then((r) => active && setUser(r.data.data.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false));
    const onExpired = () => setUser(null);
    window.addEventListener('auth:expired', onExpired);
    return () => { active = false; window.removeEventListener('auth:expired', onExpired); };
  }, []);

  const adopt = useCallback((data) => {
    setCsrfToken(data.csrfToken);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    setUser,
    login: async (values) => adopt((await api.post('/auth/login', values)).data.data),
    verifyEmail: async (values) => adopt((await api.post('/auth/verify-email', values)).data.data),
    googleLogin: async (credential, remember) => adopt((await api.post('/auth/google', { credential, remember })).data.data),
    register: (values) => api.post('/auth/register', values),
    logout: async () => {
      try { await api.post('/auth/logout'); } catch { /* session may already be gone */ }
      setCsrfToken(null);
      setUser(null);
    },
    // UI hint only: the server enforces every permission
    can: (permission) => Boolean(user && (Array.isArray(permission) ? permission : [permission]).some((p) => user.permissions.includes('*') || user.permissions.includes(p))),
  }), [user, loading, adopt]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
