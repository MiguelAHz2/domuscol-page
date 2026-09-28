import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";

interface PageHeroProps {
  title: string;
  lead: string;
  /** Photo for the right side. Without it the band shows a quiet facade texture. */
  image?: { src: StaticImageData; alt: string; position?: string; credit?: string };
  /** Chips or actions under the lead. */
  children?: ReactNode;
}

// Facade texture: rows of windows, a few lit, drawn once as an SVG tile in
// the colour of each theme.
const facade = (ink: string, alpha: number) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="112"><g fill="${ink}" fill-opacity="${alpha}"><rect x="8" y="8" width="16" height="20" rx="3"/><rect x="32" y="8" width="16" height="20" rx="3"/><rect x="56" y="8" width="16" height="20" rx="3"/><rect x="8" y="36" width="16" height="20" rx="3"/><rect x="56" y="36" width="16" height="20" rx="3"/><rect x="8" y="64" width="16" height="20" rx="3"/><rect x="32" y="64" width="16" height="20" rx="3"/><rect x="32" y="92" width="16" height="20" rx="3"/><rect x="56" y="92" width="16" height="20" rx="3"/></g><rect x="32" y="36" width="16" height="20" rx="3" fill="#10B981" fill-opacity="0.35"/><rect x="56" y="64" width="16" height="20" rx="3" fill="#E6AA40" fill-opacity="0.22"/></svg>`,
  );
const FACADE_LIGHT = facade("#0D223F", 0.06);
const FACADE_DARK = facade("#FFFFFF", 0.05);

// Opening band for inner pages: a soft blue band in light mode and navy in
// dark mode, with a photo of the place the page is about. The live skyline
// stays on the home page.
export function PageHero({ title, lead, image, children }: PageHeroProps) {
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
            className="absolute inset-0 bg-[rgb(227_236_248/0.84)] dark:bg-[rgb(7_21_39/0.72)] lg:bg-transparent lg:bg-gradient-to-r lg:from-band lg:via-[rgb(var(--c-band)/0.3)] lg:to-transparent dark:lg:bg-transparent"
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
            style={{ backgroundImage: `url("${FACADE_LIGHT}")`, backgroundSize: "96px 112px" }}
          />
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 -z-10 hidden w-2/3 [mask-image:linear-gradient(90deg,transparent,#000_60%)] dark:block"
            style={{ backgroundImage: `url("${FACADE_DARK}")`, backgroundSize: "96px 112px" }}
          />
        </>
      )}

      <div className="mx-auto max-w-page px-4 pb-20 pt-36 sm:px-6 sm:pb-24 sm:pt-40 lg:min-h-[30rem] lg:px-8">
        <div className="max-w-xl">
          <h1 className="animate-rise text-4xl font-extrabold text-ink sm:text-5xl dark:text-white">{title}</h1>
          <p className="animate-rise mt-5 text-lg text-body [animation-delay:100ms] dark:text-white/75">{lead}</p>
          {children && <div className="animate-rise mt-8 [animation-delay:180ms]">{children}</div>}
        </div>
      </div>
    </section>
  );
}
