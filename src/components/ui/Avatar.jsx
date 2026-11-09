export default function Avatar({ user, size = 32 }) {
  const initials = (user?.name || '?').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const style = { width: size, height: size, fontSize: size * 0.4 };
  return user?.avatar ? (
    <img src={user.avatar} alt="" loading="lazy" style={style} className="rounded-full object-cover" />
  ) : (
    <span aria-hidden style={style} className="inline-flex items-center justify-center rounded-full bg-accent font-semibold text-accent-ink">{initials}</span>
  );
}
