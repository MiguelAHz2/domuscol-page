import { ISOTYPE } from "@/components/brand/isotype";

// "Paz y salvo" seal from the brand kit (asset 23), drawn inline so its
// lettering uses the site's typeface. The ring carries the conjunto's name.

export function PazYSalvoSeal({ conjunto, className }: { conjunto: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 440 440"
      role="img"
      aria-label={`Sello de paz y salvo de ${conjunto}`}
      className={className}
      style={{ fontFamily: "inherit" }}
    >
      <defs>
        <path id="seal-top" d="M 72,220 A 148,148 0 1,1 368,220" />
        <path id="seal-bottom" d="M 374,220 A 154,154 0 1,1 66,220" />
      </defs>
      <circle cx="220" cy="220" r="196" fill="#FAF8F5" stroke="#181412" strokeWidth="6" />
      <circle cx="220" cy="220" r="182" fill="none" stroke="#E06D44" strokeWidth="2" strokeDasharray="6 4" />
      <circle cx="220" cy="220" r="120" fill="#FFFFFF" stroke="#181412" strokeWidth="2.5" />
      <text fontSize="13.5" fontWeight="800" letterSpacing="3.8" fill="#181412">
        <textPath href="#seal-top" startOffset="50%" textAnchor="middle">
          ★ {conjunto.toUpperCase()} · PROPIEDAD HORIZONTAL ★
        </textPath>
      </text>
      <text fontSize="12.5" fontWeight="800" letterSpacing="3.5" fill="#E06D44">
        <textPath href="#seal-bottom" startOffset="50%" textAnchor="middle">
          SOLUCIONES INTEGRADAS · VERIFICADO
        </textPath>
      </text>
      <g transform="translate(172 118) scale(0.6)">
        <path fill="#E06D44" d={ISOTYPE.core} />
        <path fill="#181412" fillRule="evenodd" d={ISOTYPE.structure} />
        <path fill="#E06D44" fillRule="evenodd" d={ISOTYPE.roof} />
        <path fill="#181412" d={ISOTYPE.keystone} />
      </g>
      <text x="220" y="232" textAnchor="middle" fontSize="22" fontWeight="800" letterSpacing="-0.5" fill="#181412">
        Domus<tspan fill="#E06D44">Col</tspan>
      </text>
      <rect x="116" y="248" width="208" height="32" rx="8" fill="#E06D44" />
      <text x="220" y="269" textAnchor="middle" fontSize="12" fontWeight="800" letterSpacing="2.8" fill="#181412">
        PAZ Y SALVO OFICIAL
      </text>
      <text x="220" y="302" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="1.5" fill="#786E68">
        ADMINISTRACIÓN AL DÍA
      </text>
    </svg>
  );
}
