import { Sparkles, Target, Medal, Crown, Flame, GraduationCap, Swords, Trophy, Feather, LifeBuoy, Award } from 'lucide-react';

const ICONS = { Sparkles, Target, Medal, Crown, Flame, GraduationCap, Swords, Trophy, Feather, LifeBuoy };
export default function BadgeIcon({ name, className = 'h-6 w-6' }) {
  const Icon = ICONS[name] || Award;
  return <Icon className={className} aria-hidden />;
}
