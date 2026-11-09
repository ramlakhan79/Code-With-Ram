import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
let scriptPromise;
const loadScript = () => {
  scriptPromise ||= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load Google sign-in'));
    document.head.appendChild(s);
  });
  return scriptPromise;
};

// Renders nothing unless VITE_GOOGLE_CLIENT_ID is set
export default function GoogleButton({ onSuccess, onError, remember }) {
  const ref = useRef(null);
  const { googleLogin } = useAuth();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;
    loadScript()
      .then(() => {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async ({ credential }) => {
            try { onSuccess(await googleLogin(credential, remember)); } catch (e) { onError(getErrorMessage(e)); }
          },
        });
        window.google.accounts.id.renderButton(ref.current, { theme: 'outline', size: 'large', width: 320, text: 'continue_with' });
      })
      .catch(() => setFailed(true));
  }, [googleLogin, onSuccess, onError, remember]);

  if (!CLIENT_ID) return null;
  if (failed) return <p className="text-sm text-muted">Google sign-in could not be loaded.</p>;
  return <div ref={ref} className="flex justify-center" />;
}
