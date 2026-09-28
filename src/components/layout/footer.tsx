import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ResidentsAccess } from "@/components/layout/residents-access";
import { buttonClass } from "@/components/ui/button";
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsappIcon, YoutubeIcon } from "@/components/ui/social-icons";
import { site, social, whatsappHref } from "@/lib/site";

const linkClass = "break-words transition-colors hover:text-ink dark:hover:text-white";

const COLUMNS = [
  {
    title: "Producto",
    links: [
      { label: "Módulos", href: "/modulos" },
      { label: "Beneficios", href: "/beneficios" },
      { label: "Precios", href: "/precios" },
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: `WhatsApp ${site.whatsappLabel}`, href: whatsappHref() },
      { label: `Soporte técnico: ${site.supportEmail}`, href: `mailto:${site.supportEmail}` },
      { label: `Ventas: ${site.salesEmail}`, href: `mailto:${site.salesEmail}` },
      { label: "Solicitar demo", href: "/contacto" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de tratamiento de datos (Habeas Data)", href: "/legal/tratamiento-de-datos" },
      { label: "Autorización de datos, Ley 1581 de 2012", href: "/legal/autorizacion-de-datos" },
      { label: "Términos y condiciones", href: "/legal/terminos-y-condiciones" },
      { label: "Política de cookies", href: "/legal/cookies" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", href: social.instagram, icon: InstagramIcon },
  { label: "Facebook", href: social.facebook, icon: FacebookIcon },
  { label: "LinkedIn", href: social.linkedin, icon: LinkedinIcon },
  { label: "YouTube", href: social.youtube, icon: YoutubeIcon },
].filter((s) => s.href);

// Drawn instead of the 🇨🇴 emoji, which Windows renders as the letters "CO".
function ColombiaFlag() {
  return (
    <svg
      viewBox="0 0 24 16"
      aria-hidden
      className="h-3.5 w-[21px] overflow-hidden rounded-[3px] ring-1 ring-[rgb(var(--c-ink)/0.15)] dark:ring-white/20"
    >
      <rect width="24" height="8" fill="#FCD116" />
      <rect y="8" width="24" height="4" fill="#003893" />
      <rect y="12" width="24" height="4" fill="#CE1126" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2 text-muted dark:border-transparent dark:bg-navy-deep dark:text-white/65">
      <div className="mx-auto max-w-page px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm">{site.tagline}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line py-1 pl-3 pr-2.5 text-sm font-medium text-ink dark:border-white/15 dark:text-white">
              Hecho en Colombia <ColombiaFlag />
            </p>
            <div className="mt-6">
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost", "md")}>
                <WhatsappIcon className="h-4 w-4" />
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-semibold text-ink dark:text-white">{col.title}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
                {col.title === "Producto" && (
                  <li>
                    <ResidentsAccess className={`${linkClass} text-left`}>Acceso residentes</ResidentsAccess>
                  </li>
                )}
              </ul>
              {col.title === "Soporte" && <p className="mt-4 text-xs text-muted dark:text-white/45">{site.supportHours}</p>}
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse gap-6 border-t border-line pt-8 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted dark:text-white/45">© 2026 DomusCol. Todos los derechos reservados.</p>
          {SOCIAL.length > 0 && (
            <ul className="flex gap-1">
              {SOCIAL.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-[rgb(var(--c-ink)/0.06)] hover:text-ink dark:text-white/60 dark:hover:bg-white/[0.07] dark:hover:text-white"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
