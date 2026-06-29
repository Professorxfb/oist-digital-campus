import type { Metadata } from "next";
import { CMSHero } from "@/components/public-site/CMSHero";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { CTAButton } from "@/components/public-site/CTAButton";
import { DepartmentCard } from "@/components/public-site/DepartmentCard";
import { EventCard } from "@/components/public-site/EventCard";
import { NoticeStrip } from "@/components/public-site/NoticeStrip";
import { ScrollReveal } from "@/components/public-site/ScrollReveal";
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
  getHeroFeatureCards,
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
  HeroFeatureCard,
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
    heroFeatureCards,
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
    getHeroFeatureCards(),
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
    <div className="min-h-screen overflow-x-hidden bg-[#f7f3ea] text-slate-950">
      <SiteHeader settings={settings} menuItems={headerMenu.data.items} />
      <NoticeStrip notices={notices.data} label={noticeStripSection?.title} />
      <main>
        <CMSHero heroSection={heroSection} />
        {heroFeatureCards.data.length > 0 ? (
          <HeroFeatureCards cards={heroFeatureCards.data} />
        ) : null}

        {sectionBlocks.map((block) => (
          <ScrollReveal key={block.section.key}>{block.node}</ScrollReveal>
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
    <section className={`py-20 sm:py-24 ${toneClassName}`}>
      <Container>
        <div className="mb-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            {section.subtitle ? (
              <p className={`text-xs font-black uppercase tracking-[0.22em] ${eyebrowClassName}`}>
                {section.subtitle}
              </p>
            ) : null}
            <h2 className={`mt-3 font-serif text-3xl font-bold tracking-tight sm:text-5xl ${titleClassName}`}>
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
  cards,
}: Readonly<{
  cards: HeroFeatureCard[];
}>) {
  const visibleCards = cards.slice(0, 3);

  return (
    <Container className="relative z-20 pb-12 pt-6 sm:pt-8 lg:-mt-[78px] lg:max-w-[1344px] lg:pb-16 lg:pt-0 xl:-mt-[86px]">
      <div className="mx-auto grid max-w-[1280px] gap-4 sm:gap-5 lg:grid-cols-3" data-section="hero-feature-cards">
        {visibleCards.map((card, index) => {
          const iconUrl = getCmsAssetUrl(card.image_path);
          const isAccent = card.style_variant === "yellow";

          return (
            <ScrollReveal key={`${card.title}-${card.sort_order}-${index}`} delay={index * 110}>
              <article
                className={`group flex min-h-[150px] items-center rounded-[12px] p-6 text-left shadow-[0_18px_42px_rgba(2,6,23,0.12)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_26px_64px_rgba(2,6,23,0.22)] sm:p-7 lg:h-[158px] lg:p-7 2xl:p-8 ${
                  isAccent ? "bg-yellow-400 text-slate-950" : "bg-[#082f57] text-white"
                }`}
                data-hero-feature-card
              >
                <div className="flex w-full items-center gap-5 sm:gap-7 2xl:gap-8">
                  <HeroFeatureIcon
                    iconKey={card.icon_key}
                    imageUrl={iconUrl}
                    isAccent={isAccent}
                  />
                  <div className="min-w-0 flex-1 break-words">
                    {card.title ? (
                      <h2 className="font-serif text-[clamp(1.45rem,5.8vw,1.62rem)] font-bold leading-[1.14] tracking-normal sm:text-[clamp(1.5rem,3.2vw,1.72rem)] lg:text-[clamp(1.48rem,1.9vw,1.68rem)]">
                        {card.title}
                      </h2>
                    ) : null}
                    {card.description ? (
                      <p
                        className={`mt-2.5 text-[15px] font-medium leading-[1.55] sm:text-base lg:text-[15.5px] ${
                          isAccent ? "text-slate-800" : "text-blue-50"
                        }`}
                      >
                        {getTextPreview(card.description, 112)}
                      </p>
                    ) : null}
                    {card.button_text && card.button_url ? (
                      <a
                        className={`group/link mt-4 inline-flex items-center text-sm font-black transition duration-300 hover:-translate-y-0.5 ${
                          isAccent
                            ? "text-slate-950 hover:text-blue-950"
                            : "text-yellow-300 hover:text-white"
                        }`}
                        href={card.button_url}
                      >
                        {card.button_text}
                        <span
                          className="ml-2 h-px w-4 bg-current transition-transform duration-300 group-hover/link:translate-x-1"
                          aria-hidden="true"
                        />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </Container>
  );
}

function HeroFeatureIcon({
  iconKey,
  imageUrl,
  isAccent,
}: Readonly<{
  iconKey: string;
  imageUrl: string | null;
  isAccent: boolean;
}>) {
  const iconClassName = isAccent ? "text-[#082f57]" : "text-white";

  if (imageUrl) {
    return (
      <span
        className="h-[58px] w-[58px] shrink-0 bg-contain bg-center bg-no-repeat sm:h-16 sm:w-16 lg:h-[62px] lg:w-[62px] 2xl:h-[66px] 2xl:w-[66px]"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center sm:h-16 sm:w-16 lg:h-[62px] lg:w-[62px] 2xl:h-[66px] 2xl:w-[66px]" aria-hidden="true">
      <svg
        className={`h-[58px] w-[58px] transition duration-300 group-hover:scale-105 sm:h-16 sm:w-16 lg:h-[62px] lg:w-[62px] 2xl:h-[66px] 2xl:w-[66px] ${iconClassName}`}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderHeroFeatureIconPath(iconKey)}
      </svg>
    </span>
  );
}

function renderHeroFeatureIconPath(iconKey: string): React.ReactNode {
  switch (iconKey) {
    case "library":
      return (
        <>
          <path
            d="M10 23L36 10L62 23L36 36L10 23Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M20 31V45C20 51 27 55 36 55C45 55 52 51 52 45V31"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path d="M62 23V42" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M56 48H68" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </>
      );
    case "educator":
      return (
        <>
          <path
            d="M36 9L47 24H25L36 9Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path
            d="M18 27H54V36H18V27Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M23 36V58M36 36V58M49 36V58" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M14 60H58" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </>
      );
    case "achievement":
      return (
        <>
          <path
            d="M36 8L43 24L60 26.5L48 39L51 56L36 48L21 56L24 39L12 26.5L29 24L36 8Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M17 63H55" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M25 54L21 63M47 54L51 63" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </>
      );
    default:
      return (
        <>
          <path
            d="M15 19H57V52H15V19Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <path d="M24 32H48M24 41H42" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
        </>
      );
  }
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
                className="absolute inset-0 bg-cover bg-center transition duration-500 hover:scale-105"
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
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
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
