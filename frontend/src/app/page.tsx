import type { Metadata } from "next";
import { CMSHero } from "@/components/public-site/CMSHero";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { CTAButton } from "@/components/public-site/CTAButton";
import { DepartmentCard } from "@/components/public-site/DepartmentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { EventCard } from "@/components/public-site/EventCard";
import { FacultyCard } from "@/components/public-site/FacultyCard";
import { NoticeStrip } from "@/components/public-site/NoticeStrip";
import { SectionHeader } from "@/components/public-site/SectionHeader";
import { SiteFooter } from "@/components/public-site/SiteFooter";
import { SiteHeader } from "@/components/public-site/SiteHeader";
import { resolveCmsAssetUrl } from "@/lib/api-client";
import { findHomepageSection, formatDate, getTextPreview } from "@/lib/cms-display";
import {
  getDepartments,
  getDownloads,
  getEvents,
  getFacilities,
  getFacultyProfiles,
  getGalleryAlbums,
  getHomepageSections,
  getLeadershipProfiles,
  getMenuByLocation,
  getNewsPosts,
  getNotices,
  getScholarships,
  getSiteSettings,
  getVideos,
} from "@/services/cms";
import type {
  Download,
  Facility,
  GalleryAlbum,
  HomepageSection,
  LeadershipProfile,
  NewsPost,
  Notice,
  Scholarship,
  SiteSetting,
  Video,
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
    "CMS-managed public website.";
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
    footerMenu,
    quickLinks,
    notices,
    newsPosts,
    events,
    galleryAlbums,
    downloads,
    departments,
    facultyProfiles,
    scholarships,
    facilities,
    leadershipProfiles,
    videos,
  ] = await Promise.all([
    getSiteSettings(),
    getHomepageSections(),
    getMenuByLocation("header"),
    getMenuByLocation("footer"),
    getMenuByLocation("quick_links"),
    getNotices(),
    getNewsPosts(),
    getEvents(),
    getGalleryAlbums(),
    getDownloads(),
    getDepartments(),
    getFacultyProfiles(),
    getScholarships(),
    getFacilities(),
    getLeadershipProfiles(),
    getVideos(),
  ]);

  const settings = siteSettings.data;
  const heroSection = findHomepageSection(homepageSections.data, "hero");
  const nonHeroSections = homepageSections.data.filter((section) => section.key !== "hero");
  const hasCmsWarning = [
    siteSettings,
    homepageSections,
    headerMenu,
    footerMenu,
    quickLinks,
    notices,
    newsPosts,
    events,
    galleryAlbums,
    downloads,
    departments,
    facultyProfiles,
    scholarships,
    facilities,
    leadershipProfiles,
    videos,
  ].some((result) => result.error !== null);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc,#eef6ff_42%,#f8fafc)] text-slate-950">
      <SiteHeader settings={settings} menuItems={headerMenu.data.items} />
      <NoticeStrip notices={notices.data} />
      <main>
        <CMSHero heroSection={heroSection} settings={settings} />

        {hasCmsWarning ? (
          <Container className="pt-8">
            <div className="rounded-lg border border-amber-200 bg-amber-50/90 p-4 text-sm font-medium text-amber-900 shadow-sm">
              Some public content is temporarily unavailable. Published content will appear when the CMS connection is ready.
            </div>
          </Container>
        ) : null}

        <AdmissionCTA settings={settings} />

        {nonHeroSections.length > 0 ? (
          <section className="py-14 sm:py-20">
            <SectionHeader
              eyebrow="Homepage"
              title="Featured Sections"
              description="Visible homepage sections are controlled by the CMS."
            />
            <Container>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {nonHeroSections.map((section) => (
                  <HomepageSectionCard key={section.key} section={section} />
                ))}
              </div>
            </Container>
          </section>
        ) : (
          <ShellSection title="Featured Homepage Sections">
            <EmptyState />
          </ShellSection>
        )}

        <ShellSection title="Latest Notices" eyebrow="Updates" actionHref="/notices">
          {notices.data.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {notices.data.slice(0, 3).map((notice) => (
                <NoticeCard key={notice.slug} notice={notice} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ShellSection>

        <ShellSection title="News Preview" eyebrow="Stories" actionHref="/news" tone="white">
          {newsPosts.data.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {newsPosts.data.slice(0, 3).map((post) => (
                <NewsCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ShellSection>

        <ShellSection title="Events Preview" eyebrow="Calendar" actionHref="/events">
          {events.data.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {events.data.slice(0, 3).map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ShellSection>

        <ShellSection title="Departments" eyebrow="Academics" actionHref="/departments" tone="white">
          {departments.data.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {departments.data.slice(0, 6).map((department) => (
                <DepartmentCard key={department.slug} department={department} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ShellSection>

        {scholarships.data.length > 0 ? (
          <ShellSection
            title="Scholarships"
            eyebrow="Support"
            actionHref="/scholarships"
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {scholarships.data.slice(0, 3).map((scholarship) => (
                <ScholarshipCard key={scholarship.slug} scholarship={scholarship} />
              ))}
            </div>
          </ShellSection>
        ) : null}

        {facilities.data.length > 0 ? (
          <ShellSection
            title="Facilities"
            eyebrow="Campus"
            actionHref="/facilities"
            tone="white"
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {facilities.data.slice(0, 3).map((facility) => (
                <FacilityCard key={facility.slug} facility={facility} />
              ))}
            </div>
          </ShellSection>
        ) : null}

        <ShellSection title="Faculty Profiles" eyebrow="People" actionHref="/faculty">
          {facultyProfiles.data.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {facultyProfiles.data.slice(0, 4).map((profile) => (
                <FacultyCard key={profile.slug} profile={profile} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ShellSection>

        {leadershipProfiles.data.length > 0 ? (
          <ShellSection
            title="Leadership"
            eyebrow="Profiles"
            actionHref="/leadership"
            tone="white"
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {leadershipProfiles.data.slice(0, 3).map((profile) => (
                <LeadershipCard key={profile.slug} profile={profile} />
              ))}
            </div>
          </ShellSection>
        ) : null}

        <ShellSection title="Downloads" eyebrow="Resources" actionHref="/downloads" tone="white">
          {downloads.data.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {downloads.data.slice(0, 6).map((download) => (
                <DownloadCard key={download.slug} download={download} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ShellSection>

        {videos.data.length > 0 ? (
          <ShellSection title="Videos" eyebrow="Media" actionHref="/videos">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {videos.data.slice(0, 3).map((video) => (
                <VideoCard key={video.slug} video={video} />
              ))}
            </div>
          </ShellSection>
        ) : null}

        <ShellSection title="Gallery Albums" eyebrow="Media" actionHref="/gallery">
          {galleryAlbums.data.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {galleryAlbums.data.slice(0, 3).map((album) => (
                <GalleryCard key={album.slug} album={album} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </ShellSection>
      </main>
      <SiteFooter
        settings={settings}
        footerMenuItems={footerMenu.data.items}
        quickLinks={quickLinks.data.items}
      />
    </div>
  );
}

function ShellSection({
  title,
  eyebrow,
  actionHref,
  actionLabel = "View all",
  tone = "soft",
  children,
}: Readonly<{
  title: string;
  eyebrow?: string;
  actionHref?: string;
  actionLabel?: string;
  tone?: "soft" | "white";
  children: React.ReactNode;
}>) {
  return (
    <section className={`py-14 sm:py-16 ${tone === "white" ? "bg-white" : ""}`}>
      <Container className="mb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {title}
            </h2>
          </div>
          {actionHref ? (
            <CTAButton href={actionHref} variant="secondary" className="self-start sm:self-auto">
              {actionLabel}
            </CTAButton>
          ) : null}
        </div>
      </Container>
      <Container>{children}</Container>
    </section>
  );
}

function AdmissionCTA({ settings }: Readonly<{ settings: SiteSetting }>) {
  const hasAdmissionCta = Boolean(settings.admission_cta_text && settings.admission_cta_url);
  const admissionCtaUrl = settings.admission_cta_url ?? "";

  return (
    <section className="border-y border-slate-200 bg-white py-10">
      <Container>
        <div className="grid gap-6 overflow-hidden rounded-lg border border-blue-100 bg-[linear-gradient(135deg,#eff6ff,#f8fafc_48%,#ecfeff)] p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Admission
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {settings.is_admission_open
                ? "Admission information is available"
                : "Admission information"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {hasAdmissionCta
                ? "Admission call-to-action content is managed from the CMS."
                : "Admission call-to-action content will appear here when published from the CMS."}
            </p>
          </div>
          {hasAdmissionCta ? (
            <CTAButton href={admissionCtaUrl}>
              {settings.admission_cta_text}
            </CTAButton>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function HomepageSectionCard({ section }: Readonly<{ section: HomepageSection }>) {
  return (
    <ContentCard
      title={section.title ?? section.key}
      description={section.subtitle ?? getTextPreview(section.content)}
      imagePath={section.image_path}
      href={section.button_url ?? undefined}
      actionLabel={section.button_text ?? "View"}
      meta={[`Order ${section.sort_order}`]}
    />
  );
}

function NoticeCard({ notice }: Readonly<{ notice: Notice }>) {
  return (
    <article className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
      <div className="flex flex-wrap gap-2 text-xs font-semibold text-blue-700">
        {notice.is_pinned ? <span className="rounded-full bg-blue-50 px-2.5 py-1 ring-1 ring-blue-100">Pinned</span> : null}
        {notice.category ? <span className="rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200">{notice.category}</span> : null}
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        <a href={`/notices/${notice.slug}`} className="transition group-hover:text-blue-800">
          {notice.title}
        </a>
      </h3>
      {notice.body ? (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {getTextPreview(notice.body, 120)}
        </p>
      ) : null}
      {notice.published_at ? (
        <p className="mt-3 text-sm text-slate-500">{formatDate(notice.published_at)}</p>
      ) : null}
    </article>
  );
}

function NewsCard({ post }: Readonly<{ post: NewsPost }>) {
  return (
    <ContentCard
      title={post.title}
      description={post.excerpt ?? post.category}
      imagePath={post.featured_image_path ?? null}
      href={`/news/${post.slug}`}
      meta={[post.is_featured ? "Featured" : null, post.category, formatDate(post.published_at)]}
    />
  );
}

function DownloadCard({ download }: Readonly<{ download: Download }>) {
  return (
    <ContentCard
      title={download.title}
      description={download.description}
      filePath={download.file_path}
      meta={[download.category]}
    />
  );
}

function GalleryCard({ album }: Readonly<{ album: GalleryAlbum }>) {
  const itemCount = album.items ? `${album.items.length} items` : null;

  return (
    <ContentCard
      title={album.title}
      description={album.description}
      imagePath={album.cover_image_path ?? null}
      href={`/gallery/${album.slug}`}
      meta={[itemCount]}
    />
  );
}

function ScholarshipCard({
  scholarship,
}: Readonly<{
  scholarship: Scholarship;
}>) {
  return (
    <ContentCard
      title={scholarship.title}
      description={scholarship.summary ?? getTextPreview(scholarship.description)}
      href={`/scholarships/${scholarship.slug}`}
      meta={[
        scholarship.is_featured ? "Featured" : null,
        scholarship.deadline ? formatDate(scholarship.deadline) : null,
      ]}
    />
  );
}

function FacilityCard({ facility }: Readonly<{ facility: Facility }>) {
  return (
    <ContentCard
      title={facility.title}
      description={facility.summary}
      imagePath={facility.image_path ?? null}
      href={`/facilities/${facility.slug}`}
      meta={[facility.icon]}
    />
  );
}

function LeadershipCard({
  profile,
}: Readonly<{
  profile: LeadershipProfile;
}>) {
  return (
    <ContentCard
      title={profile.name}
      description={profile.short_bio ?? profile.designation}
      imagePath={profile.photo_path ?? null}
      href={`/leadership/${profile.slug}`}
      meta={[profile.designation]}
    />
  );
}

function VideoCard({ video }: Readonly<{ video: Video }>) {
  return (
    <ContentCard
      title={video.title}
      description={video.excerpt}
      imagePath={video.thumbnail_path ?? null}
      href={`/videos/${video.slug}`}
      meta={[
        video.is_featured ? "Featured" : null,
        video.category,
        formatDate(video.published_at ?? video.event_date),
      ]}
    />
  );
}
