"use client";

import Link from "next/link";
import { useState } from "react";

export type OistLabImage = {
  src: string;
  alt: string;
  caption?: string;
};

type OistLabShowcaseProps = {
  title: string | null;
  subtitle?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  images: OistLabImage[];
};

export function OistLabShowcase({
  buttonText,
  buttonUrl,
  description,
  images,
  subtitle,
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
      className="relative min-h-[430px] overflow-hidden bg-[#061f3f] text-white sm:min-h-[500px] lg:min-h-[590px] xl:min-h-[630px]"
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
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.46),rgba(2,6,23,0.68)_58%,rgba(2,6,23,0.9))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.13),transparent_28%),linear-gradient(90deg,rgba(6,31,63,0.34),transparent_34%,rgba(6,31,63,0.34))]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[430px] w-full max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[500px] sm:px-6 sm:py-16 lg:min-h-[590px] lg:px-8 xl:min-h-[630px]">
        <div className="mx-auto max-w-5xl">
          {subtitle ? (
            <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300 drop-shadow">
              {subtitle}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-4 font-serif text-[clamp(3rem,12vw,7.25rem)] font-bold leading-[0.95] tracking-normal text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-8 text-white/85 drop-shadow sm:text-lg">
              {description}
            </p>
          ) : null}
          {buttonText && buttonUrl ? (
            <div className="mt-7">
              <Link
                href={buttonUrl}
                className="inline-flex items-center rounded-[6px] bg-yellow-400 px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#061f3f] shadow-[0_14px_34px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#061f3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300"
              >
                {buttonText}
              </Link>
            </div>
          ) : null}
        </div>

        {visibleImages.length > 1 ? (
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
                    className={`group relative h-[72px] w-[92px] shrink-0 overflow-hidden rounded-[16px] border-[3px] bg-white/12 shadow-[0_14px_28px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-300 sm:h-[86px] sm:w-[116px] ${
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
            {activeImage.caption ? (
              <p className="mx-auto mt-3 max-w-xl text-center text-sm font-semibold text-white/80 drop-shadow">
                {activeImage.caption}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
