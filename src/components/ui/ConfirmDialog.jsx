import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';

export default function ConfirmDialog({ open, title, children, confirmLabel = 'Confirm', danger, loading, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    cancelRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onCancel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
        >
          <div role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-xl">
            <h2 id="dlg-title" className="text-lg font-semibold">{title}</h2>
            <div className="mt-2 text-sm text-muted">{children}</div>
            <div className="mt-6 flex justify-end gap-2">
              <Button ref={cancelRef} variant="secondary" onClick={onCancel}>Cancel</Button>
              <Button variant={danger ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
