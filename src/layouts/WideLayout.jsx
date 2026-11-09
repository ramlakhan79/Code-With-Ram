import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Full-width page with the site navbar and no footer (used by the problem workspace).
export default function WideLayout() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink">Skip to content</a>
      <Navbar />
      <main id="main"><Outlet /></main>
    </>
  );
}
