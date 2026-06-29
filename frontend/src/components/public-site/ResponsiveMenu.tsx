"use client";

import Link from "next/link";
import { useState } from "react";
import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import type { MenuItem, SiteSetting } from "@/types/cms";

type HeaderAction = {
  href: string;
  label: string;
};

type StructuralLink = {
  href: string;
  label: string;
};

export function ResponsiveMenu({
  items,
  label = "Menu",
  action,
  links = [],
  settings,
  variant = "desktop",
}: Readonly<{
  items: MenuItem[];
  label?: string;
  action?: HeaderAction | null;
  links?: StructuralLink[];
  settings?: SiteSetting;
  variant?: "desktop" | "drawer";
}>) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "desktop") {
    if (items.length === 0) {
      return null;
    }

    return (
      <nav className="hidden items-center justify-center gap-1 xl:flex" aria-label={label}>
        <MenuItems items={items} />
      </nav>
    );
  }

  if (items.length === 0 && !action && links.length === 0 && !settings) {
    return null;
  }

  const logoUrl = settings ? getCmsAssetUrl(settings.logo_path) : null;
  const title = settings?.site_title ?? settings?.institute_name ?? null;
  const description = getTextPreview(settings?.site_tagline ?? settings?.footer_text, 180);
  const contactValues = [
    settings?.primary_phone,
    settings?.secondary_phone,
    settings?.email,
    settings?.address,
  ].filter(Boolean);

  return (
    <>
      <button
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition duration-300 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 sm:h-12 sm:w-12"
        type="button"
        aria-label={`Open ${label.toLowerCase()}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[80] overflow-hidden" role="dialog" aria-modal="true" aria-label={label}>
          <button
            className="absolute inset-0 h-full w-full cursor-default bg-slate-950/60 backdrop-blur-sm"
            type="button"
            aria-label={`Close ${label.toLowerCase()}`}
            onClick={() => setIsOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-dvh max-h-dvh w-[calc(100vw-1rem)] max-w-[28rem] flex-col overflow-hidden bg-[#061f3f] text-white shadow-2xl sm:w-[min(28rem,100vw)]">
            <div className="shrink-0 bg-[#061f3f] px-5 pb-4 pt-5 sm:px-8 sm:pt-8">
              <div className="flex items-start justify-between gap-4">
                <Link className="flex min-w-0 items-center gap-3" href="/" onClick={() => setIsOpen(false)}>
                  {logoUrl ? (
                    <span
                      className="h-14 w-14 shrink-0 rounded-xl border border-white/15 bg-white bg-contain bg-center bg-no-repeat"
                      style={{ backgroundImage: `url(${logoUrl})` }}
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="h-14 w-14 shrink-0 rounded-xl bg-[linear-gradient(135deg,#ffcc00,#1d4ed8_54%,#082f49)]"
                      aria-hidden="true"
                    />
                  )}
                  {title ? (
                    <span className="min-w-0 text-lg font-black leading-tight tracking-tight">
                      {title}
                    </span>
                  ) : null}
                </Link>
                <button
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-yellow-400 text-slate-950 transition duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                  type="button"
                  aria-label={`Close ${label.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 sm:px-8 sm:pb-8">
              {description ? (
                <p className="text-sm leading-7 text-blue-100">{description}</p>
              ) : null}

              {items.length > 0 ? (
                <nav className="mt-8" aria-label={`${label} drawer`}>
                  <MenuItems items={items} variant="drawer" onNavigate={() => setIsOpen(false)} />
                </nav>
              ) : null}

              {links.length > 0 ? (
                <div className="mt-8 grid gap-3 border-t border-white/10 pt-6">
                  {links.map((link) => (
                    <a
                      key={link.href}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-blue-50 transition duration-300 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}

              {action ? (
                <div className="mt-6">
                  <CTAButton href={action.href} className="w-full px-7 py-3">
                    {action.label}
                  </CTAButton>
                </div>
              ) : null}

              {contactValues.length > 0 ? (
                <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm leading-6 text-blue-100">
                  {contactValues.map((value) => (
                    <p key={value}>{value}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function MenuItems({
  items,
  variant = "desktop",
  onNavigate,
}: Readonly<{
  items: MenuItem[];
  variant?: "desktop" | "dropdown" | "drawer";
  onNavigate?: () => void;
}>) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const isDrawer = variant === "drawer";
  const isDropdown = variant === "dropdown";

  return (
    <ul className={isDrawer ? "divide-y divide-white/10" : isDropdown ? "space-y-1" : "flex items-center gap-2"}>
      {items.map((item) => {
        const itemKey = `${item.label}-${item.url}`;
        const hasChildren = item.children.length > 0;
        const isOpen = Boolean(openItems[itemKey]);
        const itemClassName = isDrawer
          ? "flex min-h-[3.25rem] w-full items-center justify-between px-0 py-4 text-left text-base font-bold text-blue-50 transition hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
          : isDropdown
            ? "flex min-h-10 items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
            : "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-black text-white transition-colors hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300";

        return (
          <li key={itemKey} className="group relative">
            {isDrawer && hasChildren ? (
              <button
                className={itemClassName}
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenItems((currentItems) => ({
                    ...currentItems,
                    [itemKey]: !currentItems[itemKey],
                  }))
                }
              >
                {item.label}
                <span
                  className={`ml-2 text-yellow-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <ChevronIcon />
                </span>
              </button>
            ) : (
              <a
                className={itemClassName}
                href={item.url}
                target={item.target === "_blank" ? "_blank" : undefined}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                onClick={onNavigate}
              >
                {item.label}
                {hasChildren ? (
                  <span className="ml-2 text-yellow-300" aria-hidden="true">
                    <ChevronIcon />
                  </span>
                ) : null}
              </a>
            )}
            {hasChildren && (!isDrawer || isOpen) ? (
              <div
                className={
                  isDrawer
                    ? "border-l border-white/10 pb-3 pl-4"
                    : isDropdown
                      ? "ml-3 border-l border-slate-200 pl-2"
                      : "invisible absolute left-0 top-full z-40 min-w-60 translate-y-2 rounded-2xl border border-slate-100 bg-white p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                }
              >
                <MenuItems
                  items={item.children}
                  variant={isDrawer ? "drawer" : "dropdown"}
                  onNavigate={onNavigate}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function MenuIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
