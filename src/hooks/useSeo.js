import { useEffect } from 'react';

function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  const created = !el;
  if (!el) { el = create(); document.head.appendChild(el); }
  const prev = el.getAttribute(attr);
  el.setAttribute(attr, value || '');
  return () => { if (created) el.remove(); else el.setAttribute(attr, prev || ''); };
}
const meta = (key, val) => (key.startsWith('og:') ? { sel: `meta[property="${key}"]`, a: 'property' } : { sel: `meta[name="${key}"]`, a: 'name' });

// Sets title, description, Open Graph, Twitter card and canonical URL for the current page; restores them on unmount.
export default function useSeo({ title, description, image, type = 'website' } = {}) {
  useEffect(() => {
    if (!title) return undefined;
    const prevTitle = document.title;
    document.title = `${title} | Code With Ram`;
    const url = window.location.origin + window.location.pathname;
    const restore = [];
    const add = (key, value) => {
      const { sel, a } = meta(key);
      restore.push(setTag(sel, () => { const m = document.createElement('meta'); m.setAttribute(a, key); return m; }, 'content', value));
    };
    add('description', description);
    add('og:title', title); add('og:description', description); add('og:type', type); add('og:url', url);
    if (image) add('og:image', image);
    add('twitter:card', image ? 'summary_large_image' : 'summary');
    add('twitter:title', title); add('twitter:description', description);
    restore.push(setTag('link[rel="canonical"]', () => { const l = document.createElement('link'); l.rel = 'canonical'; return l; }, 'href', url));
    return () => { document.title = prevTitle; restore.forEach((r) => r()); };
  }, [title, description, image, type]);
}
