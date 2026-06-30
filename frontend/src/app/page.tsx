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

type CommunityVoice = {
  quote: string;
  name?: string;
  role?: string;
  image_path?: string | null;
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
  const communityVoicesSection = getHomepageSectionConfig(sections, [
    "community_voices",
    "feedback",
    "testimonials",
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
  const communityVoices = communityVoicesSection
    ? getCommunityVoices(communityVoicesSection)
    : [];
  const nullableSectionBlocks: Array<SectionBlock | null> = [
    aboutSection
      ? {
          section: aboutSection,
          node: <AboutSection section={aboutSection} />,
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
    communityVoicesSection && communityVoices.length > 0
      ? {
          section: communityVoicesSection,
          node: (
            <CommunityVoicesSection
              section={communityVoicesSection}
              voices={communityVoices}
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
    navy: "bg-[#061f3f] text-white",
  }[tone];
  const titleClassName = tone === "navy" ? "text-white" : "text-slate-950";
  const eyebrowClassName = tone === "navy" ? "text-yellow-300" : "text-blue-800";
  const descriptionClassName = tone === "navy" ? "text-blue-100" : "text-slate-600";
  const description = getTextPreview(section.content, 260);

  return (
    <section className={`relative overflow-hidden py-20 sm:py-24 lg:py-28 ${toneClassName}`}>
      {tone === "navy" ? (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(250,204,21,0.14),transparent_24%),linear-gradient(135deg,rgba(2,6,23,0.32),transparent_48%)]"
          aria-hidden="true"
        />
      ) : null}
      <Container className="relative">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
          <div className="max-w-3xl">
            {section.subtitle ? (
              <p className={`text-xs font-black uppercase tracking-[0.18em] ${eyebrowClassName}`}>
                {section.subtitle}
              </p>
            ) : null}
            <h2 className={`mt-3 font-serif text-[clamp(2.25rem,7vw,3.25rem)] font-bold leading-[1.05] tracking-normal ${titleClassName}`}>
              {section.title}
            </h2>
            {description ? (
              <p className={`mt-5 max-w-2xl text-base leading-8 ${descriptionClassName}`}>
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
  section,
}: Readonly<{
  section: HomepageSection;
}>) {
  const imageUrl = getCmsAssetUrl(section.image_path);
  const videoUrl = getCmsAssetUrl(section.video_path);
  const description = getTextPreview(section.content, 360);
  const hasMedia = Boolean(videoUrl || imageUrl);

  if (!section.title) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f3ea] py-20 sm:py-24 lg:py-28">
      <div
        className="absolute inset-x-0 top-0 h-36 bg-white"
        aria-hidden="true"
      />
      <Container>
        <div
          className={`relative grid items-center gap-10 xl:gap-16 ${
            hasMedia ? "lg:grid-cols-[0.95fr_1.05fr]" : ""
          }`}
        >
          {hasMedia ? (
            <div className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-[#071733] shadow-[0_28px_70px_rgba(2,6,23,0.18)] sm:min-h-[460px]">
              {videoUrl ? (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                />
              ) : imageUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-500 hover:scale-105"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                  aria-hidden="true"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.28))]" aria-hidden="true" />
              <div
                className="absolute bottom-6 right-6 h-24 w-24 rounded-full border-[10px] border-yellow-300/90 bg-[#061f3f]/90 shadow-2xl shadow-slate-950/20 sm:h-32 sm:w-32"
                aria-hidden="true"
              />
            </div>
          ) : null}
          <div
            className={`rounded-[28px] bg-white p-7 shadow-[0_18px_55px_rgba(2,6,23,0.08)] sm:p-10 ${
              hasMedia ? "lg:bg-transparent lg:p-0 lg:shadow-none" : "max-w-4xl"
            }`}
          >
            {section.subtitle ? (
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="mt-3 font-serif text-[clamp(2.35rem,7vw,3.6rem)] font-bold leading-[1.04] tracking-normal text-[#061f3f]">
              {section.title}
            </h2>
            {description ? (
              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
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
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
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
    <article className="group relative overflow-hidden rounded-[26px] bg-yellow-400 p-8 text-slate-950 shadow-[0_24px_70px_rgba(2,6,23,0.24)] transition duration-300 hover:-translate-y-1.5">
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18px] border-white/30"
        aria-hidden="true"
      />
      <NoticeMeta notice={notice} className="relative text-slate-800" />
      <h3 className="relative mt-5 font-serif text-3xl font-bold leading-[1.12] tracking-normal">
        <a href={`/notices/${notice.slug}`} className="transition hover:text-blue-800">
          {notice.title}
        </a>
      </h3>
      {notice.body ? (
        <p className="relative mt-5 text-[15px] leading-7 text-slate-800">
          {getTextPreview(notice.body, 180)}
        </p>
      ) : null}
      <div className="mt-6">
        <CTAButton href={`/notices/${notice.slug}`} variant="secondary">
          Read More
        </CTAButton>
      </div>
    </article>
  );
}

function NoticeListCard({ notice }: Readonly<{ notice: Notice }>) {
  return (
    <article className="group rounded-[20px] border border-white/10 bg-white/[0.08] p-5 transition duration-300 hover:-translate-y-1 hover:border-yellow-300/50 hover:bg-white/[0.13]">
      <NoticeMeta notice={notice} className="text-yellow-200" />
      <h3 className="mt-3 font-serif text-[1.35rem] font-bold leading-snug tracking-normal text-white">
        <a href={`/notices/${notice.slug}`} className="transition hover:text-yellow-300">
          {notice.title}
        </a>
      </h3>
      {notice.body ? (
        <p className="mt-2 text-sm leading-6 text-blue-100/90">
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
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="overflow-hidden rounded-[30px] bg-[#061f3f] shadow-[0_28px_80px_rgba(2,6,23,0.18)] lg:grid lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-[340px] bg-blue-950">
            {photoUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 hover:scale-105"
                style={{ backgroundImage: `url(${photoUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_34%_24%,rgba(250,204,21,0.24),transparent_30%),linear-gradient(135deg,#0f172a,#1d4ed8_65%,#082f49)]"
                aria-hidden="true"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.25))]" aria-hidden="true" />
          </div>
          <div className="relative overflow-hidden p-7 text-white sm:p-10 lg:p-14">
            <div
              className="absolute right-8 top-8 h-24 w-24 rounded-full border-[16px] border-yellow-300/20"
              aria-hidden="true"
            />
            {section.subtitle ? (
              <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="relative mt-4 font-serif text-[clamp(2.15rem,6vw,3.35rem)] font-bold leading-[1.08] tracking-normal">
              {section.title}
            </h2>
            <div className="relative mt-7 border-l-4 border-yellow-300 pl-5">
              <h3 className="font-serif text-2xl font-bold tracking-normal">{profile.name}</h3>
              {profile.designation ? (
                <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-blue-100">
                  {profile.designation}
                </p>
              ) : null}
            </div>
            {message ? (
              <p className="relative mt-6 text-base leading-8 text-blue-50 sm:text-lg">{message}</p>
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

  const [featuredItem, ...secondaryItems] = items;

  return (
    <PremiumSection section={section} tone="cream">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <CampusLifeFeature item={featuredItem} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {secondaryItems.map((preview) =>
            preview.type === "gallery" ? (
              <GalleryCard key={`gallery-${preview.item.slug}`} album={preview.item} />
            ) : (
              <VideoCompactCard key={`video-${preview.item.slug}`} video={preview.item} />
            ),
          )}
        </div>
      </div>
    </PremiumSection>
  );
}

function CampusLifeFeature({
  item,
}: Readonly<{
  item: CampusLifePreviewItem;
}>) {
  if (item.type === "video") {
    return <VideoFeatureCard video={item.item} compactAction />;
  }

  const imageUrl = getCmsAssetUrl(item.item.cover_image_path ?? null);

  return (
    <article className="group relative min-h-[430px] overflow-hidden rounded-[30px] bg-[#061f3f] shadow-[0_24px_70px_rgba(2,6,23,0.16)]">
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(250,204,21,0.22),transparent_28%),linear-gradient(135deg,#061f3f,#1d4ed8_58%,#082f49)]"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08),rgba(2,6,23,0.82))]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
        <h3 className="max-w-xl font-serif text-3xl font-bold leading-tight tracking-normal">
          {item.item.title}
        </h3>
        {item.item.description ? (
          <p className="mt-3 max-w-xl text-sm leading-7 text-blue-50">
            {getTextPreview(item.item.description, 150)}
          </p>
        ) : null}
        <div className="mt-6">
          <CTAButton href={`/gallery/${item.item.slug}`}>
            Read More
          </CTAButton>
        </div>
      </div>
    </article>
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
    <article className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_14px_42px_rgba(2,6,23,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-yellow-300/60 hover:shadow-[0_24px_58px_rgba(2,6,23,0.13)]">
      <div className="overflow-hidden">
        <div
          className="aspect-[4/5] bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{
            backgroundImage: photoUrl
              ? `url(${photoUrl})`
              : "radial-gradient(circle at 30% 20%, rgba(250,204,21,0.24), transparent 28%), linear-gradient(135deg,#071733,#1d4ed8 58%,#e0f2fe)",
          }}
          aria-hidden="true"
        />
      </div>
      <div className="p-6">
        {profile.designation ? (
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
            {profile.designation}
          </p>
        ) : null}
        <h3 className="mt-2 font-serif text-2xl font-bold leading-tight tracking-normal text-slate-950">
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

function VideoFeatureCard({
  compactAction = false,
  video,
}: Readonly<{
  compactAction?: boolean;
  video: Video;
}>) {
  const thumbnailUrl = getCmsAssetUrl(video.thumbnail_path ?? null);

  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/10 bg-white text-slate-950 shadow-[0_24px_70px_rgba(2,6,23,0.2)] transition duration-300 hover:-translate-y-1.5">
      <div className="relative overflow-hidden">
        <div
          className="aspect-video bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{
            backgroundImage: thumbnailUrl
              ? `url(${thumbnailUrl})`
              : "linear-gradient(135deg,#0f172a,#1d4ed8 56%,#facc15)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-[#061f3f] shadow-xl shadow-slate-950/20"
          aria-hidden="true"
        >
          <svg className="ml-1 h-5 w-5" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.5 2.8v10.4L12.5 8 4.5 2.8Z" />
          </svg>
        </div>
      </div>
      <div className={compactAction ? "p-7" : "p-7 sm:p-8"}>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
          {[video.category, formatDate(video.published_at ?? video.event_date)]
            .filter(Boolean)
            .join(" / ")}
        </p>
        <h3 className="mt-3 font-serif text-3xl font-bold leading-[1.12] tracking-normal">{video.title}</h3>
        {video.excerpt ? (
          <p className="mt-3 text-[15px] leading-7 text-slate-600">{video.excerpt}</p>
        ) : null}
        <div className={compactAction ? "mt-5" : "mt-6"}>
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

function CommunityVoicesSection({
  section,
  voices,
}: Readonly<{
  section: HomepageSection;
  voices: CommunityVoice[];
}>) {
  return (
    <PremiumSection section={section} tone="navy">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {voices.map((voice, index) => {
          const imageUrl = getCmsAssetUrl(voice.image_path ?? null);

          return (
            <article
              key={`${voice.name ?? "voice"}-${index}`}
              className="group rounded-[26px] border border-white/10 bg-white/[0.08] p-7 text-white transition duration-300 hover:-translate-y-1.5 hover:border-yellow-300/50 hover:bg-white/[0.13]"
            >
              <div className="mb-6 flex items-center gap-4">
                <span
                  className="h-14 w-14 shrink-0 rounded-full border border-yellow-300/40 bg-white/10 bg-cover bg-center"
                  style={{
                    backgroundImage: imageUrl
                      ? `url(${imageUrl})`
                      : "linear-gradient(135deg,#facc15,#1d4ed8)",
                  }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  {voice.name ? (
                    <span className="block font-serif text-xl font-bold leading-tight">
                      {voice.name}
                    </span>
                  ) : null}
                  {voice.role ? (
                    <span className="mt-1 block text-xs font-black uppercase tracking-[0.14em] text-yellow-300">
                      {voice.role}
                    </span>
                  ) : null}
                </span>
              </div>
              <p className="text-base leading-8 text-blue-50">{voice.quote}</p>
            </article>
          );
        })}
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
  const [featuredAlbum, ...otherAlbums] = galleryAlbums;

  return (
    <PremiumSection section={section} tone="white">
      <div className={`grid gap-5 ${otherAlbums.length > 0 ? "lg:grid-cols-[1.25fr_0.75fr]" : ""}`}>
        <GalleryFeatureCard album={featuredAlbum} />
        {otherAlbums.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {otherAlbums.map((album) => (
              <GalleryCard key={album.slug} album={album} />
            ))}
          </div>
        ) : null}
      </div>
    </PremiumSection>
  );
}

function GalleryFeatureCard({ album }: Readonly<{ album: GalleryAlbum }>) {
  const imageUrl = getCmsAssetUrl(album.cover_image_path ?? null);

  return (
    <article className="group relative min-h-[440px] overflow-hidden rounded-[30px] bg-[#061f3f] shadow-[0_24px_70px_rgba(2,6,23,0.16)]">
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.24),transparent_28%),linear-gradient(135deg,#071733,#1d4ed8_58%,#e0f2fe)]"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.04),rgba(2,6,23,0.82))]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
        <h3 className="max-w-xl font-serif text-3xl font-bold leading-tight tracking-normal">
          {album.title}
        </h3>
        {album.description ? (
          <p className="mt-3 max-w-xl text-sm leading-7 text-blue-50">
            {getTextPreview(album.description, 150)}
          </p>
        ) : null}
        <div className="mt-6">
          <CTAButton href={`/gallery/${album.slug}`}>
            Read More
          </CTAButton>
        </div>
      </div>
    </article>
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

function getCommunityVoices(section: HomepageSection): CommunityVoice[] {
  const rawItems =
    section.metadata.items ??
    section.metadata.voices ??
    section.metadata.testimonials ??
    section.metadata.feedback;

  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .map((item): CommunityVoice | null => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const quote = getMetadataText(record, ["quote", "message", "content", "body"]);

      if (!quote) {
        return null;
      }

      return {
        quote,
        name: getMetadataText(record, ["name", "title"]),
        role: getMetadataText(record, ["role", "designation", "type"]),
        image_path: getMetadataText(record, ["image_path", "photo_path", "avatar_path"]),
      };
    })
    .filter((item): item is CommunityVoice => item !== null);
}

function getMetadataText(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
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
