import Editor from '@monaco-editor/react';
import useIsDark from '../hooks/useIsDark';
import { Spinner } from './ui/Feedback';

// Monaco is loaded on demand (from a public CDN by the loader) so it never bloats the main bundle.
export default function CodeEditor({ value, onChange, language, readOnly = false, height = '100%' }) {
  const dark = useIsDark();
  return (
    <Editor
      height={height} language={language} value={value} theme={dark ? 'vs-dark' : 'light'}
      onChange={(v) => onChange?.(v ?? '')} loading={<Spinner className="h-full" label="Loading editor" />}
      options={{ minimap: { enabled: false }, fontSize: 14, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 4, readOnly, ariaLabel: 'Code editor', fontFamily: "'JetBrains Mono', ui-monospace, monospace", padding: { top: 12 } }}
    />
  );
}
