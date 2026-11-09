import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsConfigured, getConsent, setConsent, loadAnalytics } from '../utils/consent';
import Button from './ui/Button';

export default function CookieConsent() {
  const [open, setOpen] = useState(() => !getConsent());
  useEffect(() => {
    loadAnalytics();
    const reopen = () => setOpen(true);
    window.addEventListener('open-cookie-settings', reopen);
    return () => window.removeEventListener('open-cookie-settings', reopen);
  }, []);
  if (!open) return null;
  const choose = (analytics) => { setConsent(analytics); setOpen(false); };
  return (
    <section aria-label="Cookie preferences" className="fixed inset-x-0 bottom-0 z-[55] border-t border-line bg-surface p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4">
        <p className="min-w-[16rem] flex-1 text-sm">
          We use essential storage to keep you signed in and remember your theme and drafts.
          {analyticsConfigured ? ' With your permission we also use privacy-friendly analytics to see which pages are useful.' : ' We do not use advertising or tracking cookies.'} See the <Link to="/cookie-policy" className="underline">cookie policy</Link>.
        </p>
        <div className="flex gap-2">
          {analyticsConfigured ? (<><Button variant="secondary" onClick={() => choose(false)}>Essential only</Button><Button onClick={() => choose(true)}>Allow analytics</Button></>) : <Button onClick={() => choose(false)}>Got it</Button>}
        </div>
      </div>
    </section>
  );
}
