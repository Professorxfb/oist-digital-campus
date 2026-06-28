import type { Metadata } from "next";
import { resolveCmsAssetUrl } from "@/lib/api-client";
import {
  getHomepageSections,
  getMenuByLocation,
  getSiteSettings,
} from "@/services/cms";
import type { HomepageSection, MenuItem } from "@/types/cms";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await getSiteSettings();
  const title =
    settings.meta_title ??
    settings.site_title ??
    settings.institute_name ??
    "Campus Website";
  const description =
    settings.meta_description ??
    settings.site_tagline ??
    "CMS-managed public website preview.";
  const faviconUrl = resolveCmsAssetUrl(settings.favicon_path);

  return {
    title,
    description,
    icons: faviconUrl
      ? {
          icon: faviconUrl,
        }
      : undefined,
  };
}

export default async function Home() {
  const [siteSettings, homepageSections, headerMenu] = await Promise.all([
    getSiteSettings(),
    getHomepageSections(),
    getMenuByLocation("header"),
  ]);

  const settings = siteSettings.data;
  const displayTitle =
    settings.site_title ?? settings.institute_name ?? "Campus website";
  const hasCmsWarning =
    siteSettings.error !== null ||
    homepageSections.error !== null ||
    headerMenu.error !== null;

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="border-b border-foreground/10 pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wide text-foreground/60">
                Development preview
              </p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                {displayTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-foreground/70">
                {settings.site_tagline ??
                  "CMS-controlled content will appear here when available."}
              </p>
            </div>

            {headerMenu.data.items.length > 0 ? (
              <nav aria-label="Header menu preview">
                <MenuList items={headerMenu.data.items} />
              </nav>
            ) : null}
          </div>
        </header>

        <section
          aria-live="polite"
          className="border border-foreground/10 p-4 text-sm text-foreground/70"
        >
          {hasCmsWarning
            ? "Using safe fallback content because one or more CMS API requests could not be completed."
            : "CMS API connection ready. Rendering public content returned by the backend."}
        </section>

        <section aria-labelledby="homepage-sections" className="space-y-4">
          <div>
            <h2 id="homepage-sections" className="text-xl font-semibold">
              Homepage sections
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Enabled sections are rendered in the order returned by the CMS API.
            </p>
          </div>

          {homepageSections.data.length > 0 ? (
            <div className="grid gap-4">
              {homepageSections.data.map((section) => (
                <HomepageSectionPreview key={section.key} section={section} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-foreground/20 p-5 text-sm text-foreground/60">
              No enabled homepage sections were returned by the CMS API.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function HomepageSectionPreview({ section }: { section: HomepageSection }) {
  const imageUrl = resolveCmsAssetUrl(section.image_path);
  const videoUrl = resolveCmsAssetUrl(section.video_path);

  return (
    <article className="border border-foreground/10 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
            {section.key}
          </p>
          <h3 className="mt-2 text-lg font-semibold">
            {section.title ?? section.key}
          </h3>
          {section.subtitle ? (
            <p className="mt-2 text-sm text-foreground/70">{section.subtitle}</p>
          ) : null}
          {section.content ? (
            <p className="mt-3 text-sm leading-6 text-foreground/70">
              {section.content}
            </p>
          ) : null}
        </div>

        <p className="text-sm text-foreground/50">Order {section.sort_order}</p>
      </div>

      {imageUrl ? (
        <a
          className="mt-4 inline-flex border border-foreground/20 px-3 py-2 text-sm"
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View section image
        </a>
      ) : null}

      {videoUrl ? (
        <video className="mt-4 w-full" controls preload="metadata">
          <source src={videoUrl} />
        </video>
      ) : null}

      {section.button_text && section.button_url ? (
        <a
          className="mt-4 inline-flex border border-foreground/20 px-4 py-2 text-sm font-medium"
          href={section.button_url}
        >
          {section.button_text}
        </a>
      ) : null}
    </article>
  );
}

function MenuList({ items }: { items: MenuItem[] }) {
  return (
    <ul className="flex flex-wrap gap-3 text-sm">
      {items.map((item) => (
        <li key={`${item.label}-${item.url}`} className="space-y-2">
          <a
            className="inline-flex border border-foreground/15 px-3 py-2"
            href={item.url}
            target={item.target === "_blank" ? "_blank" : undefined}
            rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
          >
            {item.label}
          </a>
          {item.children.length > 0 ? <MenuList items={item.children} /> : null}
        </li>
      ))}
    </ul>
  );
}
