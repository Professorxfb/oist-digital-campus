import { Container } from "@/components/public-site/Container";
import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import type { HomepageSection } from "@/types/cms";

export function CMSHero({
  heroSection,
}: Readonly<{
  heroSection: HomepageSection | null;
}>) {
  if (!heroSection?.title) {
    return null;
  }

  const description = getTextPreview(heroSection.content, 220);
  const imageUrl = getCmsAssetUrl(heroSection?.image_path);
  const videoUrl = getCmsAssetUrl(heroSection?.video_path);
  const ctaLabel = heroSection.button_text ?? (heroSection.button_url ? "Read More" : null);

  return (
    <section className="relative min-h-[760px] overflow-hidden bg-[#06142d] text-white lg:min-h-[940px]">
      <div
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.98),rgba(8,47,73,0.84)_48%,rgba(30,64,175,0.62))]"
        aria-hidden="true"
      />
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      ) : null}
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : null}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,30,57,0.96),rgba(3,30,57,0.78)_43%,rgba(3,30,57,0.38)_68%,rgba(3,30,57,0.5)),linear-gradient(180deg,rgba(2,6,23,0.2),rgba(2,6,23,0.22))]"
        aria-hidden="true"
      />
      {!imageUrl && !videoUrl ? (
        <div
          className="absolute inset-0 bg-[linear-gradient(135deg,rgba(30,64,175,0.28),transparent_45%),radial-gradient(circle_at_82%_28%,rgba(250,204,21,0.15),transparent_24%),radial-gradient(circle_at_75%_72%,rgba(14,165,233,0.16),transparent_26%)]"
          aria-hidden="true"
        />
      ) : null}
      <Container className="relative flex min-h-[760px] items-center pb-44 pt-40 sm:pt-48 lg:min-h-[940px] lg:pb-72 lg:pt-56">
        <div className="max-w-4xl">
          {heroSection.subtitle ? (
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300 sm:text-sm">
              {heroSection.subtitle}
            </p>
          ) : null}
          <h1 className="mt-8 max-w-4xl font-serif text-[clamp(4rem,8vw,7.8rem)] font-semibold leading-[0.98] text-white">
            {heroSection.title}
          </h1>
          {description ? (
            <p className="mt-7 max-w-2xl text-base font-semibold leading-8 text-blue-50 sm:text-xl">
              {description}
            </p>
          ) : null}
          {ctaLabel && heroSection.button_url ? (
            <div className="mt-10">
              <CTAButton href={heroSection.button_url} className="min-h-14 px-8 py-3">
                {ctaLabel}
              </CTAButton>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
