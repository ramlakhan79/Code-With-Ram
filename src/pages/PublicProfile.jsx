import { useParams } from 'react-router-dom';
import { Github, Linkedin, Globe, MapPin } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import Avatar from '../components/ui/Avatar';
import { ErrorState, PageSpinner } from '../components/ui/Feedback';
import { Link } from 'react-router-dom';
import BadgeIcon from '../components/BadgeIcon';

export default function PublicProfile() {
  const { username } = useParams();
  const { data, loading, error, reload } = useFetch(`/users/profile/${encodeURIComponent(username)}`);
  const { data: game } = useFetch(`/gamification/user/${encodeURIComponent(username)}`);
  const { data: community } = useFetch(`/discussions/profile/${encodeURIComponent(username)}`);
  if (loading) return <PageSpinner />;
  if (error) return <div className="py-16"><ErrorState message={error} onRetry={reload} /></div>;
  const u = data.user;
  const links = [
    { href: u.githubUrl, icon: Github, label: 'GitHub' },
    { href: u.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
    { href: u.website, icon: Globe, label: 'Website' },
  ].filter((l) => l.href);

  return (
    <article className="mx-auto max-w-2xl py-12">
      <div className="flex items-center gap-4">
        <Avatar user={u} size={72} />
        <div>
          <h1 className="text-2xl font-bold">{u.name}</h1>
          <p className="text-muted">@{u.username}</p>
        </div>
      </div>
      {u.bio && <p className="mt-6 whitespace-pre-line">{u.bio}</p>}
      {u.location && <p className="mt-4 flex items-center gap-2 text-sm text-muted"><MapPin className="h-4 w-4" aria-hidden /> {u.location}</p>}
      {u.skills.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Skills">
          {u.skills.map((s) => <li key={s} className="rounded-full border border-line px-3 py-1 text-sm">{s}</li>)}
        </ul>
      )}
      {links.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-4 text-sm">
          {links.map(({ href, icon: Icon, label }) => (
            <li key={label}><a href={href} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-1.5 underline"><Icon className="h-4 w-4" aria-hidden /> {label}</a></li>
          ))}
        </ul>
      )}
      {game && game.points > 0 && (
        <section aria-labelledby="game-h" className="mt-10 rounded-xl border border-line bg-surface p-5">
          <h2 id="game-h" className="text-lg font-semibold">Achievements</h2>
          <p className="mt-2 text-sm"><span className="font-display text-2xl font-bold">Level {game.level}</span> <span className="text-muted">· {game.points.toLocaleString()} points{game.rank ? ` · rank #${game.rank}` : ''}</span></p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Badges earned">{game.badges.filter((b) => b.earned).map((b) => <li key={b.key} title={b.description} className="flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/10 px-3 py-1 text-xs font-medium"><BadgeIcon name={b.icon} className="h-3.5 w-3.5" /> {b.name}</li>)}</ul>
        </section>
      )}
      {community && (
        <section aria-labelledby="comm-h" className="mt-10 rounded-xl border border-line bg-surface p-5">
          <h2 id="comm-h" className="text-lg font-semibold">Community</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[['Reputation', community.reputation.toLocaleString()], ['Questions', community.questionCount], ['Answers', community.answerCount], ['Accepted', community.acceptedCount]].map(([l, v]) => <div key={l}><dt className="text-muted">{l}</dt><dd className="font-display text-2xl font-bold">{v}</dd></div>)}
          </dl>
          {community.topTags.length > 0 && <p className="mt-4 flex flex-wrap items-center gap-2 text-sm"><span className="text-muted">Top tags:</span>{community.topTags.map((t) => <Link key={t.slug} to={`/discussions?tag=${t.slug}`} className="rounded-full border border-line px-2.5 py-0.5 text-xs hover:bg-raised">{t.name}</Link>)}</p>}
          {community.answers.length > 0 && <div className="mt-4"><h3 className="text-sm font-semibold">Recent answers</h3><ul className="mt-2 space-y-1 text-sm">{community.answers.map((a) => <li key={a._id}><Link to={`/discussions/${a.discussion.slug}`} className="hover:underline">{a.discussion.title}</Link> <span className="text-muted">{a.score} votes{a.accepted && ' · accepted'}</span></li>)}</ul></div>}
          {community.questions.length > 0 && <div className="mt-4"><h3 className="text-sm font-semibold">Recent questions</h3><ul className="mt-2 space-y-1 text-sm">{community.questions.map((d) => <li key={d._id}><Link to={`/discussions/${d.slug}`} className="hover:underline">{d.title}</Link> <span className="text-muted">{d.answerCount} answers</span></li>)}</ul></div>}
        </section>
      )}
    </article>
  );
}
