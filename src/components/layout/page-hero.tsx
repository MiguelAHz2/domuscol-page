import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { patternTile } from "@/components/brand/isotype";

interface PageHeroProps {
  title: string;
  lead: string;
  /** Photo for the right side. Without it the band shows the brand pattern. */
  image?: { src: StaticImageData; alt: string; position?: string; credit?: string };
  /** Chips or actions under the lead. */
  children?: ReactNode;
  /** Optional mark above the title (the 404 shows the logo drawing itself). */
  mark?: ReactNode;
}

// The brand's architectural pattern (kit asset 25): the isotype in a
// staggered grid, faint espresso on light, faint white on dark.
const PATTERN_LIGHT = patternTile("#181412", 0.07);
const PATTERN_DARK = patternTile("#FFFFFF", 0.07);

// Opening band for inner pages: a warm limestone band in light mode and espresso in
// dark mode, with a photo of the place the page is about. The live skyline
// stays on the home page.
export function PageHero({ title, lead, image, children, mark }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-clip bg-band text-ink dark:text-white">
      {image ? (
        <div className="absolute inset-0 -z-10 lg:left-[46%]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
            placeholder="blur"
            className="object-cover"
            style={{ objectPosition: image.position ?? "center" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[rgb(var(--c-band)/0.86)] dark:bg-[rgb(16_13_11/0.72)] lg:bg-transparent lg:bg-gradient-to-r lg:from-band lg:via-[rgb(var(--c-band)/0.3)] lg:to-transparent dark:lg:bg-transparent"
          />
          {image.credit && (
            <p className="absolute bottom-3 right-4 hidden text-[11px] text-white/80 [text-shadow:0_1px_2px_rgb(0_0_0/0.55)] lg:block">
              Foto: {image.credit}, Unsplash
            </p>
          )}
        </div>
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 -z-10 w-2/3 [mask-image:linear-gradient(90deg,transparent,#000_60%)] dark:hidden"
            style={{ backgroundImage: PATTERN_LIGHT, backgroundSize: "190px 350px" }}
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 -z-10 hidden w-2/3 [mask-image:linear-gradient(90deg,transparent,#000_60%)] dark:block"
            style={{ backgroundImage: PATTERN_DARK, backgroundSize: "190px 350px" }}
          />
        </>
      )}

      <div className="mx-auto max-w-page px-4 pb-20 pt-36 sm:px-6 sm:pb-24 sm:pt-40 lg:min-h-[30rem] lg:px-8">
        <div className="max-w-xl">
          {mark}
          <h1 className="animate-rise text-4xl font-extrabold text-ink sm:text-5xl dark:text-white">{title}</h1>
          <p className="animate-rise mt-5 text-lg text-body [animation-delay:100ms] dark:text-white/75">{lead}</p>
          {children && <div className="animate-rise mt-8 [animation-delay:180ms]">{children}</div>}
        </div>
      </div>
    </section>
  );
}
