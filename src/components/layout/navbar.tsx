"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ResidentsAccess } from "@/components/layout/residents-access";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { buttonClass } from "@/components/ui/button";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

// Floating glass capsule, iOS style: white glass in light mode, navy glass
// in dark mode.
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // Collapsed menu stays in the DOM for the height transition, so take it
  // out of the tab order and accessibility tree while closed.
  useEffect(() => {
    menuRef.current?.toggleAttribute("inert", !open);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          "glass mx-auto max-w-[76rem] rounded-[22px] transition-shadow duration-300",
          // Denser once content scrolls under it, nearly opaque with the menu open.
          open
            ? "[--glass-a:rgb(255_255_255/0.97)] [--glass-b:rgb(255_255_255/0.95)] dark:[--glass-a:rgb(13_34_63/0.97)] dark:[--glass-b:rgb(10_28_52/0.95)]"
            : scrolled &&
                "[--glass-a:rgb(255_255_255/0.86)] [--glass-b:rgb(255_255_255/0.78)] dark:[--glass-a:rgb(13_34_63/0.86)] dark:[--glass-b:rgb(10_28_52/0.8)]",
        )}
      >
        <nav aria-label="Principal" className="flex h-14 items-center gap-4 pl-3 pr-2 sm:pl-4">
          <Link href="/" aria-label="DomusCol, inicio" className="shrink-0 rounded-lg">
            <Logo />
          </Link>

          <ul className="ml-3 hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-[rgb(var(--c-ink)/0.07)] text-ink dark:bg-white/[0.12] dark:text-white"
                        : "text-body hover:bg-[rgb(var(--c-ink)/0.05)] hover:text-ink dark:text-white/70 dark:hover:bg-white/[0.06] dark:hover:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <ResidentsAccess className={buttonClass("ghost", "md", "hidden sm:inline-flex")}>Acceso residentes</ResidentsAccess>
            <Link href="/contacto" className={buttonClass("primary", "md", "hidden sm:inline-flex")}>
              Solicitar demo
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="grid h-10 w-10 place-items-center rounded-xl text-ink transition-colors hover:bg-[rgb(var(--c-ink)/0.06)] dark:text-white dark:hover:bg-white/[0.08] lg:hidden"
            >
              {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <div ref={menuRef} id="menu-movil" data-open={open} className="collapsible lg:hidden">
          <div>
            <ul className="border-t border-line px-2 py-2 dark:border-white/10">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-12 items-center rounded-xl px-3 text-base font-medium",
                        active
                          ? "bg-[rgb(var(--c-ink)/0.07)] text-ink dark:bg-white/[0.1] dark:text-white"
                          : "text-body hover:bg-[rgb(var(--c-ink)/0.05)] hover:text-ink dark:text-white/80 dark:hover:bg-white/[0.06] dark:hover:text-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="grid gap-2 px-3 pb-4 sm:hidden">
              <ResidentsAccess className={buttonClass("ghost", "lg")}>Acceso residentes</ResidentsAccess>
              <Link href="/contacto" className={buttonClass("primary", "lg")}>
                Solicitar demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
