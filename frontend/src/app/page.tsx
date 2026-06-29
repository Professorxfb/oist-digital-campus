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
import { formatDate, getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import {
  getDepartments,
  getEvents,
  getFacilities,
  getFacultyProfiles,
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
  FacultyProfile,
  GalleryAlbum,
  HomepageSection,
  InstitutionalPage,
  LeadershipProfile,
  NewsPost,
  Notice,
  Scholarship,
  Video,
} from "@/types/cms";

export const revalidate = 60;

type SectionBlock = {
  section: HomepageSection;
  node: React.ReactNode;
};

type NewsEventPreviewItem =
  | {
      type: "news";
      item: NewsPost;
    }
  | {
      type: "event";
      item: Event;
    };

type CampusLifePreviewItem =
  | {
      type: "gallery";
      item: GalleryAlbum;
    }
  | {
      type: "video";
      item: Video;
    };

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
    facilities,
    facultyProfiles,
    scholarships,
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
    getFacilities(),
    getFacultyProfiles(),
    getScholarships(),
    getLeadershipProfiles(),
    getVideos(),
    getInstitutionalPageByType("about"),
  ]);

  const settings = siteSettings.data;
  const sections = homepageSections.data;
  const heroSection = getHomepageSectionConfig(sections, ["hero"]);
  const noticeStripSection = getHomepageSectionConfig(sections, [
    "notice_strip",
    "top_notice",
    "notice_bar",
  ]);
  const aboutSection = getHomepageSectionConfig(sections, [
    "about",
    "about_intro",
    "institution_intro",
  ]);
  const chairmanSection = getHomepageSectionConfig(sections, [
    "chairman",
    "chairman_message",
    "leadership_message",
  ]);
  const departmentsSection = getHomepageSectionConfig(sections, [
    "departments",
    "department",
  ]);
  const noticesSection = getHomepageSectionConfig(sections, [
    "latest_notices",
    "notice_board",
    "notices",
  ]);
  const campusLifeSection = getHomepageSectionConfig(sections, [
    "campus_life",
    "gallery_campus_life",
  ]);
  const tuitionFeeSection = getHomepageSectionConfig(sections, [
    "tuition_fee",
    "tuition",
    "fees",
  ]);
  const scholarshipsSection = getHomepageSectionConfig(sections, [
    "scholarships",
    "scholarship",
  ]);
  const facilitiesSection = getHomepageSectionConfig(sections, [
    "facilities",
    "facility",
  ]);
  const professorsSection = getHomepageSectionConfig(sections, [
    "professors",
    "faculty",
    "faculty_profiles",
  ]);
  const videosSection = getHomepageSectionConfig(sections, [
    "videos",
    "video_showcase",
  ]);
  const newsEventsSection = getHomepageSectionConfig(sections, [
    "news_events",
    "news_and_events",
  ]);
  const galleryStripSection = getHomepageSectionConfig(sections, [
    "gallery_strip",
    "gallery",
  ]);

  const heroFeatureSections = getHeroFeatureSections(sections);
  const chairmanProfile = getChairmanProfile(leadershipProfiles.data);
  const feeRelatedScholarships = getFeeRelatedScholarships(scholarships.data);
  const nullableSectionBlocks: Array<SectionBlock | null> = [
    aboutSection && aboutPage.data
      ? {
          section: aboutSection,
          node: <AboutSection page={aboutPage.data} section={aboutSection} />,
        }
      : null,
    chairmanSection && chairmanProfile
      ? {
          section: chairmanSection,
          node: <ChairmanMessageSection profile={chairmanProfile} section={chairmanSection} />,
        }
      : null,
    departmentsSection && departments.data.length > 0
      ? {
          section: departmentsSection,
          node: (
            <DepartmentsSection
              departments={limitItems(departments.data, departmentsSection)}
              section={departmentsSection}
            />
          ),
        }
      : null,
    noticesSection && notices.data.length > 0
      ? {
          section: noticesSection,
          node: (
            <LatestNoticesSection
              notices={limitItems(notices.data, noticesSection)}
              section={noticesSection}
            />
          ),
        }
      : null,
    campusLifeSection && (galleryAlbums.data.length > 0 || videos.data.length > 0)
      ? {
          section: campusLifeSection,
          node: (
            <CampusLifeSection
              galleryAlbums={galleryAlbums.data}
              section={campusLifeSection}
              videos={videos.data}
            />
          ),
        }
      : null,
    tuitionFeeSection && feeRelatedScholarships.length > 0
      ? {
          section: tuitionFeeSection,
          node: (
            <TuitionFeeSection
              scholarships={limitItems(feeRelatedScholarships, tuitionFeeSection)}
              section={tuitionFeeSection}
            />
          ),
        }
      : null,
    scholarshipsSection && scholarships.data.length > 0
      ? {
          section: scholarshipsSection,
          node: (
            <ScholarshipsSection
              scholarships={limitItems(scholarships.data, scholarshipsSection)}
              section={scholarshipsSection}
            />
          ),
        }
      : null,
    facilitiesSection && facilities.data.length > 0
      ? {
          section: facilitiesSection,
          node: (
            <FacilitiesSection
              facilities={limitItems(facilities.data, facilitiesSection)}
              section={facilitiesSection}
            />
          ),
        }
      : null,
    professorsSection && facultyProfiles.data.length > 0
      ? {
          section: professorsSection,
          node: (
            <ProfessorsSection
              profiles={limitItems(facultyProfiles.data, professorsSection)}
              section={professorsSection}
            />
          ),
        }
      : null,
    videosSection && videos.data.length > 0
      ? {
          section: videosSection,
          node: (
            <VideoShowcase
              section={videosSection}
              videos={limitItems(videos.data, videosSection)}
            />
          ),
        }
      : null,
    newsEventsSection && (newsPosts.data.length > 0 || events.data.length > 0)
      ? {
          section: newsEventsSection,
          node: (
            <NewsEventsSection
              events={events.data}
              newsPosts={newsPosts.data}
              section={newsEventsSection}
            />
          ),
        }
      : null,
    galleryStripSection && galleryAlbums.data.length > 0
      ? {
          section: galleryStripSection,
          node: (
            <GalleryStripSection
              galleryAlbums={limitItems(galleryAlbums.data, galleryStripSection)}
              section={galleryStripSection}
            />
          ),
        }
      : null,
  ];
  const sectionBlocks = nullableSectionBlocks.filter(isSectionBlock).sort(sortSectionBlocks);

  return (
    <div className="min-h-screen bg-[#f7f3ea] text-slate-950">
      <SiteHeader settings={settings} menuItems={headerMenu.data.items} />
      <NoticeStrip notices={notices.data} label={noticeStripSection?.title} />
      <main>
        <CMSHero heroSection={heroSection} />
        {heroFeatureSections.length > 0 ? (
          <HeroFeatureCards sections={heroFeatureSections} />
        ) : null}

        {sectionBlocks.map((block) => (
          <div key={block.section.key}>{block.node}</div>
        ))}
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
  section,
  tone = "white",
  children,
}: Readonly<{
  section: HomepageSection;
  tone?: "white" | "cream" | "navy";
  children: React.ReactNode;
}>) {
  if (!section.title) {
    return null;
  }

  const toneClassName = {
    white: "bg-white",
    cream: "bg-[#f7f3ea]",
    navy: "bg-[#071733] text-white",
  }[tone];
  const titleClassName = tone === "navy" ? "text-white" : "text-slate-950";
  const eyebrowClassName = tone === "navy" ? "text-yellow-300" : "text-blue-800";
  const descriptionClassName = tone === "navy" ? "text-blue-100" : "text-slate-600";
  const description = getTextPreview(section.content, 260);

  return (
    <section className={`py-16 sm:py-20 ${toneClassName}`}>
      <Container>
        <div className="mb-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            {section.subtitle ? (
              <p className={`text-xs font-black uppercase tracking-[0.22em] ${eyebrowClassName}`}>
                {section.subtitle}
              </p>
            ) : null}
            <h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-5xl ${titleClassName}`}>
              {section.title}
            </h2>
            {description ? (
              <p className={`mt-4 text-base leading-7 ${descriptionClassName}`}>
                {description}
              </p>
            ) : null}
          </div>
          {section.button_text && section.button_url ? (
            <CTAButton
              href={section.button_url}
              variant={tone === "navy" ? "primary" : "subtle"}
              className="self-start sm:self-auto"
            >
              {section.button_text}
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
  const visibleSections = sections.slice(0, 3);

  return (
    <Container className="relative z-20 -mt-24 pb-8 lg:-mt-36">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
        {visibleSections.map((section, index) => {
          const iconUrl = getCmsAssetUrl(section.image_path);
          const isAccent = index === 1;

          return (
          <article
            key={section.key}
            className={`min-h-44 rounded-[10px] p-7 shadow-2xl shadow-slate-950/15 sm:p-8 ${
              isAccent ? "bg-yellow-400 text-slate-950" : "bg-[#082f57] text-white"
            }`}
          >
            <div className="flex gap-5">
              {iconUrl ? (
                <span
                  className={`h-16 w-16 shrink-0 rounded-2xl bg-contain bg-center bg-no-repeat ${
                    isAccent ? "bg-slate-950/5" : "bg-white/10"
                  }`}
                  style={{ backgroundImage: `url(${iconUrl})` }}
                  aria-hidden="true"
                />
              ) : null}
              <div className="min-w-0">
                {section.subtitle ? (
                  <p
                    className={`text-xs font-black uppercase tracking-[0.18em] ${
                      isAccent ? "text-slate-700" : "text-yellow-300"
                    }`}
                  >
                    {section.subtitle}
                  </p>
                ) : null}
                {section.title ? (
                  <h2 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
                    {section.title}
                  </h2>
                ) : null}
                {section.content ? (
                  <p
                    className={`mt-3 text-sm font-semibold leading-7 ${
                      isAccent ? "text-slate-800" : "text-blue-50"
                    }`}
                  >
                    {getTextPreview(section.content, 130)}
                  </p>
                ) : null}
              </div>
            </div>
            {section.button_text && section.button_url ? (
              <a
                className={`mt-5 inline-flex text-sm font-black transition ${
                  isAccent ? "text-slate-950 hover:text-blue-950" : "text-yellow-300 hover:text-white"
                }`}
                href={section.button_url}
              >
                {section.button_text}
              </a>
            ) : null}
          </article>
        );
        })}
      </div>
    </Container>
  );
}

function AboutSection({
  page,
  section,
}: Readonly<{
  page: InstitutionalPage;
  section: HomepageSection;
}>) {
  const imageUrl = getCmsAssetUrl(section.image_path ?? page.featured_image_path ?? null);
  const description = getTextPreview(section.content, 280) ?? page.excerpt ?? getTextPreview(page.body, 260);

  if (!section.title) {
    return null;
  }

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
            {section.subtitle ? (
              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {section.title}
            </h2>
            {description ? (
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                {description}
              </p>
            ) : null}
            {section.button_text && section.button_url ? (
              <div className="mt-8">
                <CTAButton href={section.button_url} variant="subtle">
                  {section.button_text}
                </CTAButton>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function DepartmentsSection({
  departments,
  section,
}: Readonly<{
  departments: Parameters<typeof DepartmentCard>[0]["department"][];
  section: HomepageSection;
}>) {
  return (
    <PremiumSection section={section} tone="cream">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((department) => (
          <DepartmentCard key={department.slug} department={department} />
        ))}
      </div>
    </PremiumSection>
  );
}

function LatestNoticesSection({
  notices,
  section,
}: Readonly<{
  notices: Notice[];
  section: HomepageSection;
}>) {
  const pinnedNotice = notices.find((notice) => notice.is_pinned) ?? null;
  const recentNotices = notices.filter((notice) => notice.slug !== pinnedNotice?.slug);

  return (
    <PremiumSection section={section} tone="navy">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {pinnedNotice ? <PinnedNoticeCard notice={pinnedNotice} /> : null}
        <div className="grid gap-4">
          {(pinnedNotice ? recentNotices : notices).map((notice) => (
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
      <h3 className="text-2xl font-black tracking-tight">
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
          Read More
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
  section,
}: Readonly<{
  profile: LeadershipProfile;
  section: HomepageSection;
}>) {
  const photoUrl = getCmsAssetUrl(section.image_path ?? profile.photo_path ?? null);
  const message = getTextPreview(section.content, 260) ?? getTextPreview(profile.message ?? profile.short_bio, 260);

  if (!section.title) {
    return null;
  }

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
            {section.subtitle ? (
              <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              {section.title}
            </h2>
            <div className="mt-6">
              <h3 className="text-2xl font-black tracking-tight">{profile.name}</h3>
              {profile.designation ? (
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-100">
                  {profile.designation}
                </p>
              ) : null}
            </div>
            {message ? (
              <p className="mt-6 text-base leading-8 text-blue-50">{message}</p>
            ) : null}
            {section.button_text && section.button_url ? (
              <div className="mt-8">
                <CTAButton href={section.button_url}>
                  {section.button_text}
                </CTAButton>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CampusLifeSection({
  galleryAlbums,
  section,
  videos,
}: Readonly<{
  galleryAlbums: GalleryAlbum[];
  section: HomepageSection;
  videos: Video[];
}>) {
  const campusVideos = videos.filter((video) => {
    const text = `${video.category ?? ""} ${video.title}`.toLowerCase();
    return text.includes("campus") || text.includes("tour") || text.includes("event");
  });
  const videoItems = campusVideos.length > 0 ? campusVideos : videos;
  const items = limitItems<CampusLifePreviewItem>(
    [
      ...galleryAlbums.map((item) => ({ type: "gallery" as const, item })),
      ...videoItems.map((item) => ({ type: "video" as const, item })),
    ],
    section,
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <PremiumSection section={section} tone="cream">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((preview) =>
          preview.type === "gallery" ? (
            <GalleryCard key={`gallery-${preview.item.slug}`} album={preview.item} />
          ) : (
            <VideoCompactCard key={`video-${preview.item.slug}`} video={preview.item} />
          ),
        )}
      </div>
    </PremiumSection>
  );
}

function TuitionFeeSection({
  scholarships,
  section,
}: Readonly<{
  scholarships: Scholarship[];
  section: HomepageSection;
}>) {
  return (
    <PremiumSection section={section} tone="white">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {scholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship.slug} scholarship={scholarship} />
        ))}
      </div>
    </PremiumSection>
  );
}

function ScholarshipsSection({
  scholarships,
  section,
}: Readonly<{
  scholarships: Scholarship[];
  section: HomepageSection;
}>) {
  return (
    <PremiumSection section={section} tone="cream">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {scholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship.slug} scholarship={scholarship} />
        ))}
      </div>
    </PremiumSection>
  );
}

function FacilitiesSection({
  facilities,
  section,
}: Readonly<{
  facilities: Facility[];
  section: HomepageSection;
}>) {
  return (
    <PremiumSection section={section} tone="white">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {facilities.map((facility) => (
          <ContentCard
            key={facility.slug}
            title={facility.title}
            description={facility.summary ?? getTextPreview(facility.description)}
            href={`/facilities/${facility.slug}`}
            imagePath={facility.image_path ?? null}
            meta={[facility.icon]}
          />
        ))}
      </div>
    </PremiumSection>
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
        scholarship.deadline ? formatDate(scholarship.deadline) : null,
      ]}
      media="none"
    />
  );
}

function ProfessorsSection({
  profiles,
  section,
}: Readonly<{
  profiles: FacultyProfile[];
  section: HomepageSection;
}>) {
  return (
    <PremiumSection section={section} tone="white">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {profiles.map((profile) => (
          <ProfessorCard key={profile.slug} profile={profile} />
        ))}
      </div>
    </PremiumSection>
  );
}

function ProfessorCard({
  profile,
}: Readonly<{
  profile: FacultyProfile;
}>) {
  const photoUrl = getCmsAssetUrl(profile.photo_path ?? null);

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-950/10">
      <div
        className="aspect-[4/5] bg-cover bg-center"
        style={{
          backgroundImage: photoUrl
            ? `url(${photoUrl})`
            : "radial-gradient(circle at 30% 20%, rgba(250,204,21,0.24), transparent 28%), linear-gradient(135deg,#071733,#1d4ed8 58%,#e0f2fe)",
        }}
        aria-hidden="true"
      />
      <div className="p-6">
        {profile.designation ? (
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            {profile.designation}
          </p>
        ) : null}
        <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950">
          {profile.name}
        </h3>
        {profile.department?.name ? (
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {profile.department.name}
          </p>
        ) : null}
        {profile.short_bio ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
            {getTextPreview(profile.short_bio, 120)}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function VideoShowcase({
  section,
  videos,
}: Readonly<{
  section: HomepageSection;
  videos: Video[];
}>) {
  const featuredVideo = videos.find((video) => video.is_featured) ?? videos[0];
  const otherVideos = videos.filter((video) => video.slug !== featuredVideo.slug);

  return (
    <PremiumSection section={section} tone="navy">
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
            Read More
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
      meta={[video.category, formatDate(video.published_at ?? video.event_date)]}
    />
  );
}

function NewsEventsSection({
  newsPosts,
  events,
  section,
}: Readonly<{
  newsPosts: NewsPost[];
  events: Event[];
  section: HomepageSection;
}>) {
  const items = limitItems<NewsEventPreviewItem>(
    [
      ...newsPosts.map((item) => ({ type: "news" as const, item })),
      ...events.map((item) => ({ type: "event" as const, item })),
    ],
    section,
  );

  return (
    <PremiumSection section={section} tone="cream">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((preview) =>
          preview.type === "news" ? (
            <ContentCard
              key={`news-${preview.item.slug}`}
              title={preview.item.title}
              description={preview.item.excerpt ?? getTextPreview(preview.item.body)}
              imagePath={preview.item.featured_image_path ?? null}
              href={`/news/${preview.item.slug}`}
              meta={[
                preview.item.category,
                formatDate(preview.item.published_at),
              ]}
            />
          ) : (
            <EventCard key={`event-${preview.item.slug}`} event={preview.item} />
          ),
        )}
      </div>
    </PremiumSection>
  );
}

function GalleryStripSection({
  galleryAlbums,
  section,
}: Readonly<{
  galleryAlbums: GalleryAlbum[];
  section: HomepageSection;
}>) {
  return (
    <PremiumSection section={section} tone="white">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {galleryAlbums.map((album) => (
          <GalleryCard key={album.slug} album={album} />
        ))}
      </div>
    </PremiumSection>
  );
}

function GalleryCard({ album }: Readonly<{ album: GalleryAlbum }>) {
  return (
    <ContentCard
      title={album.title}
      description={album.description}
      imagePath={album.cover_image_path ?? null}
      href={`/gallery/${album.slug}`}
    />
  );
}

function getHeroFeatureSections(sections: HomepageSection[]): HomepageSection[] {
  return sections
    .filter((section) => {
      const key = normalizeSectionKey(section.key);
      const hasContent = Boolean(section.title || section.subtitle || section.content);

      return (
        hasContent &&
        key !== "hero" &&
        (key.includes("feature") || key.includes("stat") || key.includes("info"))
      );
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

function getChairmanProfile(profiles: LeadershipProfile[]): LeadershipProfile | null {
  return (
    profiles.find((profile) =>
      `${profile.name} ${profile.designation ?? ""}`.toLowerCase().includes("chairman"),
    ) ??
    null
  );
}

function getFeeRelatedScholarships(scholarships: Scholarship[]): Scholarship[] {
  const feeKeywords = ["tuition", "fee", "fees", "admission fee", "waiver", "cost"];

  return scholarships.filter((scholarship) => {
    const text = [
      scholarship.title,
      scholarship.summary,
      scholarship.description,
      scholarship.eligibility,
      scholarship.benefits,
      scholarship.application_process,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return feeKeywords.some((keyword) => text.includes(keyword));
  });
}

function getHomepageSectionConfig(
  sections: HomepageSection[],
  keys: string[],
): HomepageSection | null {
  const normalizedKeys = keys.map(normalizeSectionKey);

  return (
    sections.find(
      (section) => normalizedKeys.includes(normalizeSectionKey(section.key)) && Boolean(section.title),
    ) ?? null
  );
}

function normalizeSectionKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function getSectionItemLimit(section: HomepageSection): number | null {
  const value =
    section.metadata.item_limit ??
    section.metadata.limit ??
    section.metadata.items_limit ??
    section.metadata.items_count;

  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }

  if (typeof value === "string") {
    const parsedValue = Number.parseInt(value, 10);

    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
  }

  return null;
}

function limitItems<T>(items: T[], section: HomepageSection): T[] {
  const limit = getSectionItemLimit(section);

  return limit ? items.slice(0, limit) : items;
}

function isSectionBlock(value: SectionBlock | null): value is SectionBlock {
  return value !== null;
}

function sortSectionBlocks(a: SectionBlock, b: SectionBlock): number {
  return a.section.sort_order - b.section.sort_order;
}
