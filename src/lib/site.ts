// Contact details and external URLs are placeholders until the
// commercial channels are confirmed.
export const site = {
  name: "DomusCol",
  url: "https://domuscol.co",
  tagline: "Administración, convivencia y finanzas para la propiedad horizontal en Colombia.",
  description:
    "Gestión transparente, pagos en línea, control de accesos y convivencia en una sola plataforma adaptada a la Propiedad Horizontal en Colombia.",
  residentsUrl: "https://app.domuscol.co/login",
  whatsappNumber: "573000000000",
  whatsappLabel: "+57 300 000 0000",
  whatsappMessage: "Hola, quiero información de DomusCol para mi conjunto.",
  supportEmail: "soporte@domuscol.co",
  salesEmail: "hola@domuscol.co",
  supportHours: "Lunes a sábado, 7:00 a. m. a 7:00 p. m.",
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
