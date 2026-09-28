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

// Facade texture: rows of windows, a few lit, drawn once as an SVG tile.
const facade =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="112"><g fill="#ffffff" fill-opacity="0.05"><rect x="8" y="8" width="16" height="20" rx="3"/><rect x="32" y="8" width="16" height="20" rx="3"/><rect x="56" y="8" width="16" height="20" rx="3"/><rect x="8" y="36" width="16" height="20" rx="3"/><rect x="56" y="36" width="16" height="20" rx="3"/><rect x="8" y="64" width="16" height="20" rx="3"/><rect x="32" y="64" width="16" height="20" rx="3"/><rect x="32" y="92" width="16" height="20" rx="3"/><rect x="56" y="92" width="16" height="20" rx="3"/></g><rect x="32" y="36" width="16" height="20" rx="3" fill="#10B981" fill-opacity="0.35"/><rect x="56" y="64" width="16" height="20" rx="3" fill="#FFD08C" fill-opacity="0.18"/></svg>`,
  );

// Opening band for inner pages. The live skyline stays on the home page;
// inner pages open on a photo of the place the page is about.
export function PageHero({ title, lead, image, children }: PageHeroProps) {
  return (
    <section className="on-navy relative isolate overflow-clip bg-navy text-white">
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
          <div aria-hidden className="absolute inset-0 bg-[rgb(7_21_39/0.72)] lg:bg-transparent lg:bg-gradient-to-r lg:from-navy lg:via-[rgb(13_34_63/0.35)] lg:to-transparent" />
          {image.credit && (
            <p className="absolute bottom-3 right-4 hidden text-[11px] text-white/70 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)] lg:block">
              Foto: {image.credit}, Unsplash
            </p>
          )}
        </div>
      ) : (
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 -z-10 w-2/3 [mask-image:linear-gradient(90deg,transparent,#000_60%)]"
          style={{ backgroundImage: `url("${facade}")`, backgroundSize: "96px 112px" }}
        />
      )}

      <div className="mx-auto max-w-page px-4 pb-20 pt-36 sm:px-6 sm:pb-24 sm:pt-40 lg:min-h-[30rem] lg:px-8">
        <div className="max-w-xl">
          <h1 className="animate-rise text-4xl font-extrabold text-white sm:text-5xl">{title}</h1>
          <p className="animate-rise mt-5 text-lg text-white/75 [animation-delay:100ms]">{lead}</p>
          {children && <div className="animate-rise mt-8 [animation-delay:180ms]">{children}</div>}
        </div>
      </div>
    </section>
  );
}
