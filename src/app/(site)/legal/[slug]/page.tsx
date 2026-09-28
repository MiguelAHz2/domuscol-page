import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { site } from "@/lib/site";

const DOCUMENTS: Record<string, string> = {
  "tratamiento-de-datos": "Política de tratamiento de datos personales",
  "autorizacion-de-datos": "Autorización para el tratamiento de datos personales",
  "terminos-y-condiciones": "Términos y condiciones",
  cookies: "Política de cookies",
};

export function generateStaticParams() {
  return Object.keys(DOCUMENTS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return {
    title: DOCUMENTS[params.slug] ?? "Documento legal",
    alternates: { canonical: `/legal/${params.slug}` },
    robots: { index: false },
  };
}

// Placeholder until legal publishes the final texts.
export default function LegalPage({ params }: { params: { slug: string } }) {
  const title = DOCUMENTS[params.slug];
  if (!title) notFound();

  return (
    <>
      <PageHero title={title} lead="Documento en preparación." />
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <p className="text-lg">
          Estamos terminando la versión final de este documento conforme a la Ley 1581 de 2012 y el Decreto 1377 de
          2013. Si necesitas consultarlo antes, escríbenos a{" "}
          <a href={`mailto:${site.supportEmail}`} className="font-semibold text-cobalt underline-offset-2 hover:underline">
            {site.supportEmail}
          </a>
          .
        </p>
        <Link href="/" className="mt-10 inline-block font-semibold text-ink underline decoration-line decoration-2 underline-offset-4">
          Volver al inicio
        </Link>
      </section>
    </>
  );
}
