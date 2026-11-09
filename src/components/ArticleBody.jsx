import { useEffect, useRef } from 'react';
import { highlightIn } from '../utils/highlight';

// `html` is sanitized by the server on every save before it is stored.
export default function ArticleBody({ html }) {
  const ref = useRef(null);
  useEffect(() => { highlightIn(ref.current); }, [html]);
  return <div ref={ref} className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />;
}
