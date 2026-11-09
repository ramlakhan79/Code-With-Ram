import { useParams } from 'react-router-dom';
import ProblemWorkspace from '../components/ProblemWorkspace';

export default function ProblemPage() {
  const { slug } = useParams();
  return <ProblemWorkspace key={slug} base={`/practice/problems/${slug}`} storageId={slug} />;
}
