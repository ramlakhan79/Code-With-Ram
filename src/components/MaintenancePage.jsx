import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import Button from './ui/Button';

export default function MaintenancePage() {
  const { settings, reload } = usePlatform();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Wrench className="h-12 w-12 text-muted" aria-hidden />
      <h1 className="mt-4 text-3xl font-bold">We'll be right back</h1>
      <p className="mt-3 max-w-md text-muted">{settings?.maintenance.message || 'Code With Ram is down for maintenance. Please check back soon.'}</p>
      <div className="mt-6 flex gap-3"><Button onClick={reload}>Check again</Button><Link to="/login"><Button variant="ghost">Staff sign in</Button></Link></div>
    </main>
  );
}
