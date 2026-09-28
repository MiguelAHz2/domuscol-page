import type { Metadata } from "next";
import { FinalCta } from "@/components/layout/final-cta";
import { PageHero } from "@/components/layout/page-hero";
import { Faq } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { FAQ } from "@/lib/data/faq";

const description =
  "Ley 675 de Propiedad Horizontal, migración de datos, medios de pago, apps para Android e iOS y protección de datos en DomusCol.";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description,
  alternates: { canonical: "/preguntas-frecuentes" },
  openGraph: { title: "Preguntas frecuentes sobre DomusCol", description, url: "/preguntas-frecuentes" },
};

export default function PreguntasPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: { "@type": "Answer", text: q.answer.join(" ") },
          })),
        }}
      />
      <PageHero
        title="Preguntas frecuentes"
        lead="Lo que más nos preguntan administradores, consejos y residentes antes de pasarse a DomusCol."
      />
      <Faq />
      <FinalCta />
    </>
  );
}
