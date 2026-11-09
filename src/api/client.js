import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL, withCredentials: true });

// CSRF token lives in memory only. After a reload it is re-fetched from /auth/csrf.
let csrfToken = null;
export const setCsrfToken = (t) => { csrfToken = t || null; };

async function ensureCsrf() {
  if (csrfToken) return csrfToken;
  try {
    const res = await axios.get(`${baseURL}/auth/csrf`, { withCredentials: true });
    csrfToken = res.data?.data?.csrfToken || null;
  } catch { /* not signed in: no token needed */ }
  return csrfToken;
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (!['get', 'head', 'options'].includes(method)) {
    const token = await ensureCsrf();
    if (token) config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

const NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/verify-email', '/auth/google', '/auth/logout'];
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 503 && response.data?.code === 'MAINTENANCE') window.dispatchEvent(new Event('platform:maintenance'));
    const retryable =
      response?.status === 401 &&
      config &&
      !config._retried &&
      ['UNAUTHENTICATED', 'TOKEN_INVALID'].includes(response.data?.code) &&
      !NO_REFRESH.some((p) => config.url?.startsWith(p));
    if (!retryable) return Promise.reject(error);

    config._retried = true;
    try {
      refreshing ||= api
        .post('/auth/refresh')
        .then((r) => { setCsrfToken(r.data.data.csrfToken); })
        .finally(() => { refreshing = null; });
      await refreshing;
      return api(config);
    } catch (refreshError) {
      setCsrfToken(null);
      window.dispatchEvent(new Event('auth:expired'));
      return Promise.reject(error);
    }
  }
);

export default api;

export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection and try again.';
  return fallback;
}

// Maps backend field errors ({errors:[{field,message}]}) onto react-hook-form fields
export function applyServerErrors(err, setError) {
  const list = err?.response?.data?.errors;
  if (!Array.isArray(list)) return false;
  list.forEach((e) => e.field && setError(e.field, { type: 'server', message: e.message }));
  return list.length > 0;
}
