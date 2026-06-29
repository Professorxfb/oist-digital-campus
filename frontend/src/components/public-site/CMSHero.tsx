import { Container } from "@/components/public-site/Container";
import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import type { HomepageSection, SiteSetting } from "@/types/cms";

export function CMSHero({
  heroSection,
  settings,
}: Readonly<{
  heroSection: HomepageSection | null;
  settings: SiteSetting;
}>) {
  const title =
    heroSection?.title ?? settings.site_title ?? settings.institute_name ?? "Campus Website";
  const subtitle =
    heroSection?.subtitle ??
    getTextPreview(heroSection?.content, 220) ??
    settings.site_tagline ??
    "Public content will appear here when it is published from the CMS.";
  const imageUrl = getCmsAssetUrl(heroSection?.image_path);
  const videoUrl = getCmsAssetUrl(heroSection?.video_path);

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.28),transparent_32%),linear-gradient(135deg,#020617,#0f2d5c_48%,#0f766e)]" aria-hidden="true" />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.82fr]">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-200">
              Public Website
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              {subtitle}
            </p>
            {heroSection?.button_text && heroSection.button_url ? (
              <div className="mt-8">
                <CTAButton href={heroSection.button_url} variant="secondary">
                  {heroSection.button_text}
                </CTAButton>
              </div>
            ) : null}
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-lg border border-white/15 bg-white/10 shadow-2xl shadow-slate-950/30">
            {videoUrl ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(14,165,233,0.18)_40%,rgba(20,184,166,0.26))]" aria-hidden="true" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.25))]" aria-hidden="true" />
            <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3" aria-hidden="true">
              <span className="h-2 rounded-full bg-white/75" />
              <span className="h-2 rounded-full bg-teal-200/80" />
              <span className="h-2 rounded-full bg-blue-200/80" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
