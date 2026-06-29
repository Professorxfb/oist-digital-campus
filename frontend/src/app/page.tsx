import type { Metadata } from "next";
import { resolveCmsAssetUrl } from "@/lib/api-client";
import {
  getDepartments,
  getDownloads,
  getEvents,
  getFacultyProfiles,
  getGalleryAlbums,
  getHomepageSections,
  getMenuByLocation,
  getNewsPosts,
  getNotices,
  getSiteSettings,
} from "@/services/cms";
import type {
  Event,
  GalleryAlbum,
  HomepageSection,
  MenuItem,
} from "@/types/cms";

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
  const [
    siteSettings,
    homepageSections,
    headerMenu,
    notices,
    newsPosts,
    events,
    galleryAlbums,
    downloads,
    departments,
    facultyProfiles,
  ] = await Promise.all([
    getSiteSettings(),
    getHomepageSections(),
    getMenuByLocation("header"),
    getNotices(),
    getNewsPosts(),
    getEvents(),
    getGalleryAlbums(),
    getDownloads(),
    getDepartments(),
    getFacultyProfiles(),
  ]);

  const settings = siteSettings.data;
  const displayTitle =
    settings.site_title ?? settings.institute_name ?? "Campus website";
  const hasCmsWarning = [
    siteSettings,
    homepageSections,
    headerMenu,
    notices,
    newsPosts,
    events,
    galleryAlbums,
    downloads,
    departments,
    facultyProfiles,
  ].some((result) => result.error !== null);

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

        <PreviewSection
          title="Homepage sections"
          description="Enabled sections are rendered in the order returned by the CMS API."
          emptyMessage="No enabled homepage sections were returned by the CMS API."
        >
          {homepageSections.data.map((section) => (
            <HomepageSectionPreview key={section.key} section={section} />
          ))}
        </PreviewSection>

        <PreviewSection
          title="Latest Notices"
          emptyMessage="No published notices were returned by the CMS API."
        >
          {notices.data.map((notice) => (
            <PreviewCard
              key={notice.slug}
              title={notice.title}
              description={notice.category ?? notice.audience ?? null}
              meta={[
                notice.is_pinned ? "Pinned" : null,
                formatDate(notice.published_at),
              ]}
              href={`/notices/${notice.slug}`}
            />
          ))}
        </PreviewSection>

        <PreviewSection
          title="Latest News"
          emptyMessage="No published news posts were returned by the CMS API."
        >
          {newsPosts.data.map((post) => (
            <PreviewCard
              key={post.slug}
              title={post.title}
              description={post.excerpt ?? post.category ?? null}
              meta={[
                post.is_featured ? "Featured" : null,
                post.author_name ?? null,
                formatDate(post.published_at),
              ]}
              mediaPath={post.featured_image_path ?? null}
              href={`/news/${post.slug}`}
            />
          ))}
        </PreviewSection>

        <PreviewSection
          title="Upcoming Events"
          emptyMessage="No published events were returned by the CMS API."
        >
          {events.data.map((event) => (
            <PreviewCard
              key={event.slug}
              title={event.title}
              description={event.excerpt ?? event.location ?? null}
              meta={[
                event.is_featured ? "Featured" : null,
                formatDate(event.event_date),
                formatTimeRange(event),
              ]}
              mediaPath={event.featured_image_path ?? null}
              href={`/events/${event.slug}`}
            />
          ))}
        </PreviewSection>

        <PreviewSection
          title="Departments"
          emptyMessage="No published departments were returned by the CMS API."
        >
          {departments.data.map((department) => (
            <PreviewCard
              key={department.slug}
              title={department.name}
              description={department.short_description ?? null}
              meta={[department.icon ?? null]}
              mediaPath={department.featured_image_path ?? null}
              href={`/departments/${department.slug}`}
            />
          ))}
        </PreviewSection>

        <PreviewSection
          title="Faculty Profiles"
          emptyMessage="No published faculty profiles were returned by the CMS API."
        >
          {facultyProfiles.data.map((profile) => (
            <PreviewCard
              key={profile.slug}
              title={profile.name}
              description={profile.short_bio ?? null}
              meta={[
                profile.designation ?? null,
                profile.department?.name ?? null,
                profile.email ?? null,
              ]}
              mediaPath={profile.photo_path ?? null}
              href={`/faculty/${profile.slug}`}
            />
          ))}
        </PreviewSection>

        <PreviewSection
          title="Downloads"
          emptyMessage="No published downloads were returned by the CMS API."
        >
          {downloads.data.map((download) => (
            <PreviewCard
              key={download.slug}
              title={download.title}
              description={download.description ?? null}
              meta={[download.category ?? null]}
              assetPath={download.file_path}
            />
          ))}
        </PreviewSection>

        <PreviewSection
          title="Gallery Albums"
          emptyMessage="No published gallery albums were returned by the CMS API."
        >
          {galleryAlbums.data.map((album) => (
            <PreviewCard
              key={album.slug}
              title={album.title}
              description={album.description ?? null}
              meta={[getGalleryItemCount(album)]}
              mediaPath={album.cover_image_path ?? null}
              href={`/gallery/${album.slug}`}
            />
          ))}
        </PreviewSection>
      </div>
    </main>
  );
}

function PreviewSection({
  title,
  description,
  emptyMessage,
  children,
}: {
  title: string;
  description?: string;
  emptyMessage: string;
  children: React.ReactNode[];
}) {
  return (
    <section aria-labelledby={slugify(title)} className="space-y-4">
      <div>
        <h2 id={slugify(title)} className="text-xl font-semibold">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-foreground/60">{description}</p>
        ) : null}
      </div>

      {children.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">{children}</div>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </section>
  );
}

function PreviewCard({
  title,
  description,
  meta,
  mediaPath,
  assetPath,
  href,
}: {
  title: string;
  description?: string | null;
  meta?: Array<string | null | undefined>;
  mediaPath?: string | null;
  assetPath?: string | null;
  href?: string;
}) {
  const mediaUrl = resolveCmsAssetUrl(mediaPath ?? null);
  const assetUrl = resolveCmsAssetUrl(assetPath ?? null);
  const visibleMeta = (meta ?? []).filter(Boolean);

  return (
    <article className="border border-foreground/10 p-5">
      <h3 className="text-base font-semibold">{title}</h3>

      {description ? (
        <p className="mt-2 text-sm leading-6 text-foreground/70">
          {description}
        </p>
      ) : null}

      {visibleMeta.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-foreground/55">
          {visibleMeta.map((item) => (
            <li key={item} className="border border-foreground/10 px-2 py-1">
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {href ? (
          <a className="border border-foreground/20 px-3 py-2" href={href}>
            View preview route
          </a>
        ) : null}

        {mediaUrl ? (
          <a
            className="border border-foreground/20 px-3 py-2"
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View media
          </a>
        ) : null}

        {assetUrl ? (
          <a
            className="border border-foreground/20 px-3 py-2"
            href={assetUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View file
          </a>
        ) : null}
      </div>
    </article>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-foreground/20 p-5 text-sm text-foreground/60">
      {message}
    </div>
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

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {imageUrl ? (
          <a
            className="border border-foreground/20 px-3 py-2"
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View section image
          </a>
        ) : null}

        {videoUrl ? (
          <a
            className="border border-foreground/20 px-3 py-2"
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View section video
          </a>
        ) : null}

        {section.button_text && section.button_url ? (
          <a
            className="border border-foreground/20 px-3 py-2"
            href={section.button_url}
          >
            {section.button_text}
          </a>
        ) : null}
      </div>
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

function formatDate(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function formatTimeRange(event: Event): string | null {
  if (!event.start_time && !event.end_time) {
    return null;
  }

  return [event.start_time, event.end_time].filter(Boolean).join(" - ");
}

function getGalleryItemCount(album: GalleryAlbum): string | null {
  if (!album.items) {
    return null;
  }

  return `${album.items.length} items`;
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
