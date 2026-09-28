import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import acceso from "@/assets/images/acceso-conjunto.jpg";
import administracion from "@/assets/images/administracion.jpg";
import residente from "@/assets/images/residente-celular.jpg";
import { Isotipo } from "@/components/brand/logo";

interface Story {
  photo: StaticImageData;
  alt: string;
  position: string;
  role: string;
  text: string;
  notice: { title: string; detail: string };
}

const STORIES: Story[] = [
  {
    photo: administracion,
    alt: "Administradora revisando la cartera del conjunto en su portátil",
    position: "38% 40%",
    role: "Administración",
    text: "Recaudo conciliado, cartera al día e informes listos para el consejo sin pasar noches en Excel.",
    notice: { title: "Recaudo de octubre: 91 %", detail: "87 de 96 unidades al día" },
  },
  {
    photo: residente,
    alt: "Residente pagando la cuota de administración desde su celular",
    position: "46% 30%",
    role: "Residentes",
    text: "La cuota, el paz y salvo, las reservas y las circulares, desde el celular y cuando lo necesiten.",
    notice: { title: "Pago aprobado", detail: "Cuota de octubre de T2-502, con Nequi" },
  },
  {
    photo: acceso,
    alt: "Entrada de un edificio residencial con portón de acceso",
    position: "50% 70%",
    role: "Portería",
    text: "Visitantes con pase QR, paquetes y minuta del turno registrados en una tablet en la entrada.",
    notice: { title: "Visitante autorizado", detail: "Andrés Gómez para T1-804, pase QR" },
  },
];

// Real places and the DomusCol notification each person gets there. The
// glass sits over photography, where it has something to refract.
export function People() {
  return (
    <section aria-labelledby="personas-titulo" className="bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="personas-titulo" className="text-4xl font-extrabold sm:text-5xl">
              Para quienes administran, viven y cuidan el conjunto
            </h2>
            <p className="mt-4 text-lg">
              Cada persona usa DomusCol desde su lugar: la oficina de administración, su celular o la portería.
            </p>
          </div>
          <Link
            href="/beneficios"
            className="shrink-0 font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-emerald"
          >
            Ver beneficios por perfil
          </Link>
        </div>

        {/* Swipeable row on phones, three columns from tablet up */}
        <div className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:gap-6">
          {STORIES.map((s) => (
            <figure key={s.role} className="w-[82%] shrink-0 snap-center md:w-auto">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-navy">
                <Image
                  src={s.photo}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                  style={{ objectPosition: s.position }}
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgb(7_21_39/0.55)] to-transparent" />
                <div className="glass glass-strong absolute inset-x-3 bottom-3 flex items-start gap-3 rounded-2xl p-3 sm:inset-x-4 sm:bottom-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-navy">
                    <Isotipo className="h-7 w-7" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline justify-between gap-2 text-[11px] text-muted">
                      DomusCol <span>ahora</span>
                    </p>
                    <p className="truncate text-sm font-semibold text-ink">{s.notice.title}</p>
                    <p className="truncate text-xs text-body">{s.notice.detail}</p>
                  </div>
                </div>
              </div>
              <figcaption className="mt-5">
                <p className="text-xl font-bold text-ink">{s.role}</p>
                <p className="mt-1.5 text-body">{s.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
