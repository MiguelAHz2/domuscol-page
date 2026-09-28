import { FinalCta } from "@/components/layout/final-cta";
import { DayInConjunto } from "@/components/sections/day-in-conjunto";
import { ModulesIndex } from "@/components/sections/modules-index";
import { People } from "@/components/sections/people";
import { Hero } from "@/components/sections/hero";
import { MadeForColombia } from "@/components/sections/made-for-colombia";
import { Metrics } from "@/components/sections/metrics";
import { JsonLd } from "@/components/seo/json-ld";
import { PLANS } from "@/lib/data/pricing";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: site.name,
              url: site.url,
              logo: `${site.url}/icon.svg`,
              email: site.salesEmail,
              areaServed: "CO",
            },
            {
              "@type": "SoftwareApplication",
              name: site.name,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web, Android, iOS",
              description: site.description,
              inLanguage: "es-CO",
              offers: PLANS.map((p) => ({
                "@type": "Offer",
                name: `Plan ${p.name}`,
                price: p.perUnit,
                priceCurrency: "COP",
                description: "Valor mensual por unidad privada, antes de IVA.",
              })),
            },
          ],
        }}
      />
      <Hero />
      <Metrics />
      <DayInConjunto />
      <People />
      <MadeForColombia />
      <ModulesIndex />
      <FinalCta />
    </>
  );
}
