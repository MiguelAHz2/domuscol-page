"use client";

import { usePathname } from "next/navigation";
import { WhatsappIcon } from "@/components/ui/social-icons";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

// Floating button. Solid navy on purpose: a fixed element with live blur
// has to be re-filtered on every scroll frame, which is what caused lag
// on slower phones. The label opens on hover or focus.
export function WhatsappButton() {
  const pathname = usePathname();
  const message =
    pathname === "/precios"
      ? "Hola, quiero una cotización de DomusCol para mi conjunto."
      : undefined;

  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={cn(
        "group fixed bottom-4 right-4 z-40 flex h-14 items-center rounded-full bg-navy pl-[15px] pr-[15px] text-white shadow-[0_12px_30px_-10px_rgb(4_12_26/0.6)] ring-1 ring-white/10 sm:bottom-6 sm:right-6",
        "transition-[padding] duration-300 hover:pr-5 focus-visible:pr-5",
      )}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_4px_rgb(37_211_102/0.18)]">
        <WhatsappIcon className="h-4 w-4" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width,margin] duration-300 group-hover:ml-2.5 group-hover:max-w-[10rem] group-focus-visible:ml-2.5 group-focus-visible:max-w-[10rem]">
        ¿Hablamos?
      </span>
    </a>
  );
}
