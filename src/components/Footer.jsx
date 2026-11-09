import { Link } from 'react-router-dom';
import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import InstallButton from './InstallButton';

const col = 'text-muted hover:text-ink';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_2fr_1.4fr]">
        <div className="max-w-xs"><Logo /><p className="mt-3 text-sm text-muted">Free to start. Learn, practice and share what you know with other developers.</p></div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
          <ul className="space-y-2"><li className="font-semibold">Explore</li>
            <li><Link className={col} to="/articles">Articles</Link></li><li><Link className={col} to="/courses">Courses</Link></li><li><Link className={col} to="/practice">Practice</Link></li>
            <li><Link className={col} to="/contests">Contests</Link></li><li><Link className={col} to="/discussions">Discussions</Link></li><li><Link className={col} to="/leaderboard">Leaderboard</Link></li></ul>
          <ul className="space-y-2"><li className="font-semibold">Learn</li>
            <li><Link className={col} to="/roadmaps">Roadmaps</Link></li><li><Link className={col} to="/interview-preparation">Interview prep</Link></li><li><Link className={col} to="/search">Search</Link></li>
            <li><Link className={col} to="/login">Log in</Link></li><li><Link className={col} to="/register">Create account</Link></li></ul>
          <ul className="space-y-2"><li className="font-semibold">Company</li>
            <li><Link className={col} to="/about">About</Link></li><li><Link className={col} to="/contact">Contact and feedback</Link></li><li><Link className={col} to="/privacy-policy">Privacy policy</Link></li>
            <li><Link className={col} to="/terms-and-conditions">Terms and conditions</Link></li><li><Link className={col} to="/cookie-policy">Cookie policy</Link></li>
            <li><button className={col} onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}>Cookie settings</button></li><li><InstallButton /></li></ul>
        </nav>
        <NewsletterForm />
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} Code With Ram</p>
    </footer>
  );
}
