import Button from './ui/Button';

export default function Pagination({ pagination, onPage, noun = 'results' }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total } = pagination;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
      <p className="text-muted">Page {page} of {pages} ({total} {noun})</p>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</Button>
        <Button size="sm" variant="secondary" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</Button>
      </div>
    </nav>
  );
}
