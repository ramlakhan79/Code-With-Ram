import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const KEY = 'cwr-recent-searches';
const readLocal = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const TYPE_LABEL = { article: 'Article', course: 'Course', problem: 'Problem', contest: 'Contest', discussion: 'Question', user: 'Person' };

// Combobox: shows recent searches when focused, live suggestions as you type, and always lets Enter run a full search.
export default function SearchBox({ className = '', autoFocus = false, onDone }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const id = useId();
  const box = useRef(null);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!open) return;
    if (user) api.get('/search/recent').then((r) => setRecent(r.data.data.recent.map((x) => x.q))).catch(() => {});
    else setRecent(readLocal());
  }, [open, user]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setSuggestions([]); return undefined; }
    const t = setTimeout(() => api.get('/search/suggest', { params: { q: term } }).then((r) => setSuggestions(r.data.data.suggestions)).catch(() => setSuggestions([])), 200);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const away = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  const typing = q.trim().length >= 2;
  const options = typing
    ? [{ kind: 'search', label: `Search for “${q.trim()}”`, q: q.trim() }, ...suggestions.map((s) => ({ kind: 'go', label: s.title, tag: TYPE_LABEL[s.type], url: s.url }))]
    : recent.map((r) => ({ kind: 'search', label: r, q: r, recent: true }));

  const run = (term) => {
    const t = term.trim();
    if (t.length < 2) return;
    if (!user) { try { localStorage.setItem(KEY, JSON.stringify([t, ...readLocal().filter((x) => x !== t)].slice(0, 10))); } catch { /* storage unavailable */ } }
    setOpen(false); setQ(''); onDone?.();
    navigate(`/search?q=${encodeURIComponent(t)}`);
  };
  const choose = (o) => { if (o.kind === 'go') { setOpen(false); setQ(''); onDone?.(); navigate(o.url); } else run(o.q); };
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
    else if (e.key === 'Escape') { setOpen(false); setActive(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0 && options[active]) choose(options[active]); else run(q); }
  };

  return (
    <div ref={box} className={`relative ${className}`} role="search">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted" aria-hidden />
      <input
        role="combobox" aria-label="Search the site" aria-expanded={open && options.length > 0} aria-controls={`${id}-list`} aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${id}-o${active}` : undefined} autoFocus={autoFocus} autoComplete="off" value={q} placeholder="Search articles, courses, problems…"
        onChange={(e) => { setQ(e.target.value); setActive(-1); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey}
        className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm placeholder:text-muted/70"
      />
      {open && options.length > 0 && (
        <ul id={`${id}-list`} role="listbox" aria-label={typing ? 'Suggestions' : 'Recent searches'} className="absolute left-0 right-0 top-full z-40 mt-1 max-h-80 overflow-y-auto rounded-xl border border-line bg-surface p-1 shadow-lg">
          {!typing && <li role="presentation" className="px-3 py-1.5 text-xs font-medium text-muted">Recent searches</li>}
          {options.map((o, i) => (
            <li key={`${o.kind}-${o.label}-${i}`} id={`${id}-o${i}`} role="option" aria-selected={active === i} onMouseDown={(e) => { e.preventDefault(); choose(o); }} onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm ${active === i ? 'bg-raised' : ''}`}>
              {o.recent ? <Clock className="h-4 w-4 shrink-0 text-muted" aria-hidden /> : <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden />}
              <span className="min-w-0 flex-1 truncate">{o.label}</span>{o.tag && <span className="shrink-0 text-xs text-muted">{o.tag}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
