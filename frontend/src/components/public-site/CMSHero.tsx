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

  return (
    <section className="relative overflow-hidden bg-[#06142d] text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.16),transparent_28%),linear-gradient(120deg,rgba(2,6,23,0.96),rgba(8,47,73,0.82)_48%,rgba(30,64,175,0.62))]"
        aria-hidden="true"
      />
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      ) : null}
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : null}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.92),rgba(7,23,51,0.68)_54%,rgba(2,6,23,0.35))]"
        aria-hidden="true"
      />
      {!imageUrl && !videoUrl ? (
        <div
          className="absolute inset-0 bg-[linear-gradient(135deg,rgba(30,64,175,0.32),transparent_45%),radial-gradient(circle_at_82%_28%,rgba(250,204,21,0.18),transparent_24%),radial-gradient(circle_at_75%_72%,rgba(14,165,233,0.18),transparent_26%)]"
          aria-hidden="true"
        />
      ) : null}
      <Container className="relative py-20 sm:py-24 lg:py-32">
        <div className="max-w-4xl">
          {heroSection.subtitle ? (
            <p className="inline-flex rounded-full border border-yellow-300/40 bg-yellow-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-yellow-300">
              {heroSection.subtitle}
            </p>
          ) : null}
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {heroSection.title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-blue-50 sm:text-xl">
              {description}
            </p>
          ) : null}
          {heroSection?.button_text && heroSection.button_url ? (
            <div className="mt-9">
              <CTAButton href={heroSection.button_url}>
                {heroSection.button_text}
              </CTAButton>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
