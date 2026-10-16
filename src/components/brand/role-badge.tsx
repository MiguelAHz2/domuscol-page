import type { ReactNode } from "react";
import { ISOTYPE } from "@/components/brand/isotype";

// Role badges from the brand kit (assets 16–19), drawn inline so their text
// uses the site's typeface instead of a fallback font.

export type Role = "administrador" | "residente" | "consejo" | "seguridad";

const T = "#E06D44";
const W = "#FFFFFF";

const BADGES: Record<Role, { code: string; title: string; caption: string; icon: ReactNode }> = {
  administrador: {
    code: "DOMUSCOL · AD · 05",
    title: "ADMINISTRADOR P.H.",
    caption: "OPERACIÓN INTEGRAL Y MANTENIMIENTO",
    icon: (
      <>
        <rect x="22" y="22" width="12" height="28" rx="2" stroke={T} strokeWidth="2.6" fill="none" />
        <rect x="38" y="30" width="12" height="20" rx="2" stroke={W} strokeWidth="2.6" fill="none" />
        <line x1="19" y1="50" x2="53" y2="50" stroke={T} strokeWidth="2.8" strokeLinecap="round" />
      </>
    ),
  },
  residente: {
    code: "DOMUSCOL · RS · 06",
    title: "RESIDENTE",
    caption: "RESERVAS COMUNES, CITOFONÍA Y PQRS",
    icon: (
      <>
        <circle cx="36" cy="29" r="7" stroke={T} strokeWidth="2.8" fill="none" />
        <path d="M23 49c0-7 6-12 13-12s13 5 13 12" stroke={W} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  consejo: {
    code: "DOMUSCOL · CO · 03",
    title: "CONSEJO",
    caption: "GOBERNANZA, ACTAS Y PRESUPUESTO",
    icon: (
      <>
        <rect x="22" y="25" width="28" height="22" rx="5" stroke={T} strokeWidth="2.8" fill="none" />
        <line x1="29" y1="33" x2="43" y2="33" stroke={W} strokeWidth="2.8" strokeLinecap="round" />
        <line x1="29" y1="39" x2="38" y2="39" stroke={T} strokeWidth="2.8" strokeLinecap="round" />
      </>
    ),
  },
  seguridad: {
    code: "DOMUSCOL · SG · 04",
    title: "SEGURIDAD / GUARDIA",
    caption: "PORTERÍA, ACCESO QR Y MINUTA DIGITAL",
    icon: (
      <>
        <path d="M36 21 50 26v10c0 9.5-6 16-14 19-8-3-14-9.5-14-19V26l14-5Z" stroke={T} strokeWidth="2.8" fill="none" />
        <path d="m31 36 3.5 3.5 7.5-7.5" stroke={W} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
  },
};

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const b = BADGES[role];
  return (
    <svg
      viewBox="0 0 480 156"
      role="img"
      aria-label={`Perfil ${b.title.toLowerCase()}: ${b.caption.toLowerCase()}`}
      className={className}
      style={{ fontFamily: "inherit" }}
    >
      <rect x="2" y="2" width="476" height="152" rx="20" fill="#181412" stroke={T} strokeWidth="1.8" strokeOpacity="0.65" />
      <g transform="translate(24 42)">
        <rect width="72" height="72" rx="16" fill="#241E1B" stroke={T} strokeWidth="1.5" strokeOpacity="0.5" />
        {b.icon}
      </g>
      <text x="114" y="54" fontSize="10.5" fontWeight="800" letterSpacing="3.2" fill={T}>
        {b.code}
      </text>
      <text x="114" y="88" fontSize="22" fontWeight="800" letterSpacing="-0.4" fill={W}>
        {b.title}
      </text>
      <text x="114" y="114" fontSize="9.5" fontWeight="700" letterSpacing="1.4" fill="#C4B8B1">
        {b.caption}
      </text>
      <g transform="translate(406 22) scale(0.3)">
        <path fill={T} d={ISOTYPE.core} />
        <path fill={W} fillRule="evenodd" d={ISOTYPE.structure} />
        <path fill={T} fillRule="evenodd" d={ISOTYPE.roof} />
        <path fill={W} d={ISOTYPE.keystone} />
      </g>
    </svg>
  );
}
