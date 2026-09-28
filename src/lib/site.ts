// Site-wide settings. Anything that changes between environments or is
// still a placeholder comes from environment variables (see .env.example),
// with the production values as defaults.
const env = (value: string | undefined, fallback: string) => (value && value.trim() ? value.trim() : fallback);

const url = env(process.env.NEXT_PUBLIC_SITE_URL, "https://domuscol.me").replace(/\/$/, "");

export const site = {
  name: "DomusCol",
  url,
  tagline: "Administración, convivencia y finanzas para la propiedad horizontal en Colombia.",
  description:
    "Gestión transparente, pagos en línea, control de accesos y convivencia en una sola plataforma adaptada a la Propiedad Horizontal en Colombia.",
  // Empty until the residents portal is live: the button explains that instead.
  residentsUrl: env(process.env.NEXT_PUBLIC_RESIDENTS_URL, ""),
  // YouTube, Vimeo or .mp4 link. Empty until the video exists: the hero
  // offers the guided walk through "Un día en Altos del Bosque" instead.
  demoVideoUrl: env(process.env.NEXT_PUBLIC_DEMO_VIDEO_URL, ""),
  /** Digits only, with country code (57 for Colombia). */
  whatsappNumber: env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, "573239377429"),
  whatsappLabel: env(process.env.NEXT_PUBLIC_WHATSAPP_LABEL, "+57 323 937 7429"),
  whatsappMessage: "Hola, quiero información de DomusCol para mi conjunto.",
  supportEmail: env(process.env.NEXT_PUBLIC_SUPPORT_EMAIL, "soporte@domuscol.me"),
  salesEmail: env(process.env.NEXT_PUBLIC_SALES_EMAIL, "ventas@domuscol.me"),
  supportHours: "Lunes a sábado, 7:00 a. m. a 7:00 p. m.",
} as const;

// Social profiles: an empty value hides the icon in the footer, so the site
// never links to a profile that doesn't exist yet.
export const social = {
  instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL, ""),
  facebook: env(process.env.NEXT_PUBLIC_FACEBOOK_URL, ""),
  linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL, ""),
  youtube: env(process.env.NEXT_PUBLIC_YOUTUBE_URL, ""),
} as const;

// Legal identity of the data controller (Ley 1581 de 2012). Shown on the
// legal pages; fill in before launch.
export const company = {
  legalName: env(process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME, "[Razón social]"),
  nit: env(process.env.NEXT_PUBLIC_COMPANY_NIT, "[NIT]"),
  address: env(process.env.NEXT_PUBLIC_COMPANY_ADDRESS, "[Dirección]"),
  city: env(process.env.NEXT_PUBLIC_COMPANY_CITY, "Colombia"),
  privacyEmail: env(process.env.NEXT_PUBLIC_PRIVACY_EMAIL, site.supportEmail),
} as const;

export const whatsappHref = (message: string = site.whatsappMessage) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/modulos", label: "Módulos" },
  { href: "/beneficios", label: "Beneficios" },
  { href: "/precios", label: "Precios" },
  { href: "/preguntas-frecuentes", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
] as const;
