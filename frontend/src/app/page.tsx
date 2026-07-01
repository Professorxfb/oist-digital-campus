import type { Metadata } from "next";
import Link from "next/link";
import { CMSHero } from "@/components/public-site/CMSHero";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { CTAButton } from "@/components/public-site/CTAButton";
import { EventCard } from "@/components/public-site/EventCard";
import { NoticeStrip } from "@/components/public-site/NoticeStrip";
import { OistLabShowcase, type OistLabImage } from "@/components/public-site/OistLabShowcase";
import { ScrollReveal } from "@/components/public-site/ScrollReveal";
import { SiteFooter } from "@/components/public-site/SiteFooter";
import { SiteHeader } from "@/components/public-site/SiteHeader";
import { resolveCmsAssetUrl } from "@/lib/api-client";
import { formatDate, getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import {
  getAcademicPrograms,
  getEvents,
  getFacilities,
  getFacultyProfiles,
  getGalleryAlbums,
  getHeroFeatureCards,
  getHomepageSections,
  getMenuByLocation,
  getNewsPosts,
  getNotices,
  getScholarships,
  getSiteSettings,
  getVideos,
} from "@/services/cms";
import type {
  AcademicProgram,
  Event,
  Facility,
  FacultyProfile,
  GalleryAlbum,
  HeroFeatureCard,
  HomepageSection,
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
    academicPrograms,
    facilities,
    facultyProfiles,
    scholarships,
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
    getAcademicPrograms(),
    getFacilities(),
    getFacultyProfiles(),
    getScholarships(),
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
  const chairmanSection = getHomepageSectionByKey(sections, ["chairman_message"]);
  const oistLabSection = getHomepageSectionByKey(sections, ["oist_lab"]);
  const academicsProgramsSection = getHomepageSectionConfig(sections, [
    "academics_programs",
    "academic_programs",
    "programs",
    "programs_study",
  ]);
  const noticesSection = getHomepageSectionConfig(sections, ["latest_notices"]);
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
    academicsProgramsSection && academicPrograms.data.length > 0
      ? {
          section: academicsProgramsSection,
          node: (
            <AcademicsProgramsSection
              programs={limitItems(academicPrograms.data, academicsProgramsSection)}
              section={academicsProgramsSection}
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
    chairmanSection
      ? {
          section: chairmanSection,
          node: <ChairmanMessageSection section={chairmanSection} />,
        }
      : null,
    oistLabSection
      ? {
          section: oistLabSection,
          node: <OistLabSection section={oistLabSection} />,
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
    white: "bg-[#f7f3ea]",
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
  const uploadedVideoUrl = getCmsAssetUrl(section.video_path);
  const externalVideoUrl = getHomepageSectionExternalVideoUrl(section);
  const youtubeEmbedUrl = externalVideoUrl ? getYouTubeEmbedUrl(externalVideoUrl) : null;
  const videoThumbnailUrl =
    getCmsAssetUrl(
      getMetadataText(section.metadata, [
        "video_thumbnail_path",
        "video_thumbnail",
        "thumbnail_path",
        "thumbnail",
      ]) ?? null,
    ) ??
    (externalVideoUrl ? getYouTubeThumbnailUrl(externalVideoUrl) : null) ??
    imageUrl;
  const imageUrls = getHomepageSectionGalleryImages(section)
    .map((path) => getCmsAssetUrl(path))
    .filter((url): url is string => Boolean(url));
  const mediaImages = uniqueValues([imageUrl, ...imageUrls].filter((url): url is string => Boolean(url)));
  const featureItems = getAboutFeatureItems(section);
  const mediaBadge = getMetadataText(section.metadata, ["badge_text", "media_badge", "stat_text"]);
  const description = getTextPreview(section.content, 360);
  const hasVideo = Boolean(youtubeEmbedUrl || uploadedVideoUrl || externalVideoUrl);
  const hasMediaImages = mediaImages.length > 0;
  const featureVideoGridClassName =
    featureItems.length > 0 && hasVideo
      ? "mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-center xl:gap-6"
      : "mt-7 grid gap-5";

  if (!section.title) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f3ea] py-16 sm:py-22 lg:py-28">
      <Container>
        <div
          className={`relative grid items-center gap-10 xl:gap-16 ${
            hasMediaImages ? "lg:grid-cols-[1.02fr_0.98fr]" : ""
          }`}
        >
          <div
            className={`order-1 rounded-[24px] bg-[#fffaf0] p-6 shadow-[0_18px_50px_rgba(2,6,23,0.07)] sm:p-9 lg:order-2 ${
              hasMediaImages ? "lg:bg-transparent lg:p-0 lg:shadow-none" : "max-w-4xl"
            }`}
          >
            {section.subtitle ? (
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                {section.subtitle}
              </p>
            ) : null}
            <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2.15rem,6vw,3.2rem)] font-bold leading-[1.08] tracking-normal text-[#061f3f]">
              {section.title}
            </h2>
            {description ? (
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-[17px]">
                {description}
              </p>
            ) : null}
            {featureItems.length > 0 || hasVideo ? (
              <div className={featureVideoGridClassName}>
                {featureItems.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {featureItems.map((item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className="flex gap-3 rounded-2xl border border-blue-100/80 bg-white/70 p-4 shadow-sm"
                      >
                        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-[#061f3f]" aria-hidden="true">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5">
                            <path d="M3 8.2 6.4 11.5 13 4.5" />
                          </svg>
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-black leading-6 text-[#061f3f]">
                            {item.title}
                          </span>
                          {item.description ? (
                            <span className="mt-1 block text-sm leading-6 text-slate-600">
                              {item.description}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {hasVideo ? (
                  <AboutVideoCard
                    externalVideoUrl={externalVideoUrl}
                    thumbnailUrl={videoThumbnailUrl}
                    uploadedVideoUrl={uploadedVideoUrl}
                    youtubeEmbedUrl={youtubeEmbedUrl}
                  />
                ) : null}
              </div>
            ) : null}
            {section.button_text && section.button_url ? (
              <div className="mt-8">
                <CTAButton href={section.button_url}>
                  {section.button_text}
                </CTAButton>
              </div>
            ) : null}
          </div>
          {hasMediaImages ? (
            <AboutMediaCollage
              badge={mediaBadge}
              imageUrls={mediaImages}
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function AboutMediaCollage({
  badge,
  imageUrls,
}: Readonly<{
  badge?: string;
  imageUrls: string[];
}>) {
  return (
    <div className="order-2 space-y-5 lg:order-1">
      {imageUrls.length > 0 ? (
        <div className="relative">
          <div className="grid gap-4 sm:grid-cols-[1.08fr_0.92fr]">
            <AboutImageTile
              imageUrl={imageUrls[0]}
              className="min-h-[310px] sm:min-h-[470px]"
            />
            {imageUrls.length > 1 ? (
              <div className="grid gap-4">
                {imageUrls.slice(1, 3).map((url, index) => (
                  <AboutImageTile
                    key={url}
                    imageUrl={url}
                    className={index === 0 ? "min-h-[220px]" : "min-h-[220px]"}
                  />
                ))}
              </div>
            ) : null}
          </div>
          {badge ? (
            <div className="absolute -bottom-5 left-5 max-w-[15rem] rounded-2xl bg-yellow-400 px-5 py-4 text-sm font-black leading-6 text-[#061f3f] shadow-[0_20px_45px_rgba(2,6,23,0.18)] sm:left-8">
              {badge}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function AboutImageTile({
  className,
  imageUrl,
}: Readonly<{
  className?: string;
  imageUrl: string;
}>) {
  return (
    <div
      className={`group overflow-hidden rounded-[24px] bg-[#061f3f] shadow-[0_24px_58px_rgba(2,6,23,0.13)] ${className ?? ""}`}
    >
      <div
        className="h-full min-h-[inherit] bg-cover bg-center transition duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-hidden="true"
      />
    </div>
  );
}

function AboutVideoCard({
  externalVideoUrl,
  thumbnailUrl,
  uploadedVideoUrl,
  youtubeEmbedUrl,
}: Readonly<{
  externalVideoUrl: string | null;
  thumbnailUrl: string | null;
  uploadedVideoUrl: string | null;
  youtubeEmbedUrl: string | null;
}>) {
  const videoHref = externalVideoUrl ?? youtubeEmbedUrl ?? uploadedVideoUrl;

  return (
    <div className="aspect-video w-full max-w-[430px] justify-self-center overflow-hidden rounded-[16px] border-[3px] border-white bg-white shadow-[0_16px_38px_rgba(2,6,23,0.13)] max-sm:-mx-6 max-sm:w-[calc(100%+3rem)] sm:max-w-[430px] lg:max-w-[340px] lg:justify-self-end">
      {videoHref ? (
        <a
          className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-[12px] bg-[#061f3f] text-white transition duration-300 hover:bg-yellow-400 hover:text-[#061f3f] hover:shadow-[0_20px_42px_rgba(2,6,23,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
          href={videoHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Play section video"
        >
          {thumbnailUrl ? (
            <span
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
              aria-hidden="true"
            />
          ) : null}
          <span className="absolute inset-0 bg-slate-950/18 transition-colors duration-300 group-hover:bg-yellow-400/12" aria-hidden="true" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#061f3f] shadow-[0_12px_24px_rgba(2,6,23,0.22)] transition duration-300 group-hover:scale-105 group-hover:bg-yellow-400 group-hover:text-[#061f3f] sm:h-14 sm:w-14" aria-hidden="true">
            <svg className="ml-1 h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.5 2.8v10.4L12.5 8 4.5 2.8Z" />
            </svg>
          </span>
        </a>
      ) : null}
    </div>
  );
}

function AcademicsProgramsSection({
  programs,
  section,
}: Readonly<{
  programs: AcademicProgram[];
  section: HomepageSection;
}>) {
  if (!section.title || programs.length === 0) {
    return null;
  }

  const description = getTextPreview(section.content, 260);
  const backgroundImageUrl = getCmsAssetUrl(section.image_path);
  const visibleDots = programs.length > 1 ? programs : [];
  const statValue = getMetadataText(section.metadata, [
    "stat_value",
    "admission_count",
    "admission_value",
    "right_stat_value",
  ]);
  const statLabel = getMetadataText(section.metadata, [
    "stat_label",
    "admission_label",
    "right_stat_label",
  ]);
  const carouselClassName =
    programs.length === 1
      ? "hide-scrollbar flex snap-x snap-mandatory justify-center overflow-x-auto scroll-smooth"
      : "hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth sm:gap-7 lg:gap-8";
  const cardFrameClassName =
    programs.length === 1
      ? "w-full max-w-[430px] snap-center scroll-mt-28"
      : "min-w-[86%] snap-start scroll-mt-28 sm:min-w-[47%] lg:min-w-[31.8%]";

  return (
    <section className="relative isolate overflow-hidden bg-[#f7f3ea] pb-9 sm:pb-11 lg:pb-12">
      <div className="absolute inset-x-0 top-0 h-[56%] bg-[#072f57]" aria-hidden="true" />
      {backgroundImageUrl ? (
        <div
          className="absolute inset-x-0 top-0 h-[56%] bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="absolute inset-x-0 top-0 h-[56%] bg-[linear-gradient(180deg,rgba(3,22,50,0.18),rgba(3,22,50,0.02))]" aria-hidden="true" />
      <div
        className="absolute right-[-118px] top-[180px] hidden h-[310px] w-[430px] rounded-[50%] border border-blue-100/10 opacity-70 lg:block"
        aria-hidden="true"
      />
      <div
        className="absolute right-[-78px] top-[226px] hidden h-[190px] w-[350px] rounded-[50%] border border-blue-100/10 opacity-70 lg:block"
        aria-hidden="true"
      />

      <Container className="relative pt-14 sm:pt-16 lg:pt-18">
        <div className="grid gap-7 pb-9 text-white lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:pb-10">
          <div className="max-w-3xl">
            {section.subtitle ? (
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-normal text-white">
                <AcademicProgramIcon icon="cap" className="h-5 w-5 text-white" />
                <span>{section.subtitle}</span>
              </div>
            ) : null}
            <h2 className="mt-4 font-serif text-[clamp(2.45rem,6vw,3.8rem)] font-bold leading-[1.04] tracking-normal text-white">
              {section.title}
            </h2>
            {description ? (
              <p className="mt-5 max-w-2xl text-base leading-8 text-blue-50/86">
                {description}
              </p>
            ) : null}
          </div>

          {statValue || statLabel ? (
            <div className="flex items-center gap-5 justify-self-start lg:justify-self-end lg:pt-2">
              <div className="hidden h-14 w-14 items-center justify-center rounded-full border border-white/18 text-white sm:flex">
                <AcademicProgramIcon icon="cap" className="h-8 w-8" />
              </div>
              <div>
                {statValue ? (
                  <p className="text-lg font-black leading-none text-white">
                    {statValue}
                  </p>
                ) : null}
                {statLabel ? (
                  <p className="mt-2 text-sm font-bold text-blue-50">
                    {statLabel}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={carouselClassName}
          aria-label={`${section.title} carousel`}
        >
          {programs.map((program, index) => (
            <ScrollReveal
              key={program.slug}
              className={cardFrameClassName}
              delay={index * 80}
            >
              <AcademicProgramCard
                program={program}
                section={section}
              />
            </ScrollReveal>
          ))}
        </div>

        {visibleDots.length > 0 ? (
          <div className="mt-8 flex items-center justify-center gap-3" aria-label="Academics and programs carousel pagination">
            {visibleDots.map((program, index) => (
              <a
                key={`${program.slug}-dot`}
                href={`#homepage-program-${program.slug}`}
                className={`h-3 w-3 rounded-full transition duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-900 ${
                  index === 0 ? "bg-[#063763]" : "bg-yellow-400"
                }`}
                aria-label={`Show ${program.title}`}
              />
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  );
}

function AcademicProgramCard({
  program,
  section,
}: Readonly<{
  program: AcademicProgram;
  section: HomepageSection;
}>) {
  const imageUrl = getCmsAssetUrl(program.featured_image_path ?? null);
  const description = program.short_description ?? getTextPreview(program.description, 120);
  const bullets = getAcademicProgramBullets(program).slice(0, 3);
  const buttonUrl = program.button_url ?? section.button_url;
  const buttonText = program.button_text ?? section.button_text ?? "Learn More";

  return (
    <article
      id={`homepage-program-${program.slug}`}
      className="group flex h-full min-h-[500px] flex-col overflow-hidden rounded-[8px] bg-white p-2 shadow-[0_20px_50px_rgba(2,6,23,0.10)] ring-1 ring-slate-950/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_72px_rgba(2,6,23,0.16)]"
    >
      <div className="relative aspect-[1.54/1] overflow-hidden rounded-[8px] bg-slate-100">
        {imageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
            aria-hidden="true"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_76%_16%,rgba(250,204,21,0.24),transparent_26%),linear-gradient(135deg,#e2e8f0,#bfdbfe_54%,#f8fafc)]"
            aria-hidden="true"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[#063763]/10 bg-white text-[#063763] shadow-xl shadow-slate-950/10">
              <AcademicProgramIcon icon={program.icon} className="h-10 w-10" />
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#061f3f]" aria-hidden="true">
            <AcademicProgramIcon icon={program.icon} className="h-11 w-11" />
          </div>
          <h3 className="font-serif text-[clamp(1.55rem,4.2vw,1.92rem)] font-bold leading-[1.12] tracking-normal text-[#082447]">
            {program.title}
          </h3>
        </div>

        {description ? (
          <p className="mt-4 max-w-[25.5rem] text-[15.5px] leading-7 text-slate-600">
            {description}
          </p>
        ) : null}

        {bullets.length > 0 ? (
          <ul className="mt-5 space-y-2.5">
            {bullets.map((bullet) => (
              <li key={`${program.slug}-${bullet}`} className="flex items-start gap-3 text-[15px] font-bold leading-6 text-[#082447]">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center text-yellow-500" aria-hidden="true">
                  <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.2 6.5 12 13 4" />
                  </svg>
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {buttonUrl ? (
          <a
            href={buttonUrl}
            className="group/program-button mt-6 inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-[#06436e] px-6 py-3 text-sm font-black text-white transition-colors duration-300 hover:bg-yellow-400 hover:text-[#061f3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
          >
            <span>{buttonText}</span>
            <span className="ml-3 grid h-4 w-4 grid-cols-2 gap-1" aria-hidden="true">
              <span className="h-1 w-1 rounded-full bg-current transition-colors duration-300" />
              <span className="h-1 w-1 rounded-full bg-current transition-colors duration-300" />
              <span className="h-1 w-1 rounded-full bg-current transition-colors duration-300" />
              <span className="h-1 w-1 rounded-full bg-current transition-colors duration-300" />
            </span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

function AcademicProgramIcon({
  icon,
  className = "h-8 w-8",
}: Readonly<{
  icon?: string | null;
  className?: string;
}>) {
  const iconKey = icon?.trim().toLowerCase();

  if (iconKey === "law") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M24 8v31" />
        <path d="M12 39h24" />
        <path d="M17 13h14" />
        <path d="M8 18h14" />
        <path d="M26 18h14" />
        <path d="M15 18 8 31h14L15 18Z" />
        <path d="m33 18-7 13h14l-7-13Z" />
      </svg>
    );
  }

  if (iconKey === "code" || iconKey === "computer") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 12h32v22H8z" />
        <path d="M18 40h12" />
        <path d="M24 34v6" />
        <path d="m19 20-4 4 4 4" />
        <path d="m29 20 4 4-4 4" />
      </svg>
    );
  }

  if (iconKey === "science") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8h12" />
        <path d="M21 8v10L12 36a6 6 0 0 0 5.4 4h13.2A6 6 0 0 0 36 36l-9-18V8" />
        <path d="M17 31h14" />
      </svg>
    );
  }

  if (iconKey === "engineering") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M24 8v7" />
        <path d="M24 33v7" />
        <path d="M8 24h7" />
        <path d="M33 24h7" />
        <path d="m13 13 5 5" />
        <path d="m30 30 5 5" />
        <path d="m35 13-5 5" />
        <path d="m18 30-5 5" />
        <circle cx="24" cy="24" r="8" />
      </svg>
    );
  }

  if (iconKey === "business") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 18h28v22H10z" />
        <path d="M18 18v-5h12v5" />
        <path d="M10 26h28" />
        <path d="M21 26v4h6v-4" />
      </svg>
    );
  }

  if (iconKey === "book") {
    return (
      <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 10h13a7 7 0 0 1 7 7v21H17a7 7 0 0 0-7 7V10Z" />
        <path d="M38 10H25a7 7 0 0 0-7 7v21h13a7 7 0 0 1 7 7V10Z" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 18 18-8 18 8-18 8-18-8Z" />
      <path d="M14 22v9c0 3 5 6 10 6s10-3 10-6v-9" />
      <path d="M40 20v12" />
      <path d="M38 36h4" />
    </svg>
  );
}

function getAcademicProgramBullets(program: AcademicProgram): string[] {
  if (!Array.isArray(program.bullet_points)) {
    return [];
  }

  return program.bullet_points
    .map((bullet) => (typeof bullet === "string" ? bullet.trim() : ""))
    .filter(Boolean);
}

function LatestNoticesSection({
  notices,
  section,
}: Readonly<{
  notices: Notice[];
  section: HomepageSection;
}>) {
  const description = getTextPreview(section.content, 180);
  const filters = getNoticeFilterGroups(notices);

  return (
    <section className="relative overflow-hidden bg-[#f7f3ea] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          {section.subtitle ? (
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">
              {section.subtitle}
            </p>
          ) : null}
          <h2 className="mt-3 font-serif text-[clamp(2.35rem,7vw,3.55rem)] font-bold leading-[1.05] tracking-normal text-[#061f3f]">
            {section.title}
          </h2>
          {description ? (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {description}
            </p>
          ) : null}
        </div>

        {filters.length > 0 ? (
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {filters.flatMap((group) =>
              group.values.map((value) => (
                <Link
                  key={`${group.key}-${value}`}
                  href={`/notices?${group.key}=${encodeURIComponent(value)}`}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#061f3f] shadow-sm transition duration-300 hover:border-yellow-400 hover:bg-yellow-300 hover:text-[#061f3f]"
                >
                  {value}
                </Link>
              )),
            )}
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start xl:gap-10">
          <NoticeFilterPanel filters={filters} noticesCount={notices.length} />
          <div className="grid gap-5 sm:gap-6">
            {notices.map((notice, index) => (
              <ScrollReveal key={notice.slug} delay={90 + index * 70}>
                <NoticeReferenceCard notice={notice} />
              </ScrollReveal>
            ))}
          </div>
        </div>

        {section.button_text && section.button_url ? (
          <div className="mt-10 text-center">
            <CTAButton href={section.button_url} variant="subtle">
              {section.button_text}
            </CTAButton>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

type NoticeFilterGroup = {
  key: "category" | "audience";
  label: string;
  values: string[];
};

function NoticeFilterPanel({
  filters,
  noticesCount,
}: Readonly<{
  filters: NoticeFilterGroup[];
  noticesCount: number;
}>) {
  return (
    <aside className="hidden rounded-[12px] bg-white p-7 shadow-[0_18px_48px_rgba(2,6,23,0.07)] ring-1 ring-slate-200/60 lg:block">
      <h3 className="font-serif text-[1.55rem] font-bold leading-tight tracking-normal text-[#061f3f]">
        Filter By
      </h3>
      <div className="mt-6 h-px bg-slate-200" aria-hidden="true">
        <span className="block h-px w-16 bg-[#061f3f]" />
      </div>
      <Link
        href="/notices"
        className="mt-7 flex items-center gap-3 text-[15px] font-semibold text-slate-700 transition duration-300 hover:text-[#061f3f]"
      >
        <span className="h-4 w-4 rounded-[3px] border border-slate-400 bg-yellow-300 shadow-inner" aria-hidden="true" />
        All Notices
        <span className="ml-auto text-xs font-black text-slate-400">{noticesCount}</span>
      </Link>
      {filters.map((group) => (
        <div key={group.key} className="mt-8">
          <h4 className="font-serif text-lg font-bold tracking-normal text-[#061f3f]">
            {group.label}
          </h4>
          <div className="mt-4 grid gap-3">
            {group.values.map((value) => (
              <Link
                key={value}
                href={`/notices?${group.key}=${encodeURIComponent(value)}`}
                className="group/filter flex items-start gap-3 text-[15px] font-medium leading-6 text-slate-700 transition duration-300 hover:text-[#061f3f]"
              >
                <span className="mt-1 h-4 w-4 shrink-0 rounded-[3px] border border-slate-400 transition duration-300 group-hover/filter:border-yellow-400 group-hover/filter:bg-yellow-300" aria-hidden="true" />
                <span>{value}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

function NoticeReferenceCard({ notice }: Readonly<{ notice: Notice }>) {
  const noticeSummary = getNoticeSummary(notice, 155);
  const href = getNoticeHref(notice);
  const isExternal = isExternalNoticeHref(href);

  return (
    <article className="group grid overflow-hidden rounded-[12px] bg-white shadow-[0_18px_48px_rgba(2,6,23,0.07)] ring-1 ring-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_68px_rgba(2,6,23,0.12)] lg:min-h-[210px] lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px]">
      <NoticeCardImage notice={notice} />
      <div className="flex min-w-0 flex-col p-6 sm:p-7 lg:order-1 lg:p-8">
        <NoticeMeta notice={notice} />
        <h3 className="mt-3 font-serif text-[1.55rem] font-bold leading-[1.16] tracking-normal text-[#061f3f] transition duration-300 group-hover:text-blue-900 sm:text-[1.75rem]">
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="transition duration-300 hover:text-blue-800"
          >
            {notice.title}
          </a>
        </h3>
        {noticeSummary ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
            {noticeSummary}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center text-sm font-black text-[#061f3f] underline decoration-[#061f3f]/30 underline-offset-4 transition duration-300 hover:-translate-y-0.5 hover:text-blue-800 hover:decoration-yellow-400"
          >
            Read More
            <span className="ml-2 h-1 w-1 rounded-full bg-current transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            <span className="ml-1 h-1 w-1 rounded-full bg-current transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
          </a>
          {notice.attachment_path ? <NoticeIndicator label="Attachment" /> : null}
          {notice.video_url ? <NoticeIndicator label="Video" /> : null}
        </div>
      </div>
    </article>
  );
}

function NoticeCardImage({ notice }: Readonly<{ notice: Notice }>) {
  const imageUrl = getCmsAssetUrl(notice.featured_image_path);

  return (
    <div className="order-first overflow-hidden p-3 pb-0 lg:order-2 lg:p-3 lg:pl-0">
      <div
        className="h-full min-h-[220px] rounded-[10px] bg-[#061f3f] bg-cover bg-center transition duration-700 group-hover:scale-[1.025] lg:min-h-0"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : "radial-gradient(circle at 30% 18%, rgba(250,204,21,0.28), transparent 28%), linear-gradient(135deg,#061f3f,#1d4ed8 58%,#dbeafe)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

function NoticeIndicator({ label }: Readonly<{ label: string }>) {
  return (
    <span className="inline-flex items-center rounded-full bg-yellow-300/30 px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-[#061f3f] ring-1 ring-yellow-300/60">
      {label}
    </span>
  );
}

function getNoticeSummary(notice: Notice, limit = 140): string | null {
  return (
    notice.excerpt ??
    getTextPreview(notice.body, limit) ??
    getTextPreview(notice.meta_description, limit)
  );
}

function NoticeMeta({
  notice,
}: Readonly<{
  notice: Notice;
}>) {
  const values = [
    notice.category,
    notice.audience,
    formatDate(notice.published_at),
  ].filter(Boolean);

  if (values.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2 text-sm font-semibold text-slate-600">
      {uniqueValues(values as string[]).map((value) => (
        <li key={value} className="rounded-[5px] border border-slate-200 bg-white px-3 py-1 leading-5">
          {value}
        </li>
      ))}
    </ul>
  );
}

function getNoticeFilterGroups(notices: Notice[]): NoticeFilterGroup[] {
  const categories = getNoticeFilterValues(notices.map((notice) => notice.category));
  const audiences = getNoticeFilterValues(notices.map((notice) => notice.audience));

  return [
    categories.length > 0 ? { key: "category" as const, label: "Categories", values: categories } : null,
    audiences.length > 0 ? { key: "audience" as const, label: "Audiences", values: audiences } : null,
  ].filter((group): group is NoticeFilterGroup => group !== null);
}

function getNoticeFilterValues(values: Array<string | null | undefined>): string[] {
  return uniqueValues(
    values
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value)),
  ).slice(0, 6);
}

function getNoticeHref(notice: Notice): string {
  return notice.external_link?.trim() || `/notices/${notice.slug}`;
}

function isExternalNoticeHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function ChairmanMessageSection({
  section,
}: Readonly<{
  section: HomepageSection;
}>) {
  const photoUrl = getCmsAssetUrl(section.image_path);
  const signatureUrl = getCmsAssetUrl(
    getMetadataText(section.metadata, ["signature_image", "signature_path"]) ?? null,
  );
  const chairmanName = getMetadataText(section.metadata, ["chairman_name", "name"]);
  const chairmanDesignation = getMetadataText(section.metadata, [
    "chairman_designation",
    "designation",
    "role",
  ]);
  const quoteLabel = getMetadataText(section.metadata, ["quote_label"]);
  const title = section.title?.trim() || "Message from the Chairman";
  const eyebrow = section.subtitle?.trim() || "Chairman Message";
  const message = getTextPreview(section.content, 620);
  const hasAction = Boolean(section.button_text && section.button_url);
  const hasCmsContent = Boolean(
    section.title ||
      section.subtitle ||
      section.content ||
      section.image_path ||
      chairmanName ||
      chairmanDesignation ||
      signatureUrl ||
      hasAction,
  );

  if (!hasCmsContent) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f3ea] py-16 sm:py-20 lg:py-24">
      <Container className="relative">
        <div className={`grid items-center gap-8 lg:gap-10 ${photoUrl ? "lg:grid-cols-[0.84fr_1.16fr]" : ""}`}>
          {photoUrl ? (
            <div className="relative mx-auto w-full max-w-[470px] lg:max-w-none">
              <div
                className="absolute -left-4 top-8 h-24 w-24 rounded-[12px] bg-yellow-300/80 shadow-[0_18px_44px_rgba(202,138,4,0.18)] sm:-left-5"
                aria-hidden="true"
              />
              <div
                className="absolute -right-4 bottom-8 h-28 w-28 rounded-full border-[18px] border-[#061f3f]/10"
                aria-hidden="true"
              />
              <figure className="relative overflow-hidden rounded-[16px] bg-[#061f3f] p-3 shadow-[0_24px_68px_rgba(2,6,23,0.16)]">
                <div
                  className="aspect-[4/5] rounded-[10px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${photoUrl})` }}
                  aria-label={chairmanName ?? title}
                  role="img"
                />
              </figure>
            </div>
          ) : null}

          <div className="relative overflow-hidden rounded-[16px] bg-white p-7 shadow-[0_20px_58px_rgba(2,6,23,0.08)] ring-1 ring-slate-200/70 sm:p-9 lg:p-11">
            <div
              className="absolute right-6 top-6 font-serif text-8xl font-bold leading-none text-[#061f3f]/[0.06] sm:text-9xl"
              aria-hidden="true"
            >
              &quot;
            </div>
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-12 bg-yellow-400" aria-hidden="true" />
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                  {eyebrow}
                </p>
              </div>
              <h2 className="max-w-2xl font-serif text-[clamp(2.15rem,6vw,3.35rem)] font-bold leading-[1.06] tracking-normal text-[#061f3f]">
                {title}
              </h2>
              {quoteLabel ? (
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-yellow-700">
                  {quoteLabel}
                </p>
              ) : null}
              {message ? (
                <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-600 sm:text-[1.04rem]">
                  {message}
                </p>
              ) : null}

              {(chairmanName || chairmanDesignation || signatureUrl) ? (
                <div className="mt-7 border-l-4 border-yellow-400 pl-5">
                  {signatureUrl ? (
                    <div
                      className="mb-4 h-12 max-w-[180px] bg-contain bg-left bg-no-repeat"
                      style={{ backgroundImage: `url(${signatureUrl})` }}
                      aria-label={chairmanName ? `${chairmanName} signature` : "Signature"}
                      role="img"
                    />
                  ) : null}
                  {chairmanName ? (
                    <h3 className="font-serif text-2xl font-bold leading-tight tracking-normal text-[#061f3f]">
                      {chairmanName}
                    </h3>
                  ) : null}
                  {chairmanDesignation ? (
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      {chairmanDesignation}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {section.button_text && section.button_url ? (
                <div className="mt-8">
                  <a
                    href={section.button_url}
                    className="group inline-flex items-center rounded-[6px] bg-[#061f3f] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[0_14px_34px_rgba(2,6,23,0.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-400 hover:text-[#061f3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
                  >
                    {section.button_text}
                    <span className="ml-3 h-px w-6 bg-current transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function OistLabSection({
  section,
}: Readonly<{
  section: HomepageSection;
}>) {
  const galleryImages = getHomepageSectionGalleryImages(section);
  const images = getOistLabImages(section, galleryImages);

  if (images.length === 0) {
    return null;
  }

  return (
    <OistLabShowcase
      images={images}
      showThumbnails={galleryImages.length > 0 && images.length > 1}
      title={section.title}
    />
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

type AboutFeatureItem = {
  title: string;
  description?: string;
};

function getOistLabImages(
  section: HomepageSection,
  galleryImages: string[],
): OistLabImage[] {
  const captions = getHomepageSectionGalleryCaptions(section);
  const imagePaths = uniqueValues(
    [section.image_path, ...galleryImages]
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean),
  );

  return imagePaths
    .map((path, index): OistLabImage | null => {
      const src = getCmsAssetUrl(path);

      if (!src) {
        return null;
      }

      const caption = captions[index]?.trim();
      const title = section.title?.trim();

      return {
        src,
        alt: caption || title || `Lab image ${index + 1}`,
        caption: caption || undefined,
      };
    })
    .filter((image): image is OistLabImage => image !== null);
}

function getHomepageSectionGalleryImages(section: HomepageSection): string[] {
  const rawImages =
    section.metadata.gallery_images ??
    section.metadata.images ??
    section.metadata.media_images;

  if (Array.isArray(rawImages)) {
    return rawImages
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);
  }

  if (typeof rawImages === "string" && rawImages.trim().length > 0) {
    return rawImages
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return [];
}

function getHomepageSectionGalleryCaptions(section: HomepageSection): string[] {
  const rawCaptions =
    section.metadata.gallery_captions ??
    section.metadata.captions ??
    section.metadata.image_captions;

  if (Array.isArray(rawCaptions)) {
    return rawCaptions
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean);
  }

  if (typeof rawCaptions === "string" && rawCaptions.trim().length > 0) {
    return rawCaptions
      .split(/\r?\n|\|/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return [];
}

function getHomepageSectionExternalVideoUrl(section: HomepageSection): string | null {
  return (
    getMetadataText(section.metadata, ["video_url", "youtube_url", "embed_url", "external_video_url"]) ??
    null
  );
}

function getAboutFeatureItems(section: HomepageSection): AboutFeatureItem[] {
  const rawItems =
    section.metadata.features ??
    section.metadata.feature_list ??
    section.metadata.bullets ??
    section.metadata.items;

  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .map((item): AboutFeatureItem | null => {
      if (typeof item === "string" && item.trim().length > 0) {
        return { title: item.trim() };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const title = getMetadataText(record, ["title", "label", "heading", "name", "text"]);

      if (!title) {
        return null;
      }

      return {
        title,
        description: getMetadataText(record, ["description", "body", "content", "summary"]),
      };
    })
    .filter((item): item is AboutFeatureItem => item !== null);
}

function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);

  return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : null;
}

function getYouTubeThumbnailUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);

  return videoId ? `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg` : null;
}

function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      videoId = parsedUrl.searchParams.get("v");

      if (!videoId && parsedUrl.pathname.startsWith("/embed/")) {
        videoId = parsedUrl.pathname.split("/").filter(Boolean)[1] ?? null;
      }

      if (!videoId && parsedUrl.pathname.startsWith("/shorts/")) {
        videoId = parsedUrl.pathname.split("/").filter(Boolean)[1] ?? null;
      }
    }

    return videoId;
  } catch {
    return null;
  }
}

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
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

function getHomepageSectionByKey(
  sections: HomepageSection[],
  keys: string[],
): HomepageSection | null {
  const normalizedKeys = keys.map(normalizeSectionKey);

  return (
    sections.find((section) => normalizedKeys.includes(normalizeSectionKey(section.key))) ?? null
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
