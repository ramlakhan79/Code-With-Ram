import { useEffect, useRef } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
let scriptPromise;
const loadScript = () => {
  scriptPromise ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return scriptPromise;
};

// Renders nothing unless VITE_TURNSTILE_SITE_KEY is set. onToken receives the token (or '' when it expires).
export default function Turnstile({ onToken }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!SITE_KEY) return undefined;
    let widgetId;
    loadScript().then(() => {
      widgetId = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        callback: onToken,
        'expired-callback': () => onToken(''),
      });
    });
    return () => { if (widgetId !== undefined) window.turnstile?.remove(widgetId); };
  }, [onToken]);
  return SITE_KEY ? <div ref={ref} /> : null;
}
export const turnstileEnabled = Boolean(SITE_KEY);
