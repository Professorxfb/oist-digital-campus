import Link from "next/link";
import { Container } from "@/components/public-site/Container";
import { CTAButton } from "@/components/public-site/CTAButton";
import { ResponsiveMenu } from "@/components/public-site/ResponsiveMenu";
import { getCmsAssetUrl } from "@/lib/cms-display";
import type { MenuItem, SiteSetting } from "@/types/cms";

export function SiteHeader({
  settings,
  menuItems,
}: Readonly<{
  settings: SiteSetting;
  menuItems: MenuItem[];
}>) {
  const logoUrl = getCmsAssetUrl(settings.logo_path);
  const title = settings.site_title ?? settings.institute_name ?? "Campus Website";
  const admissionAction =
    settings.is_admission_open &&
    settings.admission_cta_text &&
    settings.admission_cta_url
      ? {
          href: settings.admission_cta_url,
          label: settings.admission_cta_text,
        }
      : null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <Container>
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            {logoUrl ? (
              <span
                className="h-12 w-12 shrink-0 rounded-md border border-slate-200 bg-white bg-contain bg-center bg-no-repeat shadow-sm"
                style={{ backgroundImage: `url(${logoUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <span
                className="h-12 w-12 shrink-0 rounded-md bg-[linear-gradient(135deg,#1d4ed8,#0f766e)]"
                aria-hidden="true"
              />
            )}
            <span className="min-w-0">
              <span className="block truncate text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
                {title}
              </span>
              {settings.site_tagline ? (
                <span className="mt-0.5 hidden truncate text-xs font-medium text-slate-500 sm:block">
                  {settings.site_tagline}
                </span>
              ) : null}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ResponsiveMenu items={menuItems} label="Menu" action={admissionAction} />
            <a
              className="hidden min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:inline-flex"
              href="/search"
              aria-label="Search public content"
            >
              Search
            </a>
            {admissionAction ? (
              <CTAButton
                href={admissionAction.href}
                className="hidden min-h-10 px-4 py-2 lg:inline-flex"
              >
                {admissionAction.label}
              </CTAButton>
            ) : null}
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:hidden"
              href="/search"
              aria-label="Search public content"
            >
              Search
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
