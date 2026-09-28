import Image from "next/image";
import Link from "next/link";
import bogotaDay from "@/assets/images/bogota-cerros.jpg";
import towersAtNight from "@/assets/images/torres-noche.jpg";
import { buttonClass } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/ui/social-icons";
import { whatsappHref } from "@/lib/site";

// Closing call to action shared by every page, on a photo that matches the
// theme: Bogotá by day with white glass in light mode, residential towers
// at dusk with navy glass in dark mode. Only the visible photo loads (the
// other one is display:none and lazy).
export function FinalCta({
  title = "Lleva tu conjunto a DomusCol",
  text = "Agenda una demo de 30 minutos con la estructura real de tu conjunto. Sin compromiso.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="relative isolate overflow-clip bg-band py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 dark:hidden">
        <Image src={bogotaDay} alt="" fill sizes="100vw" placeholder="blur" className="object-cover" style={{ objectPosition: "50% 40%" }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[rgb(243_246_250/0.82)] via-[rgb(243_246_250/0.35)] to-transparent" />
        <p className="absolute bottom-3 right-4 text-[11px] text-white/85 [text-shadow:0_1px_2px_rgb(0_0_0/0.55)]">
          Foto: Victor Rosario, Unsplash
        </p>
      </div>
      <div className="absolute inset-0 -z-10 hidden dark:block">
        <Image src={towersAtNight} alt="" fill sizes="100vw" placeholder="blur" className="object-cover" style={{ objectPosition: "50% 60%" }} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[rgb(7_21_39/0.85)] via-[rgb(7_21_39/0.45)] to-[rgb(7_21_39/0.15)]" />
        <p className="absolute bottom-3 right-4 text-[11px] text-white/60">Foto: Eugene Chystiakov, Unsplash</p>
      </div>

      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="glass glass-strong max-w-xl rounded-[24px] p-7 sm:p-9">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contacto" className={buttonClass("primary", "lg")}>
              Solicitar demo
            </Link>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={buttonClass("ghost", "lg")}>
              <WhatsappIcon className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
