import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import WideLayout from './layouts/WideLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import { PageSpinner } from './components/ui/Feedback';
import { ADMIN_ACCESS } from './constants/navigation';
import { useAuth } from './context/AuthContext';
import { usePlatform } from './context/PlatformContext';
import AnnouncementBanner from './components/AnnouncementBanner';
import MaintenancePage from './components/MaintenancePage';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Code-split everything behind login
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const MyArticles = lazy(() => import('./pages/dashboard/MyArticles'));
const ArticleEditorPage = lazy(() => import('./pages/dashboard/ArticleEditorPage'));
const Bookmarks = lazy(() => import('./pages/dashboard/Bookmarks'));
const Notifications = lazy(() => import('./pages/dashboard/Notifications'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
const ArticleReview = lazy(() => import('./pages/admin/ArticleReview'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const CoursePlayer = lazy(() => import('./pages/CoursePlayer'));
const CertificateVerify = lazy(() => import('./pages/CertificateVerify'));
const MyLearning = lazy(() => import('./pages/dashboard/MyLearning'));
const InstructorCourses = lazy(() => import('./pages/instructor/InstructorCourses'));
const CourseCreate = lazy(() => import('./pages/instructor/InstructorCourses').then((m) => ({ default: m.CourseCreate })));
const CourseBuilder = lazy(() => import('./pages/instructor/CourseBuilder'));
const InstructorStudents = lazy(() => import('./pages/instructor/InstructorStudents'));
const InstructorAnalytics = lazy(() => import('./pages/instructor/InstructorAnalytics'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const Practice = lazy(() => import('./pages/Practice'));
const ProblemPage = lazy(() => import('./pages/ProblemPage'));
const CodingStats = lazy(() => import('./pages/dashboard/CodingStats'));
const SuggestProblem = lazy(() => import('./pages/dashboard/SuggestProblem'));
const AdminProblems = lazy(() => import('./pages/admin/AdminProblems'));
const ProblemEditor = lazy(() => import('./pages/admin/ProblemEditor'));
const AdminSubmissions = lazy(() => import('./pages/admin/AdminSubmissions'));
const Contests = lazy(() => import('./pages/Contests'));
const ContestPage = lazy(() => import('./pages/ContestPage'));
const ContestProblemPage = lazy(() => import('./pages/ContestProblemPage'));
const MyContests = lazy(() => import('./pages/dashboard/MyContests'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Roadmaps = lazy(() => import('./pages/Roadmaps'));
const InterviewPrep = lazy(() => import('./pages/InterviewPrep'));
const NewsletterAction = lazy(() => import('./pages/NewsletterAction'));
const Terms = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.Terms })));
const Privacy = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.Privacy })));
const CookiePolicy = lazy(() => import('./pages/LegalPages').then((m) => ({ default: m.CookiePolicy })));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminAnnouncements = lazy(() => import('./pages/admin/AdminAnnouncements'));
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Achievements = lazy(() => import('./pages/dashboard/Achievements'));
const Discussions = lazy(() => import('./pages/Discussions'));
const DiscussionPage = lazy(() => import('./pages/DiscussionPage'));
const AskQuestion = lazy(() => import('./pages/AskQuestion'));
const ModerationQueue = lazy(() => import('./pages/admin/ModerationQueue'));
const AdminContests = lazy(() => import('./pages/admin/AdminContests'));
const ContestEditor = lazy(() => import('./pages/admin/ContestEditor'));

export default function App() {
  const { settings } = usePlatform();
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const staff = user?.roles.some((r) => ['admin', 'super_admin'].includes(r));
  if (settings?.maintenance.enabled && !loading && !staff && !['/login', '/forgot-password', '/reset-password'].includes(pathname)) return <MaintenancePage />;
  return (
    <>
    <AnnouncementBanner />
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/interview-preparation" element={<InterviewPrep />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/newsletter/:action" element={<NewsletterAction />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/contests/:slug" element={<ContestPage />} />
          <Route path="/discussions/:slug" element={<DiscussionPage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetail />} />
          <Route path="/certificates/:code" element={<CertificateVerify />} />
          <Route path="/users/:username" element={<PublicProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<ProtectedRoute permission="discussion:write" />}>
          <Route element={<PublicLayout />}>
            <Route path="/discussions/ask" element={<AskQuestion />} />
            <Route path="/discussions/:slug/edit" element={<AskQuestion />} />
          </Route>
        </Route>

        <Route element={<WideLayout />}>
          <Route path="/practice/:slug" element={<ProblemPage />} />
          <Route path="/contests/:slug/problems/:label" element={<ContestProblemPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/courses/:slug/learn" element={<CoursePlayer />} />
          <Route path="/courses/:slug/learn/:lessonId" element={<CoursePlayer />} />
          <Route element={<DashboardLayout area="dashboard" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/courses" element={<MyLearning />} />
            <Route element={<ProtectedRoute permission="course:create" />}>
              <Route path="/dashboard/instructor/courses" element={<InstructorCourses />} />
              <Route path="/dashboard/instructor/courses/create" element={<CourseCreate />} />
              <Route path="/dashboard/instructor/courses/:id" element={<CourseBuilder />} />
              <Route path="/dashboard/instructor/students" element={<InstructorStudents />} />
              <Route path="/dashboard/instructor/analytics" element={<InstructorAnalytics />} />
            </Route>
            <Route path="/dashboard/achievements" element={<Achievements />} />
            <Route path="/dashboard/contests" element={<MyContests />} />
            <Route path="/dashboard/submissions" element={<CodingStats />} />
            <Route element={<ProtectedRoute permission="problem:suggest" />}>
              <Route path="/dashboard/suggest-problem" element={<SuggestProblem />} />
            </Route>
            <Route path="/dashboard/bookmarks" element={<Bookmarks />} />
            <Route path="/dashboard/notifications" element={<Notifications />} />
            <Route element={<ProtectedRoute permission="article:write" />}>
              <Route path="/dashboard/articles" element={<MyArticles />} />
              <Route path="/dashboard/articles/create" element={<ArticleEditorPage />} />
              <Route path="/dashboard/articles/edit/:id" element={<ArticleEditorPage />} />
            </Route>
          </Route>
        </Route>

        <Route element={<ProtectedRoute permission={ADMIN_ACCESS} />}>
          <Route element={<DashboardLayout area="admin" />}>
            <Route path="/admin" element={<AdminOverview />} />
            <Route element={<ProtectedRoute permission="user:read" />}>
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
            <Route element={<ProtectedRoute permission="article:review" />}>
              <Route path="/admin/articles" element={<AdminArticles />} />
              <Route path="/admin/articles/:id/review" element={<ArticleReview />} />
            </Route>
            <Route element={<ProtectedRoute permission="analytics:read" />}>
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Route>
            <Route element={<ProtectedRoute permission="auditlog:read" />}>
              <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            </Route>
            <Route element={<ProtectedRoute permission="settings:read" />}>
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
            <Route element={<ProtectedRoute permission="announcement:manage" />}>
              <Route path="/admin/notifications" element={<AdminAnnouncements />} />
              <Route path="/admin/newsletter" element={<AdminNewsletter />} />
            </Route>
            <Route element={<ProtectedRoute permission="report:handle" />}>
              <Route path="/admin/feedback" element={<AdminFeedback />} />
              <Route path="/admin/reports" element={<ModerationQueue />} />
            </Route>
            <Route element={<ProtectedRoute permission="contest:manage" />}>
              <Route path="/admin/contests" element={<AdminContests />} />
              <Route path="/admin/contests/new" element={<ContestEditor />} />
              <Route path="/admin/contests/:id" element={<ContestEditor />} />
            </Route>
            <Route element={<ProtectedRoute permission="problem:manage" />}>
              <Route path="/admin/problems" element={<AdminProblems />} />
              <Route path="/admin/problems/new" element={<ProblemEditor />} />
              <Route path="/admin/problems/:id" element={<ProblemEditor />} />
              <Route path="/admin/submissions" element={<AdminSubmissions />} />
            </Route>
            <Route element={<ProtectedRoute permission="course:manage_all" />}>
              <Route path="/admin/courses" element={<AdminCourses />} />
            </Route>
            <Route element={<ProtectedRoute permission="category:manage" />}>
              <Route path="/admin/categories" element={<AdminCategories />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
    <CookieConsent />
    </>
  );
}
