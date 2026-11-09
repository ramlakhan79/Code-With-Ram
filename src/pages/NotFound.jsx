import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted">The address may be mistyped, or the page may have moved.</p>
      <Link to="/"><Button className="mt-6">Go to home</Button></Link>
    </div>
  );
}
