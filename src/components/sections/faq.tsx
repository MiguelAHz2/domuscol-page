"use client";

import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/social-icons";
import { FAQ } from "@/lib/data/faq";
import { site, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<string | null>(FAQ[0].id);

  return (
    <section aria-label="Preguntas y respuestas" className="bg-surface py-16 sm:py-24">
      <div className="mx-auto grid max-w-page gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)] lg:gap-10 lg:px-8">
        <ul className="border-t border-line">
          {FAQ.map((item) => {
            const isOpen = open === item.id;
            return (
              <li key={item.id} className="border-b border-line">
                <h2>
                  <button
                    type="button"
                    id={`faq-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}-respuesta`}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between gap-6 rounded-lg py-6 text-left text-lg font-semibold text-ink transition-colors hover:text-cobalt"
                  >
                    {item.question}
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-300",
                        isOpen ? "rotate-180 bg-navy text-white dark:bg-white/15" : "border border-line text-muted",
                      )}
                    >
                      <ChevronDown aria-hidden className="h-4 w-4" />
                    </span>
                  </button>
                </h2>
                <div
                  id={`faq-${item.id}-respuesta`}
                  role="region"
                  aria-labelledby={`faq-${item.id}`}
                  aria-hidden={!isOpen}
                  data-open={isOpen}
                  className="collapsible"
                >
                  <div>
                    <div className="max-w-[62ch] space-y-3 pb-7 pr-12">
                      {item.answer.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-[20px] border border-line bg-bg p-6 sm:p-7 lg:sticky lg:top-28">
          <h2 className="text-xl font-bold">¿No encuentras tu respuesta?</h2>
          <p className="mt-2 text-sm">Te contestamos en horario hábil: {site.supportHours.charAt(0).toLowerCase() + site.supportHours.slice(1)}</p>
          <div className="mt-6 grid gap-2.5">
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md")}>
              <WhatsappIcon className="h-4 w-4" />
              Escríbenos por WhatsApp
            </a>
            <a href={`mailto:${site.salesEmail}`} className={buttonClass("outline", "md")}>
              <Mail aria-hidden className="h-4 w-4" />
              {site.salesEmail}
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
