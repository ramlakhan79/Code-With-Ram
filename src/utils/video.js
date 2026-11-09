// Turns a pasted https link into something safe to embed. Anything unrecognised becomes a plain link.
export function parseVideo(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '');
    const ytId = host === 'youtu.be' ? u.pathname.slice(1)
      : host === 'youtube.com' ? (u.searchParams.get('v') || (u.pathname.startsWith('/embed/') ? u.pathname.split('/')[2] : null)) : null;
    if (ytId && /^[\w-]{6,20}$/.test(ytId)) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${ytId}` };
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (/^\d+$/.test(id)) return { kind: 'embed', src: `https://player.vimeo.com/video/${id}` };
    }
    if (/\.(mp4|webm|ogg)$/i.test(u.pathname)) return { kind: 'file', src: url };
  } catch { /* fall through */ }
  return { kind: 'link', src: url };
}
