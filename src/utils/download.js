import api from '../api/client';

// Downloads a file the API generates (CSV, JSON). Goes through the API client so the session and CSRF rules apply.
export async function downloadFile(url, filename, params) {
  const res = await api.get(url, { params, responseType: 'blob' });
  const href = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = href; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(href);
}
