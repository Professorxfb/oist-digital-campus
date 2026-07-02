"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCmsAssetUrl } from "@/lib/cms-display";
import type { FacultyProfile } from "@/types/cms";

type FacultySocialLink = {
  label: string;
  href: string;
  icon: "facebook" | "linkedin" | "twitter" | "website";
};

export function ProfessorsCarousel({
  profiles,
}: Readonly<{
  profiles: FacultyProfile[];
}>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useEffect(() => {
    const viewport = scrollRef.current;

    if (!viewport) {
      return;
    }

    const updateItemsPerPage = () => {
      const width = viewport.clientWidth;

      if (width >= 1024) {
        setItemsPerPage(3);
      } else if (width >= 640) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    updateItemsPerPage();

    const resizeObserver = new ResizeObserver(updateItemsPerPage);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const viewport = scrollRef.current;

    if (!viewport) {
      return;
    }

    const updateActivePage = () => {
      const nextPage = Math.round(viewport.scrollLeft / viewport.clientWidth);
      setActivePage(Math.min(Math.max(nextPage, 0), getPageCount(profiles.length, itemsPerPage) - 1));
    };

    updateActivePage();
    viewport.addEventListener("scroll", updateActivePage, { passive: true });

    return () => viewport.removeEventListener("scroll", updateActivePage);
  }, [itemsPerPage, profiles.length]);

  const pageCount = getPageCount(profiles.length, itemsPerPage);

  const scrollToPage = (pageIndex: number) => {
    const viewport = scrollRef.current;

    if (!viewport) {
      return;
    }

    viewport.scrollTo({
      left: viewport.clientWidth * pageIndex,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div
        ref={scrollRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-3"
        aria-label="OIST professors carousel"
      >
        {profiles.map((profile) => (
          <div
            key={profile.slug}
            className="min-w-0 shrink-0 basis-full snap-start sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
          >
            <ProfessorCard profile={profile} />
          </div>
        ))}
      </div>

      {pageCount > 1 ? (
        <div className="mt-8 flex justify-center gap-3" aria-label="Professor carousel pages">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={`professor-page-${index + 1}`}
              type="button"
              className={`h-3 w-3 rounded-full border transition duration-300 hover:scale-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/70 ${
                index === activePage
                  ? "border-[#064c78] bg-[#064c78]"
                  : "border-slate-300 bg-white hover:border-yellow-400 hover:bg-yellow-300"
              }`}
              aria-label={`Show professor page ${index + 1}`}
              aria-current={index === activePage ? "true" : undefined}
              onClick={() => scrollToPage(index)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProfessorCard({
  profile,
}: Readonly<{
  profile: FacultyProfile;
}>) {
  const photoUrl = getCmsAssetUrl(profile.photo_url ?? profile.photo_path ?? null);
  const photoBackgroundImage = photoUrl
    ? `url(${photoUrl})`
    : "radial-gradient(circle at 30% 20%, rgba(250,204,21,0.24), transparent 28%), linear-gradient(135deg,#071733,#1d4ed8 58%,#e0f2fe)";
  const socialLinks = getFacultySocialLinks(profile);

  return (
    <article className="group relative h-full overflow-hidden rounded-[10px] border border-white bg-white shadow-[0_18px_44px_rgba(2,6,23,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#064c78] hover:shadow-[0_24px_60px_rgba(2,6,23,0.12)]">
      <Link
        href={`/faculty-profiles/${profile.slug}`}
        className="block h-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/70"
        aria-label={`View faculty profile for ${profile.name}`}
      >
        <div className="overflow-hidden p-3 pb-0">
          <div
            className="relative aspect-[1.08/1] overflow-hidden rounded-[10px] bg-slate-100"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{ backgroundImage: photoBackgroundImage }}
            />
            <div className="absolute inset-0 bg-[#061f3f]/0 transition duration-500 group-hover:bg-[#061f3f]/18" />
          </div>
        </div>
        <div className="px-6 py-8 text-center transition duration-300 group-hover:bg-[#064c78] sm:px-8">
          <h3 className="font-serif text-[clamp(1.45rem,4.8vw,1.68rem)] font-bold leading-tight tracking-normal text-[#061f3f] transition duration-300 group-hover:text-white">
            {profile.name}
          </h3>
          {profile.designation ? (
            <p className="mt-3 text-base leading-6 text-slate-500 transition duration-300 group-hover:text-blue-50">
              {profile.designation}
            </p>
          ) : null}
        </div>
      </Link>
      {socialLinks.length > 0 ? (
        <div className="absolute right-6 top-6 z-20 flex translate-x-3 flex-col gap-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#064c78] shadow-lg shadow-slate-950/15 transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-[#061f3f] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/70"
              aria-label={`${profile.name} ${link.label}`}
            >
              {renderFacultySocialIcon(link.icon)}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function getPageCount(totalItems: number, itemsPerPage: number): number {
  return Math.max(1, Math.ceil(totalItems / itemsPerPage));
}

function getFacultySocialLinks(profile: FacultyProfile): FacultySocialLink[] {
  return [
    profile.facebook_url
      ? { label: "Facebook profile", href: profile.facebook_url, icon: "facebook" as const }
      : null,
    profile.linkedin_url
      ? { label: "LinkedIn profile", href: profile.linkedin_url, icon: "linkedin" as const }
      : null,
    profile.twitter_url
      ? { label: "X profile", href: profile.twitter_url, icon: "twitter" as const }
      : null,
    profile.website_url
      ? { label: "website", href: profile.website_url, icon: "website" as const }
      : null,
  ].filter((link): link is FacultySocialLink => link !== null);
}

function renderFacultySocialIcon(icon: FacultySocialLink["icon"]): React.ReactNode {
  switch (icon) {
    case "facebook":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2.4c-.8-.1-1.6-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.3v2H7.6V12h2.8v9.8H14V12h2.8l.5-3.5H14Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.9 8.9H3.4v11.2h3.5V8.9ZM5.2 3.4a2 2 0 1 0 0 4.1 2 2 0 0 0 0-4.1Zm15.4 10.5c0-3.1-1.7-5.2-4.5-5.2-1.8 0-2.9 1-3.4 1.8V8.9H9.3v11.2h3.5v-6c0-1.5.8-2.4 2.1-2.4 1.2 0 2 .8 2 2.5v5.9h3.6v-6.2Z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m15 10.6 6-7h-3.3l-4.2 4.9-3.4-4.9H3.4l6.3 9-6.5 7.8h3.3l4.8-5.7 4 5.7h6.7l-7-9.8Zm-2 2.4-1.4-1.9-3.7-5.2h1.5l3 4.2 1.4 1.9 4 5.7h-1.5L13 13Z" />
        </svg>
      );
    case "website":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.1 2.4 3.1 5.4 3.1 9s-1 6.6-3.1 9c-2.1-2.4-3.1-5.4-3.1-9s1-6.6 3.1-9Z" />
        </svg>
      );
  }

  return null;
}
