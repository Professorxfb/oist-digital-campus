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
    { label: "Address", value: settings.address, href: null },
    {
      label: "Primary phone",
      value: settings.primary_phone,
      href: settings.primary_phone ? `tel:${settings.primary_phone}` : null,
    },
    {
      label: "Secondary phone",
      value: settings.secondary_phone,
      href: settings.secondary_phone ? `tel:${settings.secondary_phone}` : null,
    },
    {
      label: "Email",
      value: settings.email,
      href: settings.email ? `mailto:${settings.email}` : null,
    },
  ].filter(
    (item): item is { label: string; value: string; href: string | null } =>
      Boolean(item.value),
  );
  const socialLinks = [
    { label: "Facebook", href: settings.facebook_url },
    { label: "YouTube", href: settings.youtube_url },
    { label: "LinkedIn", href: settings.linkedin_url },
    {
      label: "WhatsApp",
      href: settings.whatsapp_number
        ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`
        : null,
    },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  return (
    <footer className="border-t border-slate-800 bg-[linear-gradient(135deg,#020617,#0f172a_55%,#0f2d5c)] text-white">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <span
                  className="h-12 w-12 shrink-0 rounded-md border border-white/10 bg-white/5 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${logoUrl})` }}
                  aria-hidden="true"
                />
              ) : (
                <span className="h-12 w-12 shrink-0 rounded-md bg-[linear-gradient(135deg,#1d4ed8,#0f766e)]" aria-hidden="true" />
              )}
              <p className="text-lg font-semibold tracking-tight">{title}</p>
            </div>
            {settings.footer_text ? (
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
                {settings.footer_text}
              </p>
            ) : null}
            {contactItems.length > 0 ? (
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {contactItems.map((item) => (
                  <li key={item.label} className="leading-6">
                    <span className="mr-2 font-semibold text-slate-100">{item.label}:</span>
                    {item.href ? (
                      <a className="hover:text-white" href={item.href}>
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            {socialLinks.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-teal-300/50 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
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
                className="text-slate-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
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
