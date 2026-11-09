import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, Play, Send, RotateCcw, Lightbulb, AlertTriangle } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useFetch from '../hooks/useFetch';
import useSeo from '../hooks/useSeo';
import { timeAgo } from '../utils/format';
import ArticleBody from '../components/ArticleBody';
import { DifficultyBadge, VerdictBadge } from '../components/Verdict';
import Button from '../components/ui/Button';
import { ErrorState, PageSpinner, Spinner } from '../components/ui/Feedback';

const CodeEditor = lazy(() => import('../components/CodeEditor'));
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};
const Pre = ({ children, label }) => <pre aria-label={label} className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-line bg-raised p-3 font-mono text-xs">{children || ' '}</pre>;

function LoginPrompt({ what }) {
  const location = useLocation();
  return <p className="rounded-lg border border-dashed border-line p-4 text-sm text-muted"><Link to="/login" state={{ from: location }} className="font-medium text-ink underline">Log in</Link> or <Link to="/register" className="font-medium text-ink underline">create a free account</Link> to {what}.</p>;
}

function Hints({ base, count }) {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(user ? `${base}/hints` : null);
  const [shown, setShown] = useState(0);
  if (!count) return <p className="text-sm text-muted">This problem has no hints.</p>;
  if (!user) return <LoginPrompt what="see hints" />;
  if (loading && !data) return <Spinner />;
  if (error) return <p className="text-sm text-danger">{error}</p>;
  return (
    <div>
      <p className="text-sm text-muted">Try without a hint first. Hints get more specific as you reveal them.</p>
      <ol className="mt-4 space-y-3">{data.hints.slice(0, shown).map((h, i) => <li key={i} className="rounded-lg border border-line bg-raised p-3 text-sm"><span className="font-semibold">Hint {i + 1}.</span> {h}</li>)}</ol>
      {shown < data.hints.length && <Button className="mt-4" size="sm" variant="secondary" onClick={() => setShown((s) => s + 1)}><Lightbulb className="h-4 w-4" aria-hidden /> Show hint {shown + 1} of {data.hints.length}</Button>}
    </div>
  );
}

function Editorial({ base, has, solved }) {
  const { user } = useAuth();
  const { data, loading, error } = useFetch(user && has ? `${base}/editorial` : null, undefined, [solved]);
  if (!has) return <p className="text-sm text-muted">No editorial has been written for this problem yet.</p>;
  if (!user) return <LoginPrompt what="unlock the editorial after solving" />;
  if (loading && !data) return <Spinner />;
  if (error) return <div className="rounded-lg border border-dashed border-line p-4 text-sm"><p className="flex items-center gap-2 font-medium"><Lock className="h-4 w-4" aria-hidden /> Editorial locked</p><p className="mt-1 text-muted">Solve this problem to read the editorial. Working it out yourself is where the learning happens.</p></div>;
  return <ArticleBody html={data.editorial} />;
}

function MySubmissions({ base, codeUrl, refreshKey, onLoad }) {
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(user ? `${base}/submissions` : null, undefined, [refreshKey]);
  if (!user) return <LoginPrompt what="see your submissions" />;
  if (loading && !data) return <Spinner />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.submissions.length) return <p className="text-sm text-muted">You have not submitted anything for this problem yet.</p>;
  const load = async (id) => { try { const r = await api.get(codeUrl(id)); onLoad(r.data.data.submission); } catch (e) { toast.error(getErrorMessage(e)); } };
  return (
    <ul className="divide-y divide-line rounded-xl border border-line text-sm">
      {data.submissions.map((s) => (
        <li key={s._id} className="flex flex-wrap items-center gap-3 p-3">
          <VerdictBadge verdict={s.verdict} /><span className="capitalize text-muted">{s.language}</span>
          <span className="text-muted">{s.passed}/{s.total} tests{s.runtimeMs != null && ` · ${s.runtimeMs} ms`}</span>
          <span className="ml-auto text-xs text-muted">{timeAgo(s.createdAt)}</span>
          <Button size="sm" variant="ghost" onClick={() => load(s._id)}>Load code</Button>
        </li>
      ))}
    </ul>
  );
}

function ResultPanel({ result, busy, mode }) {
  if (busy) return <Spinner className="py-8" label={busy === 'submit' ? 'Judging your submission' : 'Running your code'} />;
  if (!result) return <p className="p-4 text-sm text-muted">Run your code to see output here, or submit it to be judged against all test cases.</p>;
  if (result.kind === 'error') {
    return <div role="alert" className="m-3 flex gap-3 rounded-lg border border-danger/40 bg-danger/10 p-3 text-sm"><AlertTriangle className="h-5 w-5 shrink-0" aria-hidden /><p>{result.message}</p></div>;
  }
  if (result.kind === 'custom') {
    const r = result.result;
    return (
      <div className="space-y-3 p-3 text-sm" aria-live="polite">
        <p className="flex flex-wrap items-center gap-3"><VerdictBadge verdict={r.verdict === 'ok' ? 'ok' : r.verdict} /> <span className="text-muted">{r.timeMs} ms · {Math.round(r.memoryKb / 1024)} MB</span></p>
        {r.compileOutput && <div><p className="mb-1 font-medium">Compiler output</p><Pre>{r.compileOutput}</Pre></div>}
        <div><p className="mb-1 font-medium">Output</p><Pre label="Program output">{r.stdout}</Pre></div>
        {r.stderr && <div><p className="mb-1 font-medium">Errors</p><Pre>{r.stderr}</Pre></div>}
      </div>
    );
  }
  if (result.kind === 'samples') {
    const all = result.results.every((r) => r.verdict === 'ok');
    return (
      <div className="space-y-3 p-3 text-sm" aria-live="polite">
        <p className="font-semibold">{all ? 'All sample cases passed. Submit to run the full test suite.' : 'Some sample cases did not pass.'}</p>
        {result.results.map((r, i) => (
          <details key={i} open={r.verdict !== 'ok'} className="rounded-lg border border-line">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-3 py-2"><span className="font-medium">Sample {i + 1}</span><VerdictBadge verdict={r.verdict} /><span className="text-xs text-muted">{r.timeMs} ms</span></summary>
            <div className="space-y-2 border-t border-line p-3">
              <div><p className="mb-1 text-xs font-medium text-muted">Input</p><Pre>{r.input}</Pre></div>
              <div><p className="mb-1 text-xs font-medium text-muted">Expected</p><Pre>{r.expected}</Pre></div>
              <div><p className="mb-1 text-xs font-medium text-muted">Your output</p><Pre>{r.stdout}</Pre></div>
              {r.compileOutput && <div><p className="mb-1 text-xs font-medium text-muted">Compiler output</p><Pre>{r.compileOutput}</Pre></div>}
              {r.stderr && <div><p className="mb-1 text-xs font-medium text-muted">Errors</p><Pre>{r.stderr}</Pre></div>}
            </div>
          </details>
        ))}
      </div>
    );
  }
  const { submission: s, failure, compileOutput, firstSolve } = result;
  return (
    <div className="space-y-3 p-3 text-sm" aria-live="polite">
      <p className="flex flex-wrap items-center gap-3 text-base font-semibold"><VerdictBadge verdict={s.verdict} /> {s.passed} / {s.total} test cases passed</p>
      {firstSolve && <p className="rounded-lg border border-ok/50 bg-ok/10 p-3">{mode === 'practice' ? 'Solved! The editorial is now unlocked.' : 'Solved! Your score has been updated.'}</p>}
      {s.verdict === 'accepted' && <p className="text-muted">Runtime {s.runtimeMs} ms · Memory {Math.round(s.memoryKb / 1024)} MB</p>}
      {compileOutput && <div><p className="mb-1 font-medium">Compiler output</p><Pre>{compileOutput}</Pre></div>}
      {failure && (
        <div className="space-y-2">
          <p className="font-medium">{failure.hidden ? `Failed on hidden test case ${failure.testNumber}. Its input and expected output are not shown.` : `Failed on sample test case ${failure.testNumber}.`}</p>
          {!failure.hidden && <><div><p className="mb-1 text-xs font-medium text-muted">Input</p><Pre>{failure.input}</Pre></div><div><p className="mb-1 text-xs font-medium text-muted">Expected</p><Pre>{failure.expected}</Pre></div><div><p className="mb-1 text-xs font-medium text-muted">Your output</p><Pre>{failure.actual}</Pre></div></>}
          {failure.stderr && <div><p className="mb-1 text-xs font-medium text-muted">Errors</p><Pre>{failure.stderr}</Pre></div>}
        </div>
      )}
    </div>
  );
}

// One workspace for Practice and Contests. `base` is the API path of the problem; contests hide hints and the editorial.
export default function ProblemWorkspace({ base, storageId, mode = 'practice', codeUrl = (id) => `/practice/submissions/${id}`, header = null, onSubmitted }) {
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(base, undefined, [user?.id]);
  const { data: langs } = useFetch('/practice/languages');
  const [lang, setLang] = useState(() => store.get('cwr-lang') || 'python');
  const [code, setCode] = useState('');
  const [leftTab, setLeftTab] = useState('description');
  const [bottomTab, setBottomTab] = useState('testcase');
  const [custom, setCustom] = useState(false);
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');
  const [subKey, setSubKey] = useState(0);
  const p = data?.problem;
  useSeo({ title: p?.title, description: `Solve "${p?.title}" in Java, C++, C, Python or JavaScript.` });

  const starter = langs?.languages.find((l) => l.id === lang)?.starter || '';
  useEffect(() => { if (langs) setCode(store.get(`cwr-code:${storageId}:${lang}`) ?? starter); }, [langs, lang, storageId, starter]);
  useEffect(() => {
    if (!langs || code === '') return undefined;
    const t = setTimeout(() => store.set(`cwr-code:${storageId}:${lang}`, code), 400);
    return () => clearTimeout(t);
  }, [code, lang, storageId, langs]);
  const changeLang = (l) => { setLang(l); store.set('cwr-lang', l); };

  const exec = useCallback(async (kind) => {
    if (!code.trim()) return toast.error('Write some code first.');
    setBusy(kind);
    setBottomTab('result');
    setResult(null);
    try {
      if (kind === 'run') {
        const res = await api.post(`${base}/run`, { language: lang, code, ...(custom ? { stdin } : {}) });
        setResult({ kind: res.data.data.mode === 'custom' ? 'custom' : 'samples', ...res.data.data });
      } else {
        const res = await api.post(`${base}/submit`, { language: lang, code });
        setResult({ kind: 'submit', ...res.data.data });
        setSubKey((k) => k + 1);
        if (res.data.data.firstSolve) { toast.success('Problem solved!'); reload(); }
        onSubmitted?.(res.data.data);
      }
    } catch (e) { setResult({ kind: 'error', message: getErrorMessage(e) }); } finally { setBusy(''); }
  }, [code, lang, custom, stdin, base, toast, reload, onSubmitted]);

  if (loading && !data) return <PageSpinner />;
  if (error) return <div className="mx-auto max-w-lg py-20"><ErrorState message={error} onRetry={reload} /></div>;
  const offline = langs && !langs.configured;
  const tab = (k, l) => <button key={k} role="tab" aria-selected={leftTab === k} onClick={() => setLeftTab(k)} className={`whitespace-nowrap px-3 py-2 text-sm ${leftTab === k ? 'border-b-2 border-accent font-semibold' : 'text-muted hover:text-ink'}`}>{l}</button>;

  return (
    <div>
      {header}
    <div className={`grid gap-4 p-4 lg:grid-cols-2 ${header ? 'lg:h-[calc(100vh-7rem)]' : 'lg:h-[calc(100vh-4rem)]'}`}>
      <section aria-label="Problem" className="flex min-h-0 flex-col rounded-xl border border-line bg-surface">
        <div role="tablist" aria-label="Problem sections" className="flex overflow-x-auto border-b border-line px-2">
          {tab('description', 'Description')}{mode === 'practice' && tab('hints', `Hints${p.hintCount ? ` (${p.hintCount})` : ''}`)}{mode === 'practice' && tab('editorial', 'Editorial')}{tab('submissions', 'My submissions')}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5" role="tabpanel">
          {leftTab === 'description' && (
            <article>
              <h1 className="text-2xl font-bold">{p.label ? `${p.label}. ` : ''}{p.title}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-sm"><DifficultyBadge difficulty={p.difficulty} />{data.viewer.solved && <span className="rounded-full border border-ok/50 bg-ok/10 px-2.5 py-0.5 text-xs font-medium">Solved</span>}<span className="text-muted">{p.timeLimitMs} ms · {p.memoryLimitMb} MB{p.points ? ` · ${p.points} points` : ''}</span>{mode === 'practice' && p.status !== 'published' && <span className="rounded-full border border-accent/60 bg-accent/15 px-2.5 py-0.5 text-xs">{p.status}</span>}</p>
              {p.topics.length > 0 && <ul className="mt-3 flex flex-wrap gap-2" aria-label="Topics">{p.topics.map((t) => <li key={t}><Link to={`/practice?topic=${encodeURIComponent(t)}`} className="rounded-full border border-line px-2.5 py-0.5 text-xs hover:bg-raised">{t}</Link></li>)}</ul>}
              <div className="mt-5"><ArticleBody html={p.description} /></div>
              {p.inputFormat && <section className="mt-6"><h2 className="text-sm font-semibold">Input format</h2><p className="mt-1 whitespace-pre-line text-sm">{p.inputFormat}</p></section>}
              {p.outputFormat && <section className="mt-4"><h2 className="text-sm font-semibold">Output format</h2><p className="mt-1 whitespace-pre-line text-sm">{p.outputFormat}</p></section>}
              {p.constraints && <section className="mt-4"><h2 className="text-sm font-semibold">Constraints</h2><p className="mt-1 whitespace-pre-line font-mono text-sm">{p.constraints}</p></section>}
              <section className="mt-6" aria-label="Examples">
                {data.samples.map((s, i) => (
                  <div key={i} className="mt-4"><h2 className="text-sm font-semibold">Example {i + 1}</h2><p className="mt-2 text-xs font-medium text-muted">Input</p><Pre>{s.input}</Pre><p className="mt-2 text-xs font-medium text-muted">Output</p><Pre>{s.expectedOutput}</Pre>{s.explanation && <p className="mt-2 text-sm text-muted">{s.explanation}</p>}</div>
                ))}
              </section>
              {mode === 'practice' && <p className="mt-6 text-xs text-muted">{p.submissionCount} submissions · {p.acceptance}% accepted</p>}
            </article>
          )}
          {leftTab === 'hints' && <Hints base={base} count={p.hintCount} />}
          {leftTab === 'editorial' && <Editorial base={base} has={p.hasEditorial} solved={data.viewer.solved} />}
          {leftTab === 'submissions' && <MySubmissions base={base} codeUrl={codeUrl} refreshKey={subKey} onLoad={(s) => { setLang(s.language); store.set(`cwr-code:${storageId}:${s.language}`, s.code); setCode(s.code); toast.success('Code loaded into the editor'); }} />}
        </div>
      </section>

      <section aria-label="Code workspace" className="flex min-h-0 flex-col gap-3">
        {offline && <p role="status" className="flex gap-2 rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm"><AlertTriangle className="h-4 w-4 shrink-0" aria-hidden /> Code execution is not set up on this server yet, so Run and Submit are unavailable. You can still read the problem and write code.</p>}
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="lang">Language</label>
          <select id="lang" value={lang} onChange={(e) => changeLang(e.target.value)} className="h-10 rounded-lg border border-line bg-surface px-3 text-sm">{(langs?.languages || [{ id: 'python', name: 'Python' }]).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select>
          <Button variant="ghost" size="sm" onClick={() => { if (window.confirm('Replace your code with the starter template?')) setCode(starter); }}><RotateCcw className="h-4 w-4" aria-hidden /> Reset</Button>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" loading={busy === 'run'} disabled={!user || offline || Boolean(busy)} onClick={() => exec('run')}><Play className="h-4 w-4" aria-hidden /> Run</Button>
            <Button loading={busy === 'submit'} disabled={!user || offline || Boolean(busy)} onClick={() => exec('submit')}><Send className="h-4 w-4" aria-hidden /> Submit</Button>
          </div>
        </div>
        {!user && <LoginPrompt what="run and submit code" />}
        <div className="min-h-[340px] flex-1 overflow-hidden rounded-xl border border-line">
          <Suspense fallback={<Spinner className="h-full" label="Loading editor" />}><CodeEditor value={code} onChange={setCode} language={langs?.languages.find((l) => l.id === lang)?.monaco || lang} /></Suspense>
        </div>
        <p className="text-xs text-muted">Keyboard users: press Ctrl+M (Cmd+Shift+M on Mac) to let Tab move focus out of the editor.</p>
        <div className="flex h-64 shrink-0 flex-col rounded-xl border border-line bg-surface">
          <div role="tablist" aria-label="Output" className="flex border-b border-line px-2">
            {[['testcase', 'Test input'], ['result', 'Result']].map(([k, l]) => <button key={k} role="tab" aria-selected={bottomTab === k} onClick={() => setBottomTab(k)} className={`px-3 py-2 text-sm ${bottomTab === k ? 'border-b-2 border-accent font-semibold' : 'text-muted hover:text-ink'}`}>{l}</button>)}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto" role="tabpanel">
            {bottomTab === 'testcase' ? (
              <div className="space-y-3 p-3 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={custom} onChange={(e) => setCustom(e.target.checked)} className="h-4 w-4 accent-[rgb(var(--accent))]" /> Run with my own input instead of the sample cases</label>
                <label className="block"><span className="sr-only">Custom input</span><textarea value={stdin} onChange={(e) => setStdin(e.target.value)} disabled={!custom} rows={5} maxLength={10000} placeholder="Type the input your program should read" className="w-full rounded-lg border border-line bg-surface p-2 font-mono text-xs disabled:opacity-50" /></label>
              </div>
            ) : <ResultPanel result={result} busy={busy} mode={mode} />}
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
