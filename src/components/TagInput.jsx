import { useEffect, useId, useState } from 'react';
import { X } from 'lucide-react';
import api from '../api/client';

export default function TagInput({ label, value, onChange, max = 5 }) {
  const [text, setText] = useState('');
  const [options, setOptions] = useState([]);
  const id = useId();

  useEffect(() => {
    if (!text.trim()) { setOptions([]); return undefined; }
    const t = setTimeout(() => api.get('/tags', { params: { q: text.trim() } }).then((r) => setOptions(r.data.data.tags.map((x) => x.name))).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [text]);

  const add = (raw) => {
    const name = raw.trim().replace(/,$/, '');
    if (name.length < 2 || value.length >= max || value.some((v) => v.toLowerCase() === name.toLowerCase())) return setText('');
    onChange([...value, name.slice(0, 30)]);
    setText('');
  };
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface p-2">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-raised px-2.5 py-1 text-sm">
            {t}
            <button type="button" aria-label={`Remove tag ${t}`} onClick={() => onChange(value.filter((v) => v !== t))}><X className="h-3.5 w-3.5" /></button>
          </span>
        ))}
        {value.length < max && (
          <>
            <input
              id={id} list={`${id}-opts`} value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(text); }
                if (e.key === 'Backspace' && !text && value.length) onChange(value.slice(0, -1));
              }}
              onBlur={() => text && add(text)}
              placeholder={value.length ? '' : 'Type a tag and press Enter'}
              className="min-w-[140px] flex-1 bg-transparent px-1 py-1 text-sm outline-none"
            />
            <datalist id={`${id}-opts`}>{options.map((o) => <option key={o} value={o} />)}</datalist>
          </>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted">Up to {max} tags. {value.length}/{max} used.</p>
    </div>
  );
}
