import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

// The editor-style panel doubles as navigation: each "file" is one part of the platform.
const FILES = [
  { name: 'articles.md', lines: ['# Articles', 'Write technical posts with a rich editor.', 'Contributors submit, admins review, readers learn.'] },
  { name: 'courses.md', lines: ['# Courses', 'Structured paths with lessons, quizzes and assignments.', 'Free to start. Progress is tracked for you.'] },
  { name: 'practice.py', lines: ['# Practice', 'Solve problems in Java, C++, C, Python or JavaScript.', 'Code runs in an isolated judge, never on our web server.'] },
  { name: 'contests.js', lines: ['// Contests', 'Timed rounds with a live leaderboard.', 'Server-side clocks keep every round fair.'] },
  { name: 'community.md', lines: ['# Community', 'Ask questions, give answers, earn reputation.', 'Follow developers and build a public profile.'] },
];

export default function Home() {
  const { user } = useAuth();
  const [active, setActive] = useState(0);
  const file = FILES[active];

  return (
    <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl">Get better at code, with people who are doing the same.</h1>
        <p className="mt-5 max-w-md text-lg text-muted">
          Read, learn, practice and compete in one place. Everything on Code With Ram is free to start.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {user ? (
            <Link to="/dashboard"><Button size="lg">Open dashboard</Button></Link>
          ) : (
            <>
              <Link to="/register"><Button size="lg">Create free account</Button></Link>
              <Link to="/courses"><Button size="lg" variant="secondary">Browse courses</Button></Link>
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm"
      >
        <div role="tablist" aria-label="Parts of the platform" className="flex overflow-x-auto border-b border-line bg-raised font-mono text-xs">
          {FILES.map((f, i) => (
            <button
              key={f.name}
              role="tab"
              id={`tab-${i}`}
              aria-selected={active === i}
              aria-controls="file-panel"
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') setActive((active + 1) % FILES.length);
                if (e.key === 'ArrowLeft') setActive((active - 1 + FILES.length) % FILES.length);
              }}
              className={`whitespace-nowrap border-r border-line px-4 py-2.5 ${active === i ? 'bg-surface font-semibold' : 'text-muted hover:text-ink'}`}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div id="file-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="min-h-[190px] p-5 font-mono text-sm leading-7">
          {file.lines.map((line, i) => (
            <div key={`${file.name}-${i}`} className="flex gap-4">
              <span aria-hidden className="w-4 select-none text-right text-muted">{i + 1}</span>
              <span className={i === 0 ? 'font-semibold' : 'text-muted'}>{line}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
