const KEY = 'cwr-consent';
export const analyticsConfigured = Boolean(import.meta.env.VITE_UMAMI_SRC && import.meta.env.VITE_UMAMI_WEBSITE_ID);

export function getConsent() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
export function setConsent(analytics) {
  try { localStorage.setItem(KEY, JSON.stringify({ necessary: true, analytics, at: new Date().toISOString() })); } catch { /* storage unavailable */ }
  if (analytics) loadAnalytics();
}
// Analytics (Umami) is never loaded without a yes from the visitor
export function loadAnalytics() {
  if (!analyticsConfigured || document.getElementById('umami-script') || !getConsent()?.analytics) return;
  const s = document.createElement('script');
  s.id = 'umami-script'; s.defer = true; s.src = import.meta.env.VITE_UMAMI_SRC;
  s.setAttribute('data-website-id', import.meta.env.VITE_UMAMI_WEBSITE_ID);
  document.head.appendChild(s);
}
