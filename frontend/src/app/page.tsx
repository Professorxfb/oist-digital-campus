import type { Metadata } from "next";
import { CMSHero } from "@/components/public-site/CMSHero";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { CTAButton } from "@/components/public-site/CTAButton";
import { DepartmentCard } from "@/components/public-site/DepartmentCard";
import { EventCard } from "@/components/public-site/EventCard";
import { NoticeStrip } from "@/components/public-site/NoticeStrip";
import { SiteFooter } from "@/components/public-site/SiteFooter";
import { SiteHeader } from "@/components/public-site/SiteHeader";
import { resolveCmsAssetUrl } from "@/lib/api-client";
import { findHomepageSection, formatDate, getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import {
  getDepartments,
  getEvents,
  getFacilities,
  getGalleryAlbums,
  getHomepageSections,
  getInstitutionalPageByType,
  getLeadershipProfiles,
  getMenuByLocation,
  getNewsPosts,
  getNotices,
  getScholarships,
  getSiteSettings,
  getVideos,
} from "@/services/cms";
import type {
  Event,
  Facility,
  GalleryAlbum,
  HomepageSection,
  LeadershipProfile,
  NewsPost,
  Notice,
  Scholarship,
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
    departments,
    scholarships,
    facilities,
    leadershipProfiles,
    videos,
    aboutPage,
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
    getDepartments(),
    getScholarships(),
    getFacilities(),
    getLeadershipProfiles(),
    getVideos(),
    getInstitutionalPageByType("about"),
  ]);

  const settings = siteSettings.data;
  const heroSection = findHomepageSection(homepageSections.data, "hero");
  const heroFeatureSections = getHeroFeatureSections(homepageSections.data);
  const chairmanProfile = getChairmanProfile(leadershipProfiles.data);
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
    departments,
    scholarships,
    facilities,
    leadershipProfiles,
    videos,
    aboutPage,
  ].some((result) => result.error !== null);

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <SiteHeader settings={settings} menuItems={headerMenu.data.items} />
      <NoticeStrip notices={notices.data} />
      <main>
        <CMSHero heroSection={heroSection} settings={settings} />
        {heroFeatureSections.length > 0 ? (
          <HeroFeatureCards sections={heroFeatureSections} />
        ) : null}

        {hasCmsWarning ? (
          <Container className="pt-8">
            <div className="rounded-2xl border border-yellow-300/60 bg-yellow-50 p-4 text-sm font-semibold text-yellow-950 shadow-sm">
              Some public content is temporarily unavailable. Published CMS content will appear when the connection is ready.
            </div>
          </Container>
        ) : null}

        {aboutPage.data ? <AboutSection page={aboutPage.data} /> : null}

        {notices.data.length > 0 ? (
          <LatestNoticesSection notices={notices.data} />
        ) : null}

        {departments.data.length > 0 ? (
          <PremiumSection
            eyebrow="Academics"
            title="Departments"
            actionHref="/departments"
            tone="cream"
          >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {departments.data.slice(0, 6).map((department) => (
                <DepartmentCard key={department.slug} department={department} />
              ))}
            </div>
          </PremiumSection>
        ) : null}

        {chairmanProfile ? (
          <ChairmanMessageSection profile={chairmanProfile} />
        ) : null}

        {scholarships.data.length > 0 || facilities.data.length > 0 ? (
          <ScholarshipsFacilitiesSection
            scholarships={scholarships.data}
            facilities={facilities.data}
          />
        ) : null}

        {videos.data.length > 0 ? <VideoShowcase videos={videos.data} /> : null}

        {newsPosts.data.length > 0 || events.data.length > 0 ? (
          <NewsEventsSection newsPosts={newsPosts.data} events={events.data} />
        ) : null}

        {galleryAlbums.data.length > 0 ? (
          <PremiumSection
            eyebrow="Campus Life"
            title="Gallery"
            actionHref="/gallery"
            tone="cream"
          >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {galleryAlbums.data.slice(0, 3).map((album) => (
                <GalleryCard key={album.slug} album={album} />
              ))}
            </div>
          </PremiumSection>
        ) : null}
      </main>
      <SiteFooter
        settings={settings}
        footerMenuItems={footerMenu.data.items}
        quickLinks={quickLinks.data.items}
      />
    </div>
  );
}

function PremiumSection({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel = "View All",
  tone = "white",
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description?: string | null;
  actionHref?: string;
  actionLabel?: string;
  tone?: "white" | "cream" | "navy";
  children: React.ReactNode;
}>) {
  const toneClassName = {
    white: "bg-white",
    cream: "bg-[#f7f3ea]",
    navy: "bg-[#071733] text-white",
  }[tone];
  const titleClassName = tone === "navy" ? "text-white" : "text-slate-950";
  const descriptionClassName = tone === "navy" ? "text-blue-100" : "text-slate-600";

  return (
    <section className={`py-16 sm:py-20 ${toneClassName}`}>
      <Container>
        <div className="mb-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
              {eyebrow}
            </p>
            <h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-5xl ${titleClassName}`}>
              {title}
            </h2>
            {description ? (
              <p className={`mt-4 text-base leading-7 ${descriptionClassName}`}>
                {description}
              </p>
            ) : null}
          </div>
          {actionHref ? (
            <CTAButton
              href={actionHref}
              variant={tone === "navy" ? "primary" : "subtle"}
              className="self-start sm:self-auto"
            >
              {actionLabel}
            </CTAButton>
          ) : null}
        </div>
        {children}
      </Container>
    </section>
  );
}

function HeroFeatureCards({
  sections,
}: Readonly<{
  sections: HomepageSection[];
}>) {
  return (
    <Container className="relative z-10 -mt-10">
      <div className="grid overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl shadow-slate-950/10 md:grid-cols-3">
        {sections.slice(0, 3).map((section) => (
          <article
            key={section.key}
            className="border-b border-slate-100 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
          >
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
              {section.subtitle ?? section.key.replaceAll("_", " ")}
            </p>
            {section.title ? (
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                {section.title}
              </h2>
            ) : null}
            {section.content ? (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {getTextPreview(section.content, 110)}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </Container>
  );
}

function AboutSection({
  page,
}: Readonly<{
  page: {
    title: string;
    excerpt?: string | null;
    body?: string | null;
    featured_image_path?: string | null;
  };
}>) {
  const imageUrl = getCmsAssetUrl(page.featured_image_path ?? null);
  const description = page.excerpt ?? getTextPreview(page.body, 260);

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-[#071733] shadow-2xl shadow-slate-950/10">
            {imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.24),transparent_28%),linear-gradient(135deg,#071733,#1d4ed8_62%,#082f49)]"
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.28))]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
              Institution
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {page.title}
            </h2>
            {description ? (
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                {description}
              </p>
            ) : null}
            <div className="mt-8">
              <CTAButton href="/about" variant="subtle">
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function LatestNoticesSection({ notices }: Readonly<{ notices: Notice[] }>) {
  const pinnedNotice = notices.find((notice) => notice.is_pinned) ?? null;
  const recentNotices = notices
    .filter((notice) => notice.slug !== pinnedNotice?.slug)
    .slice(0, pinnedNotice ? 4 : 5);

  return (
    <PremiumSection
      eyebrow="Updates"
      title="Latest Notices"
      description="Published notices from the CMS appear here."
      actionHref="/notices"
      tone="navy"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {pinnedNotice ? <PinnedNoticeCard notice={pinnedNotice} /> : null}
        <div className="grid gap-4">
          {(pinnedNotice ? recentNotices : notices.slice(0, 5)).map((notice) => (
            <NoticeListCard key={notice.slug} notice={notice} />
          ))}
        </div>
      </div>
    </PremiumSection>
  );
}

function PinnedNoticeCard({ notice }: Readonly<{ notice: Notice }>) {
  return (
    <article className="rounded-3xl border border-yellow-300/30 bg-white p-7 text-slate-950 shadow-2xl shadow-slate-950/20">
      <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
        Pinned
      </span>
      <h3 className="mt-5 text-2xl font-black tracking-tight">
        <a href={`/notices/${notice.slug}`} className="transition hover:text-blue-800">
          {notice.title}
        </a>
      </h3>
      {notice.body ? (
        <p className="mt-4 text-sm leading-7 text-slate-600">
          {getTextPreview(notice.body, 180)}
        </p>
      ) : null}
      <NoticeMeta notice={notice} className="mt-5 text-slate-500" />
      <div className="mt-6">
        <CTAButton href={`/notices/${notice.slug}`} variant="subtle">
          Read Notice
        </CTAButton>
      </div>
    </article>
  );
}

function NoticeListCard({ notice }: Readonly<{ notice: Notice }>) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/10 p-5 transition hover:border-yellow-300/40 hover:bg-white/15">
      <NoticeMeta notice={notice} className="text-blue-100" />
      <h3 className="mt-3 text-lg font-black tracking-tight text-white">
        <a href={`/notices/${notice.slug}`} className="transition hover:text-yellow-300">
          {notice.title}
        </a>
      </h3>
      {notice.body ? (
        <p className="mt-2 text-sm leading-6 text-blue-100">
          {getTextPreview(notice.body, 110)}
        </p>
      ) : null}
    </article>
  );
}

function NoticeMeta({
  notice,
  className = "",
}: Readonly<{
  notice: Notice;
  className?: string;
}>) {
  const values = [
    formatDate(notice.published_at),
    notice.category,
    notice.audience,
    notice.is_pinned ? "Pinned" : null,
  ].filter(Boolean);

  if (values.length === 0) {
    return null;
  }

  return (
    <p className={`text-xs font-bold uppercase tracking-[0.14em] ${className}`}>
      {values.join(" / ")}
    </p>
  );
}

function ChairmanMessageSection({
  profile,
}: Readonly<{
  profile: LeadershipProfile;
}>) {
  const photoUrl = getCmsAssetUrl(profile.photo_path ?? null);
  const message = getTextPreview(profile.message ?? profile.short_bio, 260);

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-[#071733] shadow-2xl shadow-slate-950/10 lg:grid lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-[320px] bg-blue-950">
            {photoUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${photoUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_34%_24%,rgba(250,204,21,0.24),transparent_30%),linear-gradient(135deg,#0f172a,#1d4ed8_65%,#082f49)]"
                aria-hidden="true"
              />
            )}
          </div>
          <div className="p-7 text-white sm:p-10 lg:p-12">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
              Chairman Message
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              {profile.name}
            </h2>
            {profile.designation ? (
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-100">
                {profile.designation}
              </p>
            ) : null}
            {message ? (
              <p className="mt-6 text-base leading-8 text-blue-50">{message}</p>
            ) : null}
            <div className="mt-8">
              <CTAButton href={`/leadership/${profile.slug}`}>
                Read Message
              </CTAButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ScholarshipsFacilitiesSection({
  scholarships,
  facilities,
}: Readonly<{
  scholarships: Scholarship[];
  facilities: Facility[];
}>) {
  return (
    <PremiumSection
      eyebrow="Campus Resources"
      title="Scholarships And Facilities"
      tone="cream"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {scholarships.length > 0 ? (
          <div className="space-y-4">
            <SectionMiniHeader title="Scholarships" href="/scholarships" />
            {scholarships.slice(0, 3).map((scholarship) => (
              <ContentCard
                key={scholarship.slug}
                title={scholarship.title}
                description={scholarship.summary ?? getTextPreview(scholarship.description)}
                href={`/scholarships/${scholarship.slug}`}
                meta={[
                  scholarship.is_featured ? "Featured" : null,
                  scholarship.deadline ? formatDate(scholarship.deadline) : null,
                ]}
                media="none"
              />
            ))}
          </div>
        ) : null}
        {facilities.length > 0 ? (
          <div className="space-y-4">
            <SectionMiniHeader title="Facilities" href="/facilities" />
            {facilities.slice(0, 3).map((facility) => (
              <ContentCard
                key={facility.slug}
                title={facility.title}
                description={facility.summary}
                imagePath={facility.image_path ?? null}
                href={`/facilities/${facility.slug}`}
                meta={[facility.icon]}
              />
            ))}
          </div>
        ) : null}
      </div>
    </PremiumSection>
  );
}

function SectionMiniHeader({
  title,
  href,
}: Readonly<{
  title: string;
  href: string;
}>) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-2xl font-black tracking-tight text-slate-950">{title}</h3>
      <a
        className="text-sm font-black text-blue-800 underline-offset-4 hover:underline"
        href={href}
      >
        View All
      </a>
    </div>
  );
}

function VideoShowcase({ videos }: Readonly<{ videos: Video[] }>) {
  const featuredVideo = videos.find((video) => video.is_featured) ?? videos[0];
  const otherVideos = videos.filter((video) => video.slug !== featuredVideo.slug).slice(0, 3);

  return (
    <PremiumSection
      eyebrow="Video Showcase"
      title="Campus In Motion"
      actionHref="/videos"
      tone="navy"
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <VideoFeatureCard video={featuredVideo} />
        <div className="grid gap-4">
          {otherVideos.map((video) => (
            <VideoCompactCard key={video.slug} video={video} />
          ))}
        </div>
      </div>
    </PremiumSection>
  );
}

function VideoFeatureCard({ video }: Readonly<{ video: Video }>) {
  const thumbnailUrl = getCmsAssetUrl(video.thumbnail_path ?? null);

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white text-slate-950 shadow-2xl shadow-slate-950/20">
      <div
        className="aspect-video bg-cover bg-center"
        style={{
          backgroundImage: thumbnailUrl
            ? `url(${thumbnailUrl})`
            : "linear-gradient(135deg,#0f172a,#1d4ed8 56%,#facc15)",
        }}
        aria-hidden="true"
      />
      <div className="p-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
          {[video.category, formatDate(video.published_at ?? video.event_date)]
            .filter(Boolean)
            .join(" / ")}
        </p>
        <h3 className="mt-3 text-2xl font-black tracking-tight">{video.title}</h3>
        {video.excerpt ? (
          <p className="mt-3 text-sm leading-6 text-slate-600">{video.excerpt}</p>
        ) : null}
        <div className="mt-6">
          <CTAButton href={`/videos/${video.slug}`} variant="subtle">
            Watch
          </CTAButton>
        </div>
      </div>
    </article>
  );
}

function VideoCompactCard({ video }: Readonly<{ video: Video }>) {
  return (
    <ContentCard
      title={video.title}
      description={video.excerpt}
      imagePath={video.thumbnail_path ?? null}
      href={`/videos/${video.slug}`}
      actionLabel="Watch"
      meta={[video.category, formatDate(video.published_at ?? video.event_date)]}
    />
  );
}

function NewsEventsSection({
  newsPosts,
  events,
}: Readonly<{
  newsPosts: NewsPost[];
  events: Event[];
}>) {
  return (
    <PremiumSection
      eyebrow="News & Events"
      title="Stories And Calendar"
      tone="white"
    >
      <div className="grid gap-8 xl:grid-cols-2">
        {newsPosts.length > 0 ? (
          <div>
            <SectionMiniHeader title="News" href="/news" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {newsPosts.slice(0, 2).map((post) => (
                <ContentCard
                  key={post.slug}
                  title={post.title}
                  description={post.excerpt ?? getTextPreview(post.body)}
                  imagePath={post.featured_image_path ?? null}
                  href={`/news/${post.slug}`}
                  meta={[
                    post.is_featured ? "Featured" : null,
                    post.category,
                    formatDate(post.published_at),
                  ]}
                />
              ))}
            </div>
          </div>
        ) : null}
        {events.length > 0 ? (
          <div>
            <SectionMiniHeader title="Events" href="/events" />
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {events.slice(0, 2).map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </PremiumSection>
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

function getHeroFeatureSections(sections: HomepageSection[]): HomepageSection[] {
  return sections.filter((section) => {
    const key = section.key.toLowerCase();
    const hasContent = Boolean(section.title || section.subtitle || section.content);

    return (
      hasContent &&
      key !== "hero" &&
      (key.includes("feature") || key.includes("stat") || key.includes("info"))
    );
  });
}

function getChairmanProfile(profiles: LeadershipProfile[]): LeadershipProfile | null {
  return (
    profiles.find((profile) =>
      `${profile.name} ${profile.designation ?? ""}`.toLowerCase().includes("chairman"),
    ) ??
    profiles[0] ??
    null
  );
}
