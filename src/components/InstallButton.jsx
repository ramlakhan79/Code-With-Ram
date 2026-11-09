import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

// Shows an "Install app" button only when the browser says the site can be installed
export default function InstallButton() {
  const [evt, setEvt] = useState(null);
  useEffect(() => {
    const on = (e) => { e.preventDefault(); setEvt(e); };
    window.addEventListener('beforeinstallprompt', on);
    window.addEventListener('appinstalled', () => setEvt(null));
    return () => window.removeEventListener('beforeinstallprompt', on);
  }, []);
  if (!evt) return null;
  return <button onClick={async () => { evt.prompt(); await evt.userChoice; setEvt(null); }} className="inline-flex items-center gap-1.5 text-muted hover:text-ink"><Download className="h-4 w-4" aria-hidden /> Install app</button>;
}
