import Link from "next/link";
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
    <header className="absolute inset-x-0 top-0 z-50 pt-5 text-white sm:pt-7">
      <div className="mx-auto max-w-[1620px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[86px] items-center justify-between gap-4 rounded-[10px] bg-[#061f3f] px-4 py-4 shadow-2xl shadow-slate-950/30 sm:px-7">
          <Link className="flex min-w-0 shrink-0 items-center gap-3" href="/">
            {logoUrl ? (
              <span
                className="h-14 w-14 shrink-0 rounded-xl border border-white/15 bg-white bg-contain bg-center bg-no-repeat shadow-sm"
                style={{ backgroundImage: `url(${logoUrl})` }}
                aria-hidden="true"
              />
            ) : (
              <span
                className="h-14 w-14 shrink-0 rounded-xl bg-[linear-gradient(135deg,#ffcc00,#1d4ed8_54%,#082f49)]"
                aria-hidden="true"
              />
            )}
            <span className="min-w-0">
              <span className="block truncate text-base font-black leading-tight tracking-tight text-white sm:text-xl">
                {title}
              </span>
              {settings.site_tagline ? (
                <span className="mt-0.5 hidden max-w-56 truncate text-[11px] font-black uppercase tracking-[0.16em] text-blue-100/80 md:block">
                  {settings.site_tagline}
                </span>
              ) : null}
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center xl:flex">
            <ResponsiveMenu
              items={visibleMenuItems}
              label="Primary menu"
              variant="desktop"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
              href="/search"
              aria-label="Search public content"
            >
              <SearchIcon />
            </a>
            <span className="hidden h-8 w-px bg-white/20 sm:block" aria-hidden="true" />
            <ResponsiveMenu
              items={visibleMenuItems}
              label="Menu"
              action={admissionAction}
              links={[
                { href: "/student-portal", label: "Student Portal" },
                { href: "/faculty-portal", label: "Faculty Portal" },
              ]}
              settings={settings}
              variant="drawer"
            />
            {admissionAction ? (
              <CTAButton
                href={admissionAction.href}
                className="hidden min-h-12 px-7 py-3 text-sm xl:inline-flex"
              >
                {admissionAction.label}
              </CTAButton>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
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
