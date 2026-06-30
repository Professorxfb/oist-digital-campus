"use client";

import { useEffect, useMemo, useState } from "react";
import { getSafeVideoEmbedUrl } from "@/lib/video-embed";

type VideoLightboxProps = {
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  uploadedVideoUrl?: string | null;
  label?: string;
  className?: string;
  buttonClassName?: string;
};

export function VideoLightbox({
  thumbnailUrl,
  videoUrl,
  uploadedVideoUrl,
  label = "Play video",
  className = "",
  buttonClassName = "",
}: Readonly<VideoLightboxProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const embedUrl = useMemo(() => getSafeVideoEmbedUrl(videoUrl), [videoUrl]);
  const fallbackUrl = videoUrl ?? uploadedVideoUrl ?? null;
  const canPlayUploadedVideo = Boolean(uploadedVideoUrl && !embedUrl);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!fallbackUrl) {
    return null;
  }

  const autoplayEmbedUrl = embedUrl ? withAutoplay(embedUrl) : null;

  return (
    <>
      <div className={className}>
        <button
          type="button"
          className={buttonClassName}
          onClick={() => setIsOpen(true)}
          aria-label={label}
        >
          {thumbnailUrl ? (
            <span
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
              aria-hidden="true"
            />
          ) : null}
          <span className="absolute inset-0 bg-slate-950/18 transition-colors duration-300 group-hover:bg-yellow-400/12" aria-hidden="true" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#061f3f] shadow-[0_12px_24px_rgba(2,6,23,0.22)] transition duration-300 group-hover:scale-105 group-hover:bg-yellow-400 group-hover:text-[#061f3f] sm:h-14 sm:w-14" aria-hidden="true">
            <svg className="ml-1 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.5 2.8v10.4L12.5 8 4.5 2.8Z" />
            </svg>
          </span>
        </button>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#031632]/88 px-4 py-6 backdrop-blur-sm sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setIsOpen(false)}
            aria-label="Close video backdrop"
          />
          <div
            className="relative z-10 w-full max-w-[960px] overflow-hidden rounded-[18px] bg-slate-950 shadow-[0_28px_90px_rgba(0,0,0,0.45)] ring-1 ring-white/15"
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#061f3f] shadow-lg transition duration-300 hover:bg-yellow-300 hover:text-[#061f3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              onClick={() => setIsOpen(false)}
              aria-label="Close video"
            >
              <span aria-hidden="true">X</span>
            </button>

            <div className="aspect-video w-full bg-slate-950">
              {autoplayEmbedUrl ? (
                <iframe
                  className="h-full w-full"
                  src={autoplayEmbedUrl}
                  title={label}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : canPlayUploadedVideo && uploadedVideoUrl ? (
                <video className="h-full w-full" src={uploadedVideoUrl} controls autoPlay />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-5 p-8 text-center text-white">
                  <p className="max-w-md text-base leading-7 text-blue-50">
                    This video URL cannot be embedded safely. Open it from the source instead.
                  </p>
                  <a
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-yellow-400 bg-yellow-400 px-5 py-2.5 text-sm font-black text-[#061f3f] transition duration-300 hover:border-white hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                    href={fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Video
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function withAutoplay(url: string): string {
  const parsedUrl = new URL(url);

  parsedUrl.searchParams.set("autoplay", "1");

  if (parsedUrl.hostname.includes("youtube")) {
    parsedUrl.searchParams.set("rel", "0");
  }

  return parsedUrl.toString();
}
