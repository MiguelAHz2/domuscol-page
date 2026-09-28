import Image from "next/image";
import Link from "next/link";
import towersAtNight from "@/assets/images/torres-noche.jpg";
import { buttonClass } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/social-icons";
import { whatsappHref } from "@/lib/site";

// Closing call to action shared by every page: residential towers at dusk
// with their windows lit, and the invitation on a pane of navy glass.
export function FinalCta({
  title = "Lleva tu conjunto a DomusCol",
  text = "Agenda una demo de 30 minutos con la estructura real de tu conjunto. Sin compromiso.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="on-navy relative isolate overflow-clip bg-navy py-24 sm:py-32">
      <Image
        src={towersAtNight}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        className="-z-10 object-cover"
        style={{ objectPosition: "50% 60%" }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[rgb(7_21_39/0.85)] via-[rgb(7_21_39/0.45)] to-[rgb(7_21_39/0.15)]" />
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="glass glass-navy max-w-xl rounded-[24px] p-7 sm:p-9">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-white/75">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contacto" className={buttonClass("primary", "lg")}>
              Solicitar demo
            </Link>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost-on-navy", "lg")}>
              <WhatsappIcon className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
      <p className="absolute bottom-3 right-4 text-[11px] text-white/60">Foto: Eugene Chystiakov, Unsplash</p>
    </section>
  );
}
