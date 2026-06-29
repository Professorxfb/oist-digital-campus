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
  const ctaLabel = heroSection.button_text ?? "View Our Programs";
  const ctaUrl = heroSection.button_url ?? "/departments";

  return (
    <section className="relative min-h-[620px] overflow-hidden bg-[#06142d] text-white sm:min-h-[680px] lg:min-h-[740px] xl:min-h-[760px]">
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
      <Container className="relative flex min-h-[620px] items-center pb-24 pt-32 sm:min-h-[680px] sm:pb-32 sm:pt-40 lg:min-h-[740px] lg:pb-40 lg:pt-44 xl:min-h-[760px]">
        <div className="max-w-[760px]">
          {heroSection.subtitle ? (
            <p className="max-w-[650px] text-[10px] font-black uppercase tracking-[0.16em] text-yellow-300 sm:text-xs lg:text-sm">
              {heroSection.subtitle}
            </p>
          ) : null}
          <h1 className="mt-6 max-w-[760px] break-words font-serif text-[clamp(2.625rem,11vw,3rem)] font-semibold leading-[1.02] text-white sm:mt-8 sm:text-[clamp(3.75rem,7vw,4.25rem)] sm:leading-[0.98] lg:text-[clamp(4.75rem,4.6vw,5.25rem)]">
            {heroSection.title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-sm font-medium leading-7 text-blue-50 sm:text-base lg:text-lg">
              {description}
            </p>
          ) : null}
          {ctaLabel ? (
            <div className="mt-8 sm:mt-9">
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
