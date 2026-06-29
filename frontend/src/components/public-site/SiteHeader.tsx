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
  const visibleMenuItems = removeSearchMenuItems(menuItems);
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071733]/95 text-white shadow-2xl shadow-slate-950/20 backdrop-blur">
      <Container>
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            {logoUrl ? (
              <span
                className="h-12 w-12 shrink-0 rounded-full border border-white/15 bg-white bg-contain bg-center bg-no-repeat shadow-sm"
                style={{ backgroundImage: `url(${logoUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <span
                className="h-12 w-12 shrink-0 rounded-full bg-[linear-gradient(135deg,#facc15,#1d4ed8_54%,#082f49)]"
                aria-hidden="true"
              />
            )}
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight text-white sm:text-lg">
                {title}
              </span>
              {settings.site_tagline ? (
                <span className="mt-0.5 hidden truncate text-xs font-semibold uppercase tracking-[0.16em] text-blue-100/80 sm:block">
                  {settings.site_tagline}
                </span>
              ) : null}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ResponsiveMenu
              items={visibleMenuItems}
              label="Menu"
              action={admissionAction}
              links={[
                { href: "/student-portal", label: "Student Portal" },
                { href: "/faculty-portal", label: "Faculty Portal" },
              ]}
            />
            <a
              className="hidden min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white transition hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 sm:inline-flex"
              href="/search"
              aria-label="Search public content"
            >
              Search
            </a>
            <a
              className="hidden min-h-10 items-center justify-center rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 lg:inline-flex"
              href="/student-portal"
            >
              Student Portal
            </a>
            <a
              className="hidden min-h-10 items-center justify-center rounded-full px-3 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 lg:inline-flex"
              href="/faculty-portal"
            >
              Faculty Portal
            </a>
            {admissionAction ? (
              <CTAButton
                href={admissionAction.href}
                className="hidden min-h-10 px-4 py-2 xl:inline-flex"
              >
                {admissionAction.label}
              </CTAButton>
            ) : null}
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 sm:hidden"
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

function removeSearchMenuItems(items: MenuItem[]): MenuItem[] {
  return items
    .filter((item) => {
      const label = item.label.trim().toLowerCase();
      const url = item.url.trim().toLowerCase();

      return label !== "search" && url !== "/search";
    })
    .map((item) => ({
      ...item,
      children: removeSearchMenuItems(item.children),
    }));
}
