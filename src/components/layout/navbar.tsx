"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonClass } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

// Floating liquid-glass capsule, iOS style. Every page opens on a navy
// band, so the navy glass reads the same on all of them.
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
    <header className="on-navy fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          "glass glass-navy glass-refract mx-auto max-w-[76rem] rounded-[22px] transition-[box-shadow,background-color] duration-300",
          // Denser over light content, and nearly opaque while the menu is
          // open so the page underneath doesn't compete with the links.
          open
            ? "[--glass-a:rgb(13_34_63/0.96)] [--glass-b:rgb(10_28_52/0.94)]"
            : scrolled && "[--glass-a:rgb(13_34_63/0.86)] [--glass-b:rgb(10_28_52/0.8)]",
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
                      active ? "bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14)]" : "text-white/70 hover:bg-white/[0.06] hover:text-white",
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
            <a href={site.residentsUrl} className={buttonClass("ghost-on-navy", "md", "hidden sm:inline-flex")}>
              Acceso residentes
            </a>
            <Link href="/contacto" className={buttonClass("primary", "md", "hidden sm:inline-flex")}>
              Solicitar demo
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="grid h-10 w-10 place-items-center rounded-xl text-white transition-colors hover:bg-white/[0.08] lg:hidden"
            >
              {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <div ref={menuRef} id="menu-movil" data-open={open} className="collapsible lg:hidden">
          <div>
            <ul className="border-t border-white/10 px-2 py-2">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-12 items-center rounded-xl px-3 text-base font-medium",
                        active ? "bg-white/[0.1] text-white" : "text-white/80 hover:bg-white/[0.06] hover:text-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="grid gap-2 px-3 pb-4 sm:hidden">
              <a href={site.residentsUrl} className={buttonClass("ghost-on-navy", "lg")}>
                Acceso residentes
              </a>
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
