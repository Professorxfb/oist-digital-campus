import { Container } from "@/components/public-site/Container";
import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import type { HeroSectionContent, HomepageSection } from "@/types/cms";

export function CMSHero({
  heroContent,
  heroSection,
}: Readonly<{
  heroContent: HeroSectionContent | null;
  heroSection: HomepageSection | null;
}>) {
  if (!heroSection || !heroContent?.title) {
    return null;
  }

  const description = getTextPreview(heroContent.content, 220);
  const imageUrl = getCmsAssetUrl(heroContent.hero_image_path ?? null);
  const videoUrl = getCmsAssetUrl(heroContent.video_path ?? null);
  const ctaLabel = heroContent.button_text;
  const ctaUrl = heroContent.button_url;

  return (
    <section
      className="relative min-h-[650px] overflow-hidden bg-[#06142d] text-white sm:min-h-[700px] lg:min-h-[770px] xl:min-h-[810px]"
      data-section="homepage-hero"
    >
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-[center_right] opacity-100"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      ) : null}
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover object-right opacity-100"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : null}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,22,50,0.72)_0%,rgba(3,22,50,0.64)_34%,rgba(3,22,50,0.32)_61%,rgba(3,22,50,0.06)_100%),linear-gradient(180deg,rgba(2,6,23,0.1),rgba(2,6,23,0.03))]"
        aria-hidden="true"
      />
      {!imageUrl && !videoUrl ? (
        <div
          className="absolute inset-0 bg-[linear-gradient(115deg,#031632,#062b55_48%,#0d3770),radial-gradient(circle_at_82%_28%,rgba(250,204,21,0.14),transparent_24%),radial-gradient(circle_at_75%_72%,rgba(14,165,233,0.14),transparent_26%)]"
          aria-hidden="true"
        />
      ) : null}
      <Container className="relative flex min-h-[650px] items-center pb-32 pt-32 sm:min-h-[700px] sm:pb-36 sm:pt-40 lg:min-h-[770px] lg:pb-44 lg:pt-44 xl:min-h-[810px]">
        <div className="max-w-[780px]">
          {heroContent.subtitle ? (
            <p className="hero-animate-eyebrow max-w-[650px] text-[10px] font-black uppercase tracking-[0.16em] text-yellow-300 sm:text-xs lg:text-[13px]">
              {heroContent.subtitle}
            </p>
          ) : null}
          <h1 className="hero-animate-title mt-5 max-w-[780px] break-words font-serif text-[clamp(2.85rem,11vw,3.55rem)] font-semibold leading-[0.98] text-white sm:mt-7 sm:text-[clamp(4rem,7vw,5.15rem)] sm:leading-[0.96] lg:text-[clamp(5rem,4.8vw,5.85rem)]">
            {heroContent.title}
          </h1>
          {description ? (
            <p className="hero-animate-body mt-6 max-w-2xl text-sm font-medium leading-7 text-blue-50 sm:text-base lg:text-[18px]">
              {description}
            </p>
          ) : null}
          {ctaLabel && ctaUrl ? (
            <div className="hero-animate-cta mt-8 sm:mt-9">
              <CTAButton href={ctaUrl} className="min-h-14 px-8 py-3">
                {ctaLabel}
              </CTAButton>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
