import { useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import api, { getErrorMessage } from '../api/client';
import { useToast } from '../context/ToastContext';
import Button from './ui/Button';

export default function QuizPlayer({ lesson, lastAttempt, onResult }) {
  const toast = useToast();
  const qs = lesson.quiz.questions;
  const [answers, setAnswers] = useState(Array(qs.length).fill(null));
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    try {
      const res = await api.post(`/courses/lessons/${lesson._id}/quiz`, { answers });
      setResult(res.data.data);
      onResult(res.data.data);
    } catch (e) { toast.error(getErrorMessage(e)); } finally { setBusy(false); }
  };
  const retry = () => { setAnswers(Array(qs.length).fill(null)); setResult(null); };

  return (
    <div>
      <p className="text-sm text-muted">Score {lesson.quiz.passingScore}% or more to pass.{lastAttempt && !result && ` Your last attempt: ${lastAttempt.score}% (${lastAttempt.passed ? 'passed' : 'not passed'}).`}</p>
      {result && (
        <div role="status" className={`mt-4 rounded-xl border p-4 ${result.passed ? 'border-ok/50 bg-ok/10' : 'border-danger/50 bg-danger/10'}`}>
          <p className="font-semibold">{result.passed ? `Passed with ${result.score}%` : `${result.score}%. You need ${result.passingScore}% to pass.`}</p>
          {!result.passed && <p className="mt-1 text-sm">Review the explanations below and try again. Correct answers are shown once you pass.</p>}
        </div>
      )}
      <ol className="mt-6 space-y-6">
        {qs.map((q, qi) => {
          const r = result?.results[qi];
          return (
            <li key={qi}>
              <fieldset disabled={Boolean(result)}>
                <legend className="font-medium">{qi + 1}. {q.prompt}</legend>
                <div className="mt-2 space-y-2">
                  {q.options.map((o, oi) => {
                    const isRight = r?.correctIndex === oi;
                    return (
                      <label key={oi} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${isRight ? 'border-ok bg-ok/10' : answers[qi] === oi ? 'border-accent bg-accent/10' : 'border-line hover:bg-raised'}`}>
                        <input type="radio" name={`q${qi}`} checked={answers[qi] === oi} onChange={() => setAnswers((a) => a.map((x, i) => (i === qi ? oi : x)))} className="accent-[rgb(var(--accent))]" />
                        {o}
                        {isRight && <span className="ml-auto text-xs font-medium text-ok">Correct answer</span>}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {r && (
                <p className="mt-2 flex items-start gap-2 text-sm" aria-live="polite">
                  {r.correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />}
                  <span><span className="font-medium">{r.correct ? 'Correct.' : 'Not quite.'}</span> {r.explanation}</span>
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mt-6">
        {result ? (!result.passed && <Button onClick={retry}>Try again</Button>) : <Button loading={busy} disabled={answers.some((a) => a === null)} onClick={submit}>Submit answers</Button>}
      </div>
    </div>
  );
}
