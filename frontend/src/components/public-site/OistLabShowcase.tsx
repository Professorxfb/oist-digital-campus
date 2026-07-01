"use client";

import { useState } from "react";

export type OistLabImage = {
  src: string;
  alt: string;
  caption?: string;
};

type OistLabShowcaseProps = {
  title: string | null;
  images: OistLabImage[];
  showThumbnails: boolean;
};

export function OistLabShowcase({
  images,
  showThumbnails,
  title,
}: Readonly<OistLabShowcaseProps>) {
  const visibleImages = images.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = visibleImages[activeIndex] ?? visibleImages[0];

  if (!activeImage) {
    return null;
  }

  return (
    <section
      className="relative min-h-[420px] overflow-hidden bg-slate-950 text-white sm:min-h-[500px] lg:min-h-[560px] xl:min-h-[600px]"
      data-oist-lab-section
    >
      <div
        key={activeImage.src}
        className="absolute inset-0 bg-cover bg-center transition duration-700 ease-out"
        style={{ backgroundImage: `url(${activeImage.src})` }}
        aria-hidden="true"
        data-oist-lab-background
      />
      <div
        className="absolute inset-0 bg-black/20"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[420px] w-full max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[500px] sm:px-6 sm:py-16 lg:min-h-[560px] lg:px-8 xl:min-h-[600px]">
        <div className="mx-auto max-w-5xl">
          {title ? (
            <h2 className="font-serif text-[clamp(3rem,12vw,7rem)] font-bold leading-[0.95] tracking-normal text-white drop-shadow-[0_8px_22px_rgba(0,0,0,0.42)]">
              {title}
            </h2>
          ) : null}
        </div>

        {showThumbnails && visibleImages.length > 1 ? (
          <div className="absolute inset-x-0 bottom-8 z-20 px-4 sm:bottom-10">
            <div className="hide-scrollbar mx-auto flex max-w-full justify-start gap-3 overflow-x-auto pb-1 sm:justify-center sm:gap-4">
              {visibleImages.map((image, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    aria-label={image.caption ? `Show ${image.caption}` : `Show lab image ${index + 1}`}
                    aria-pressed={isActive}
                    className={`group relative h-[64px] w-[86px] shrink-0 overflow-hidden rounded-[15px] border-[3px] bg-white/12 shadow-[0_12px_24px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300 sm:h-[78px] sm:w-[108px] lg:h-[86px] lg:w-[116px] ${
                      isActive ? "border-yellow-400" : "border-white hover:border-yellow-200"
                    }`}
                    onClick={() => setActiveIndex(index)}
                    data-oist-lab-thumbnail
                  >
                    <span
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${image.src})` }}
                      aria-hidden="true"
                    />
                    <span className="absolute inset-0 bg-black/10 transition duration-300 group-hover:bg-black/0" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
