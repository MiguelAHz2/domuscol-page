"use client";

import { usePathname } from "next/navigation";
import { WhatsappIcon } from "@/components/ui/social-icons";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

// Floating glass capsule. The label opens on hover or focus so the button
// stays small over content on phones.
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
        "glass glass-navy glass-refract group fixed bottom-4 right-4 z-40 [--glass-a:rgb(13_34_63/0.86)] [--glass-b:rgb(10_28_52/0.8)] flex h-14 items-center rounded-full pl-[15px] pr-[15px] text-white sm:bottom-6 sm:right-6",
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
