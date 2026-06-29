import Link from "next/link";
import { Container } from "@/components/public-site/Container";
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

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <Container>
        <div className="flex min-h-20 items-center justify-between gap-5">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            {logoUrl ? (
              <span
                className="h-12 w-12 shrink-0 rounded-md bg-contain bg-center bg-no-repeat"
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
              <span className="block truncate text-base font-semibold tracking-tight text-slate-950">
                {title}
              </span>
              {settings.site_tagline ? (
                <span className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">
                  {settings.site_tagline}
                </span>
              ) : null}
            </span>
          </Link>
          <ResponsiveMenu items={menuItems} label="Navigation" />
        </div>
      </Container>
    </header>
  );
}
