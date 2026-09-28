"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { X } from "lucide-react";
import { site } from "@/lib/site";

export interface VideoDialogHandle {
  open: () => void;
}

/** Turns a YouTube, Vimeo or video-file URL into something the dialog can play. */
function toPlayer(url: string): { kind: "iframe" | "file"; src: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www|m)\./, "");
    if (host === "youtu.be" || host === "youtube.com") {
      const id = host === "youtu.be" ? u.pathname.slice(1) : (u.searchParams.get("v") ?? u.pathname.split("/").pop());
      // youtube-nocookie: no tracking cookies until the person presses play
      if (id) return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return { kind: "iframe", src: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1` };
    }
    if (/\.(mp4|webm)$/i.test(u.pathname)) return { kind: "file", src: url };
  } catch {
    // Not a URL: treated as no video.
  }
  return null;
}

const PLAYER = toPlayer(site.demoVideoUrl);

/** True when NEXT_PUBLIC_DEMO_VIDEO_URL points to a video the dialog can play. */
export const hasDemoVideo = PLAYER !== null;

// The walkthrough video. The player only exists while the dialog is open,
// so nothing loads until someone asks for it and closing stops playback.
export const VideoDialog = forwardRef<VideoDialogHandle>(function VideoDialog(_, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
      dialogRef.current?.showModal();
    },
  }));

  const close = () => dialogRef.current?.close();

  if (!PLAYER) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Video demostrativo de DomusCol"
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === dialogRef.current && close()}
      className="w-[min(60rem,calc(100vw-2rem))] overflow-hidden rounded-[20px] border border-white/10 bg-navy-deep p-0 shadow-float open:animate-enter"
    >
      <div className="relative aspect-video bg-black">
        {open &&
          (PLAYER.kind === "iframe" ? (
            <iframe
              src={PLAYER.src}
              title="Video demostrativo de DomusCol"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video src={PLAYER.src} controls autoPlay playsInline className="absolute inset-0 h-full w-full" />
          ))}
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Cerrar video"
        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-black/50 text-white transition-colors hover:bg-black/70"
      >
        <X aria-hidden className="h-4 w-4" />
      </button>
    </dialog>
  );
});
