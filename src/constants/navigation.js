import { LayoutDashboard, UserRound, Settings, Users, Shield, PenLine, Bookmark, Bell, FileText, Tags, GraduationCap, Presentation, BarChart3, BookOpen, History, Lightbulb, Code2, ListChecks, Trophy, Flag, Award, Megaphone, Inbox, Mail, SlidersHorizontal, ScrollText } from 'lucide-react';

// Anyone holding at least one of these may open the admin area; each page still checks its own permission
export const ADMIN_ACCESS = ['user:read', 'report:handle', 'article:review', 'problem:manage', 'contest:manage', 'course:manage_all', 'category:manage', 'analytics:read', 'auditlog:read', 'announcement:manage', 'settings:read'];

export const PUBLIC_LINKS = [{ to: '/', label: 'Home', end: true }, { to: '/articles', label: 'Articles' }, { to: '/courses', label: 'Courses' }, { to: '/practice', label: 'Practice' }, { to: '/contests', label: 'Contests' }, { to: '/discussions', label: 'Discussions' }, { to: '/leaderboard', label: 'Leaderboard' }];

// `permission` hides items the user cannot use (the API still enforces access)
export const DASHBOARD_NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/courses', label: 'My learning', icon: GraduationCap },
  { to: '/dashboard/instructor/courses', label: 'Teaching', icon: Presentation, permission: 'course:create' },
  { to: '/dashboard/instructor/students', label: 'My students', icon: Users, permission: 'course:create' },
  { to: '/dashboard/instructor/analytics', label: 'Analytics', icon: BarChart3, permission: 'course:create' },
  { to: '/dashboard/achievements', label: 'Achievements', icon: Award },
  { to: '/dashboard/contests', label: 'My contests', icon: Trophy },
  { to: '/dashboard/submissions', label: 'Coding progress', icon: History },
  { to: '/dashboard/suggest-problem', label: 'Suggest a problem', icon: Lightbulb, permission: 'problem:suggest' },
  { to: '/dashboard/articles', label: 'My articles', icon: PenLine, permission: 'article:write' },
  { to: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/profile', label: 'Profile', icon: UserRound },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/admin', label: 'Admin', icon: Shield, permission: ADMIN_ACCESS, end: true },
];

export const ADMIN_NAV = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users, permission: 'user:read' },
  { to: '/admin/articles', label: 'Articles', icon: FileText, permission: 'article:review' },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3, permission: 'analytics:read' },
  { to: '/admin/reports', label: 'Reports', icon: Flag, permission: 'report:handle' },
  { to: '/admin/contests', label: 'Contests', icon: Trophy, permission: 'contest:manage' },
  { to: '/admin/problems', label: 'Problems', icon: Code2, permission: 'problem:manage' },
  { to: '/admin/submissions', label: 'Submissions', icon: ListChecks, permission: 'problem:manage' },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen, permission: 'course:manage_all' },
  { to: '/admin/categories', label: 'Categories', icon: Tags, permission: 'category:manage' },
  { to: '/admin/feedback', label: 'Feedback', icon: Inbox, permission: 'report:handle' },
  { to: '/admin/notifications', label: 'Announcements', icon: Megaphone, permission: 'announcement:manage' },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail, permission: 'announcement:manage' },
  { to: '/admin/audit-logs', label: 'Audit logs', icon: ScrollText, permission: 'auditlog:read' },
  { to: '/admin/settings', label: 'Settings', icon: SlidersHorizontal, permission: 'settings:read' },
  { to: '/dashboard', label: 'Back to dashboard', icon: UserRound, end: true },
];

export const BREADCRUMB_LABELS = {
  dashboard: 'Dashboard', profile: 'Profile', settings: 'Settings', admin: 'Admin', users: 'Users',
  articles: 'Articles', create: 'New', edit: 'Edit', review: 'Review', bookmarks: 'Bookmarks',
  notifications: 'Notifications', categories: 'Categories', courses: 'Courses', problems: 'Problems', contests: 'Contests', reports: 'Reports', achievements: 'Achievements', analytics: 'Analytics', feedback: 'Feedback', newsletter: 'Newsletter', 'audit-logs': 'Audit logs', settings: 'Settings', search: 'Search', leaderboard: 'Leaderboard', discussions: 'Discussions', ask: 'Ask a question', submissions: 'Coding progress', 'suggest-problem': 'Suggest a problem', new: 'New', instructor: 'Teaching', students: 'Students',
};
// Segments that have no page of their own
export const NON_LINK_SEGMENTS = ['edit', 'review', 'instructor'];

export const ROLE_LABELS = {
  student: 'Student', contributor: 'Contributor', instructor: 'Instructor',
  moderator: 'Moderator', admin: 'Admin', super_admin: 'Super admin',
};
