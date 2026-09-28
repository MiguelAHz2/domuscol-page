import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { LEGAL_DOCUMENTS, LEGAL_UPDATED, legalDocument } from "@/lib/data/legal";
import { company } from "@/lib/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const doc = legalDocument(params.slug);
  return {
    title: doc?.title ?? "Documento legal",
    description: doc?.lead,
    alternates: { canonical: `/legal/${params.slug}` },
  };
}

const anchor = (heading: string) =>
  heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function LegalPage({ params }: { params: { slug: string } }) {
  const doc = legalDocument(params.slug);
  if (!doc) notFound();

  return (
    <>
      <PageHero title={doc.title} lead={doc.lead} />

      <div className="mx-auto grid max-w-page gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,15rem)_minmax(0,44rem)] lg:gap-16 lg:px-8">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm text-muted">Vigente desde el {LEGAL_UPDATED}</p>
          {doc.sections.length > 1 && (
            <nav aria-label="En este documento" className="mt-6 hidden lg:block">
              <ul className="space-y-2 border-l border-line text-sm">
                {doc.sections.map((s) => (
                  <li key={s.heading}>
                    <a href={`#${anchor(s.heading)}`} className="-ml-px block border-l border-transparent py-0.5 pl-4 text-muted transition-colors hover:border-ink hover:text-ink">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <dl className="mt-8 rounded-2xl border border-line bg-surface p-5 text-sm">
            <dt className="text-muted">Responsable</dt>
            <dd className="mt-0.5 font-semibold text-ink">{company.legalName}</dd>
            <dt className="mt-3 text-muted">NIT</dt>
            <dd className="mt-0.5 font-semibold text-ink">{company.nit}</dd>
            <dt className="mt-3 text-muted">Datos personales</dt>
            <dd className="mt-0.5">
              <a href={`mailto:${company.privacyEmail}`} className="break-all font-semibold text-cobalt underline-offset-2 hover:underline">
                {company.privacyEmail}
              </a>
            </dd>
          </dl>
        </aside>

        <article className="max-w-[44rem]">
          {doc.sections.map((section, i) => (
            <section key={section.heading} id={anchor(section.heading)} className={cn("scroll-mt-28", i > 0 && "mt-12")}>
              <h2 className="text-2xl font-bold text-ink">{section.heading}</h2>
              {section.body.map((block, j) =>
                typeof block === "string" ? (
                  <p key={j} className="mt-4 text-[1.0625rem] leading-relaxed">
                    {block}
                  </p>
                ) : (
                  <ul key={j} className="mt-4 space-y-2.5 text-[1.0625rem] leading-relaxed">
                    {block.list.map((item) => (
                      <li key={item} className="relative pl-6 before:absolute before:left-1 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-emerald">
                        {item}
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}

          <nav aria-label="Otros documentos legales" className="mt-16 border-t border-line pt-8">
            <p className="text-sm font-semibold text-ink">Otros documentos</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {LEGAL_DOCUMENTS.filter((d) => d.slug !== doc.slug).map((d) => (
                <li key={d.slug}>
                  <Link href={`/legal/${d.slug}`} className="inline-block rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface">
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </div>
    </>
  );
}
