import { Loader2, AlertCircle } from 'lucide-react';
import Button from './Button';

export function Spinner({ label = 'Loading', className = '' }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-2 text-muted ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function PageSpinner() {
  return <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>;
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line px-6 py-10 text-center">
      {Icon && <Icon className="mb-3 h-8 w-8 text-muted" aria-hidden />}
      <h3 className="text-base font-semibold">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border border-danger/40 px-6 py-10 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-danger" aria-hidden />
      <p className="max-w-sm text-sm">{message}</p>
      {onRetry && <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return <div role="alert" className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm">{children}</div>;
}
