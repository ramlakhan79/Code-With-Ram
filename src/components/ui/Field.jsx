import { forwardRef, useId } from 'react';

const Field = forwardRef(function Field({ label, error, hint, className = '', as: Tag = 'input', ...props }, ref) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <Tag
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-lg border bg-surface px-3 py-2 text-sm placeholder:text-muted/70 ${error ? 'border-danger' : 'border-line'} ${Tag === 'input' ? 'h-10' : ''}`}
        {...props}
      />
      {error
        ? <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">{error}</p>
        : hint && <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>}
    </div>
  );
});
export default Field;
