import { useParams } from 'react-router-dom';
import { BadgeCheck, ShieldX } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import { formatDate } from '../utils/format';
import { PageSpinner } from '../components/ui/Feedback';
import Button from '../components/ui/Button';

const API = import.meta.env.VITE_API_URL || '/api';

export default function CertificateVerify() {
  const { code } = useParams();
  const { data, loading, error } = useFetch(`/certificates/${encodeURIComponent(code)}`);
  useSeo({ title: 'Verify certificate', description: 'Check that a Code With Ram certificate is genuine.' });
  if (loading) return <PageSpinner />;
  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <ShieldX className="mx-auto h-12 w-12 text-danger" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold">Certificate not found</h1>
        <p className="mt-2 text-muted">No certificate matches <span className="font-mono">{code}</span>. Check the code and try again.</p>
      </div>
    );
  }
  const c = data.certificate;
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <BadgeCheck className="mx-auto h-12 w-12 text-ok" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold">This certificate is genuine</h1>
      <dl className="mt-8 space-y-4 rounded-xl border border-line bg-surface p-6 text-left">
        <div><dt className="text-sm text-muted">Awarded to</dt><dd className="text-lg font-semibold">{c.studentName}</dd></div>
        <div><dt className="text-sm text-muted">Course</dt><dd className="font-semibold">{c.courseTitle}</dd></div>
        {c.instructorName && <div><dt className="text-sm text-muted">Instructor</dt><dd>{c.instructorName}</dd></div>}
        <div><dt className="text-sm text-muted">Issued</dt><dd>{formatDate(c.issuedAt)}</dd></div>
        <div><dt className="text-sm text-muted">Certificate code</dt><dd className="font-mono">{c.code}</dd></div>
      </dl>
      <a href={`${API}/certificates/${c.code}/pdf`} target="_blank" rel="noopener noreferrer"><Button className="mt-6" variant="secondary">View PDF</Button></a>
    </div>
  );
}
