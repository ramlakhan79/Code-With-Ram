import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

const LEVEL = { info: ['border-focus/40 bg-focus/10', Info], warning: ['border-accent/60 bg-accent/15', AlertTriangle], success: ['border-ok/50 bg-ok/10', CheckCircle2] };
const read = () => { try { return localStorage.getItem('cwr-dismissed-banner'); } catch { return null; } };

export default function AnnouncementBanner() {
  const { settings } = usePlatform();
  const [dismissed, setDismissed] = useState(read);
  const b = settings?.banner;
  if (!b || dismissed === String(b.id)) return null;
  const [cls, Icon] = LEVEL[b.level] || LEVEL.info;
  const close = () => { try { localStorage.setItem('cwr-dismissed-banner', String(b.id)); } catch { /* ignore */ } setDismissed(String(b.id)); };
  return (
    <div role="region" aria-label="Announcement" className={`flex items-center gap-3 border-b px-4 py-2 text-sm ${cls}`}>
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      <p className="flex-1">{b.message} {b.link && (b.link.startsWith('/') ? <Link to={b.link} className="font-medium underline">Learn more</Link> : <a href={b.link} className="font-medium underline" rel="noopener noreferrer">Learn more</a>)}</p>
      <button onClick={close} aria-label="Dismiss announcement" className="rounded p-1 hover:bg-black/10"><X className="h-4 w-4" /></button>
    </div>
  );
}
