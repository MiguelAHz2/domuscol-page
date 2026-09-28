import Image from "next/image";
import brickTower from "@/assets/images/edificio-ladrillo.jpg";

const POINTS = [
  {
    title: "Coeficientes en cada cobro y cada voto",
    text: "Las cuotas y las votaciones se calculan con el coeficiente de copropiedad de cada unidad.",
  },
  {
    title: "Los medios de pago que usa la gente",
    text: "PSE, Nequi y Daviplata además de tarjeta, con el dinero directo a la cuenta del conjunto.",
  },
  {
    title: "Portería como se trabaja aquí",
    text: "Minuta, correspondencia y visitantes, pensados para el guarda de turno.",
  },
  {
    title: "Soporte en español y por WhatsApp",
    text: "En horario colombiano, con gente que conoce la Ley 675.",
  },
];

export function MadeForColombia() {
  return (
    <section aria-labelledby="hecho-titulo" className="relative overflow-clip bg-band text-body dark:text-white/75">
      <div className="grid lg:min-h-[42rem] lg:grid-cols-2">
        <div className="order-2 flex items-center px-4 py-20 sm:px-6 lg:order-1 lg:py-28 lg:pl-[max(2rem,calc((100vw-75rem)/2+2rem))] lg:pr-16">
          <div className="max-w-[36rem]">
            <h2 id="hecho-titulo" className="text-4xl font-extrabold text-ink sm:text-5xl dark:text-white">
              Pensado para la propiedad horizontal colombiana
            </h2>
            <p className="mt-5 text-lg">
              No es un software extranjero traducido. Parte de cómo funcionan de verdad los conjuntos en Colombia: la
              cuota, el consejo, la portería y la asamblea.
            </p>
            <dl className="mt-12 grid gap-x-10 sm:grid-cols-2">
              {POINTS.map(({ title, text }) => (
                <div key={title} className="border-t border-line py-5 dark:border-white/15">
                  <dt className="font-semibold text-ink dark:text-white">{title}</dt>
                  <dd className="mt-1.5 text-sm text-muted dark:text-white/65">{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative order-1 h-[24rem] sm:h-[30rem] lg:order-2 lg:h-auto">
          <Image
            src={brickTower}
            alt="Torre residencial de ladrillo en Bogotá, con balcones cerrados en vidrio"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            placeholder="blur"
            className="object-cover"
            style={{ objectPosition: "72% 50%" }}
          />
          {/* Blends the photo into the text column on desktop */}
          <div aria-hidden className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-band to-transparent lg:block" />
          <p className="absolute bottom-3 right-4 text-[11px] text-white/80 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">
            Foto: Victor Rosario, Unsplash
          </p>
        </div>
      </div>
    </section>
  );
}
