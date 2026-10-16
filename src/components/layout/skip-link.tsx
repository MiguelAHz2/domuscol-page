// First stop for keyboard and screen-reader users: jumps past the navbar.
export function SkipLink() {
  return (
    <a
      href="#contenido"
      className="sr-only z-[60] rounded-xl bg-espresso px-4 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Saltar al contenido
    </a>
  );
}
