import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Forbidden() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-4xl font-bold">No access</h1>
      <p className="mt-3 text-muted">Your account doesn't have permission to open this page.</p>
      <Link to="/dashboard"><Button className="mt-6">Back to dashboard</Button></Link>
    </div>
  );
}
