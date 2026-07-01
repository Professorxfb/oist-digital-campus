"use client";

import { useEffect, useId, useState } from "react";

type VideoLightboxProps = Readonly<{
  externalVideoUrl: string | null;
  thumbnailUrl: string | null;
  uploadedVideoUrl: string | null;
  youtubeEmbedUrl: string | null;
}>;

export function VideoLightbox({
  externalVideoUrl,
  thumbnailUrl,
  uploadedVideoUrl,
  youtubeEmbedUrl,
}: VideoLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const embedUrl = getSafeEmbedUrl(youtubeEmbedUrl ?? externalVideoUrl);
  const fallbackUrl = externalVideoUrl ?? uploadedVideoUrl;
  const hasPlayableVideo = Boolean(embedUrl || uploadedVideoUrl || fallbackUrl);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!hasPlayableVideo) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-[12px] bg-[#061f3f] text-white transition duration-300 hover:bg-yellow-400 hover:text-[#061f3f] hover:shadow-[0_20px_42px_rgba(2,6,23,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
        onClick={() => setIsOpen(true)}
        aria-label="Play section video"
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

      {isOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#061f3f]/88 p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-[960px]">
            <h2 id={titleId} className="sr-only">
              About section video
            </h2>
            <button
              type="button"
              className="absolute -right-2 -top-12 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#061f3f] shadow-lg transition duration-300 hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 sm:right-0"
              onClick={() => setIsOpen(false)}
              aria-label="Close video"
            >
              <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>

            <div className="aspect-video overflow-hidden rounded-[16px] bg-slate-950 shadow-[0_26px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/15">
              {embedUrl ? (
                <iframe
                  className="h-full w-full"
                  src={embedUrl}
                  title="About section video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : uploadedVideoUrl ? (
                <video
                  className="h-full w-full bg-slate-950"
                  src={uploadedVideoUrl}
                  controls
                  autoPlay
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center text-white">
                  <p className="max-w-md text-base leading-7 text-blue-50">
                    This video cannot be embedded safely inside the website.
                  </p>
                  {fallbackUrl ? (
                    <a
                      className="inline-flex min-h-11 items-center justify-center rounded-[6px] bg-yellow-400 px-5 py-3 text-sm font-black text-[#061f3f] transition duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                      href={fallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open video
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function getSafeEmbedUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    if (hostname === "youtube-nocookie.com" && url.pathname.startsWith("/embed/")) {
      return url.toString();
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtu.be") {
      const videoId = getYouTubeVideoId(url);

      return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0` : null;
    }

    if (hostname === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
      return url.toString();
    }

    if (hostname === "vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];

      return videoId ? `https://player.vimeo.com/video/${encodeURIComponent(videoId)}?autoplay=1` : null;
    }
  } catch {
    return null;
  }

  return null;
}

function getYouTubeVideoId(url: URL): string | null {
  if (url.hostname.toLowerCase().endsWith("youtu.be")) {
    return url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  const fromSearch = url.searchParams.get("v");

  if (fromSearch) {
    return fromSearch;
  }

  if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) {
    return url.pathname.split("/").filter(Boolean)[1] ?? null;
  }

  return null;
}
