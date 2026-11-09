import { Link } from 'react-router-dom';
import useSeo from '../hooks/useSeo';

function Legal({ title, updated, children }) {
  useSeo({ title, description: `${title} for Code With Ram.` });
  return (
    <article className="mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-muted">Last updated {updated}</p>
      <p role="note" className="mt-4 rounded-lg border border-accent/60 bg-accent/10 p-3 text-sm">This page is a starting template written for a typical free learning platform. Have it reviewed by a qualified lawyer and adjust it to how you really operate (your company name, location, retention periods and processors) before you launch.</p>
      <div className="mt-8 space-y-6 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_li]:mt-1 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-6">{children}</div>
    </article>
  );
}

export function Terms() {
  return (
    <Legal title="Terms and conditions" updated="the date you publish this page">
      <p>By creating an account or using Code With Ram you agree to these terms. If you do not agree, please do not use the service.</p>
      <h2>Your account</h2>
      <p>You must give accurate information and keep your password safe. You are responsible for activity on your account. You can deactivate or permanently delete your account from Settings at any time.</p>
      <h2>Your content</h2>
      <p>You keep ownership of what you write, including articles, answers, comments and code. You give us permission to store, display and distribute it on the platform so the service can work. Please only post content you have the right to share, and do not copy other people's work.</p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Be respectful. No harassment, hate, spam or illegal content.</li>
        <li>Do not try to break, overload or gain unauthorised access to the platform or other people's accounts.</li>
        <li>The code runner is for solving problems. Do not use it to attack other systems, mine cryptocurrency, or run malicious programs.</li>
        <li>Contests are individual. Do not share solutions during a contest, use multiple accounts, or interfere with the judging. We may disqualify participants and remove points for cheating.</li>
        <li>Points, badges and reputation are earned through real activity. Attempts to inflate them may be reversed.</li>
      </ul>
      <h2>Moderation</h2>
      <p>Moderators may hide content, send warnings, or suspend accounts that break these rules. Decisions can be questioned through the <Link to="/contact" className="underline">contact page</Link>.</p>
      <h2>Courses and certificates</h2>
      <p>Courses are provided for learning and are free. A certificate confirms that you completed a course on this platform. It is not an accredited qualification.</p>
      <h2>Availability and changes</h2>
      <p>The service is provided "as is" and may be unavailable from time to time, for example during maintenance. We may change features, and we may update these terms. Continuing to use the service after a change means you accept it.</p>
      <h2>Liability</h2>
      <p>To the extent the law allows, we are not liable for losses arising from your use of the service. Nothing here limits rights you have by law.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: use the <Link to="/contact" className="underline">contact page</Link>.</p>
    </Legal>
  );
}

export function Privacy() {
  return (
    <Legal title="Privacy policy" updated="the date you publish this page">
      <p>This policy explains what personal data Code With Ram collects, why, and the choices you have.</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, username, email, password (stored only as a salted hash), optional profile details and photo, and your sign-in method (email or Google).</li>
        <li><strong>Learning activity:</strong> course progress, quiz and assignment answers, practice and contest submissions (including your code), points, badges and streaks.</li>
        <li><strong>Community content:</strong> articles, questions, answers, comments, votes, bookmarks and reports.</li>
        <li><strong>Technical data:</strong> IP address, browser and device details for sign-in history, active sessions, security and abuse prevention.</li>
        <li><strong>Messages:</strong> contact, feedback and bug reports you send, and your newsletter subscription.</li>
      </ul>
      <h2>Why we use it</h2>
      <p>To run the platform, keep it secure, show your progress and public profile, send notifications you ask for, moderate content, and improve the service. We do not sell personal data and we do not show advertising.</p>
      <h2>Who processes it</h2>
      <p>We use service providers to operate the platform: a database host (MongoDB Atlas), web and API hosting, image storage (Cloudinary), email delivery (SMTP), optional Google sign-in, an optional bot check (Cloudflare Turnstile), and optional privacy-friendly analytics (Umami) only if you allow it. Replace this list with the providers you actually use.</p>
      <h2>What is public</h2>
      <p>Your username, name, photo, bio, links, published articles, questions and answers, reputation, points and badges are visible on your public profile. Your email is never shown publicly.</p>
      <h2>Your choices and rights</h2>
      <ul>
        <li><strong>Download your data</strong> as a file from Settings, under "Your data".</li>
        <li><strong>Delete your account</strong> from the same place. Your personal details, sessions, notifications, drafts, bookmarks and the code you submitted are removed. Content you published publicly (articles, questions, answers) stays but is shown as written by "Deleted user", so other people's work and conversations are not broken.</li>
        <li><strong>Unsubscribe</strong> from the newsletter with the link in every email.</li>
        <li><strong>Control cookies</strong> with the cookie settings in the page footer.</li>
      </ul>
      <h2>Retention and security</h2>
      <p>We keep data while your account exists. We use encrypted connections, hashed passwords, access controls and audit logs. No system is perfectly secure, so please use a strong, unique password.</p>
      <h2>Children</h2>
      <p>Code With Ram is not directed at young children. If you believe a child has given us personal data without permission, contact us and we will remove it.</p>
      <h2>Contact</h2>
      <p>For privacy questions or requests, use the <Link to="/contact" className="underline">contact page</Link>.</p>
    </Legal>
  );
}

export function CookiePolicy() {
  return (
    <Legal title="Cookie policy" updated="the date you publish this page">
      <p>We keep this simple: we use only what the site needs to work, and optional analytics only if you agree.</p>
      <h2>Essential (always on)</h2>
      <ul>
        <li><strong>Sign-in cookies</strong> (<code>accessToken</code>, <code>refreshToken</code>, <code>csrfToken</code>): keep you signed in and protect your session from forged requests.</li>
        <li><strong>Browser storage</strong> for preferences: theme (<code>cwr-theme</code>), sidebar state, preferred code language, unsaved code drafts, recent searches when signed out, dismissed announcements, and your cookie choice (<code>cwr-consent</code>).</li>
      </ul>
      <h2>Analytics (only with your permission)</h2>
      <p>If the site owner has set up Umami, a privacy-friendly analytics tool, it loads only after you choose "Allow analytics". It helps us see which pages are useful. You can change your mind at any time with "Cookie settings" in the footer.</p>
      <h2>What we do not use</h2>
      <p>No advertising cookies and no cross-site tracking.</p>
    </Legal>
  );
}
