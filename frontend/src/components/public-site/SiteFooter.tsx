import { Container } from "@/components/public-site/Container";
import { getCmsAssetUrl } from "@/lib/cms-display";
import type { MenuItem, SiteSetting } from "@/types/cms";

export function SiteFooter({
  settings,
  footerMenuItems,
  quickLinks,
}: Readonly<{
  settings: SiteSetting;
  footerMenuItems: MenuItem[];
  quickLinks: MenuItem[];
}>) {
  const logoUrl = getCmsAssetUrl(settings.dark_logo_path ?? settings.logo_path);
  const title = settings.site_title ?? settings.institute_name ?? "Campus Website";
  const contactItems = [
    settings.address,
    settings.primary_phone,
    settings.secondary_phone,
    settings.email,
  ].filter(Boolean);

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <span
                  className="h-12 w-12 rounded-md bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${logoUrl})` }}
                  aria-hidden="true"
                />
              ) : null}
              <p className="text-lg font-semibold">{title}</p>
            </div>
            {settings.footer_text ? (
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                {settings.footer_text}
              </p>
            ) : null}
            {contactItems.length > 0 ? (
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                {contactItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>

          <FooterLinkGroup title="Footer Menu" items={footerMenuItems} />
          <FooterLinkGroup title="Quick Links" items={quickLinks} />
        </div>
      </Container>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  items,
}: Readonly<{
  title: string;
  items: MenuItem[];
}>) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-300">
        {title}
      </h2>
      {items.length > 0 ? (
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <li key={`${item.label}-${item.url}`}>
              <a
                className="text-slate-300 transition-colors hover:text-white"
                href={item.url}
                target={item.target === "_blank" ? "_blank" : undefined}
                rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-slate-400">Links will appear here when published.</p>
      )}
    </div>
  );
}
