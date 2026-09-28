// Re-mounts on every navigation, so each page settles in with the same
// short entrance. Reduced motion collapses it (globals.css).
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <main className="animate-page">{children}</main>;
}
