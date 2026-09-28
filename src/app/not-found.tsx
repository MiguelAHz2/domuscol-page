import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { buttonClass } from "@/components/ui/button";
import { navLinks } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          title="Esta página no existe"
          lead="Puede que el enlace esté mal escrito o que la página se haya movido. Estas son las secciones de DomusCol:"
        >
          <div className="flex flex-wrap gap-2">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full border border-[rgb(var(--c-ink)/0.15)] bg-surface/60 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-white/10">
                {l.label}
              </Link>
            ))}
          </div>
          <Link href="/" className={buttonClass("primary", "lg", "mt-8")}>
            Volver al inicio
          </Link>
        </PageHero>
      </main>
      <Footer />
    </>
  );
}
