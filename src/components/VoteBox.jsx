import { ChevronUp, ChevronDown, Check } from 'lucide-react';

// Vote arrows with the running score. `accepted` shows the green tick under answers that solved the question.
export default function VoteBox({ score, myVote, onVote, disabled, label, accepted, onAccept, canAccept }) {
  const btn = (on) => `rounded-full border p-1.5 ${on ? 'border-accent bg-accent/20' : 'border-line hover:bg-raised'} disabled:opacity-40`;
  return (
    <div className="flex w-10 shrink-0 flex-col items-center gap-1" role="group" aria-label={`Voting for ${label}`}>
      <button type="button" className={btn(myVote === 1)} aria-pressed={myVote === 1} aria-label="Upvote" disabled={disabled} onClick={() => onVote(myVote === 1 ? 0 : 1)}><ChevronUp className="h-5 w-5" /></button>
      <span className="font-display text-lg font-bold" aria-label={`Score ${score}`}>{score}</span>
      <button type="button" className={btn(myVote === -1)} aria-pressed={myVote === -1} aria-label="Downvote" disabled={disabled} onClick={() => onVote(myVote === -1 ? 0 : -1)}><ChevronDown className="h-5 w-5" /></button>
      {(accepted || canAccept) && (
        <button type="button" disabled={!canAccept} onClick={onAccept} aria-pressed={accepted} aria-label={accepted ? (canAccept ? 'Accepted answer. Click to unaccept' : 'Accepted answer') : 'Accept this answer'}
          className={`mt-1 rounded-full border p-1.5 ${accepted ? 'border-ok bg-ok/15 text-ok' : 'border-line text-muted hover:bg-raised'}`}><Check className="h-5 w-5" /></button>
      )}
    </div>
  );
}
