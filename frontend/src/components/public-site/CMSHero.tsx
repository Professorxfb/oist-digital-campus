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

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={
          imageUrl
            ? {
                backgroundImage: `linear-gradient(90deg, rgba(2, 6, 23, 0.92), rgba(15, 23, 42, 0.55)), url(${imageUrl})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : undefined
        }
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,116,144,0.35),rgba(30,64,175,0.18)_45%,rgba(15,23,42,0.85))]" />
      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-200">
            Public Website
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
            {subtitle}
          </p>
          {heroSection?.button_text && heroSection.button_url ? (
            <div className="mt-8">
              <CTAButton href={heroSection.button_url}>{heroSection.button_text}</CTAButton>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
