import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonClass } from "@/components/ui/button";
import { FacebookIcon, InstagramIcon, LinkedinIcon, WhatsappIcon, YoutubeIcon } from "@/components/ui/social-icons";
import { site, whatsappHref } from "@/lib/site";

const COLUMNS = [
  {
    title: "Producto",
    links: [
      { label: "Módulos", href: "/modulos" },
      { label: "Beneficios", href: "/beneficios" },
      { label: "Precios", href: "/precios" },
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Acceso residentes", href: site.residentsUrl },
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
  { label: "Instagram", href: "https://instagram.com/domuscol", icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/domuscol", icon: FacebookIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/domuscol", icon: LinkedinIcon },
  { label: "YouTube", href: "https://youtube.com/@domuscol", icon: YoutubeIcon },
];

// Drawn instead of the 🇨🇴 emoji, which Windows renders as the letters "CO".
function ColombiaFlag() {
  return (
    <svg viewBox="0 0 24 16" aria-hidden className="h-3.5 w-[21px] overflow-hidden rounded-[3px] ring-1 ring-white/20">
      <rect width="24" height="8" fill="#FCD116" />
      <rect y="8" width="24" height="4" fill="#003893" />
      <rect y="12" width="24" height="4" fill="#CE1126" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="on-navy bg-navy-deep text-white/65">
      <div className="mx-auto max-w-page px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm">{site.tagline}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 py-1 pl-3 pr-2.5 text-sm font-medium text-white">
              Hecho en Colombia <ColombiaFlag />
            </p>
            <div className="mt-6">
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost-on-navy", "md")}>
                <WhatsappIcon className="h-4 w-4" />
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-semibold text-white">{col.title}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className="break-words transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="break-words transition-colors hover:text-white">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              {col.title === "Soporte" && <p className="mt-4 text-xs text-white/45">{site.supportHours}</p>}
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">© 2026 DomusCol. Todos los derechos reservados.</p>
          <ul className="flex gap-1">
            {SOCIAL.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl text-white/60 transition-colors hover:bg-white/[0.07] hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
