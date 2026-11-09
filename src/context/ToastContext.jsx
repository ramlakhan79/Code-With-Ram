import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const id = useRef(0);

  const dismiss = useCallback((tid) => setToasts((t) => t.filter((x) => x.id !== tid)), []);
  const push = useCallback((type, message) => {
    const tid = ++id.current;
    setToasts((t) => [...t, { id: tid, type, message }]);
    window.setTimeout(() => dismiss(tid), 5000);
  }, [dismiss]);

  const api = useRef({ success: (m) => push('success', m), error: (m) => push('error', m) });
  api.current.success = (m) => push('success', m);
  api.current.error = (m) => push('error', m);

  return (
    <ToastContext.Provider value={api.current}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-line bg-surface p-3 text-sm shadow-lg"
            >
              {t.type === 'success'
                ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden />
                : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />}
              <p className="flex-1">{t.message}</p>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss message" className="text-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
