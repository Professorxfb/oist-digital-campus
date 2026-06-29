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
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#061f3f] text-white">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(250,204,21,0.16),transparent_24%),radial-gradient(circle_at_86%_10%,rgba(14,165,233,0.14),transparent_24%),linear-gradient(135deg,#020617,#061f3f_48%,#0a2a5e)]"
        aria-hidden="true"
      />
      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <span
                  className="h-14 w-14 shrink-0 rounded-2xl border border-white/10 bg-white bg-contain bg-center bg-no-repeat shadow-lg shadow-slate-950/20"
                  style={{ backgroundImage: `url(${logoUrl})` }}
                  aria-hidden="true"
                />
              ) : (
                <span className="h-14 w-14 shrink-0 rounded-2xl bg-[linear-gradient(135deg,#facc15,#1d4ed8_54%,#082f49)]" aria-hidden="true" />
              )}
              <p className="font-serif text-2xl font-bold tracking-normal">{title}</p>
            </div>
            {settings.footer_text ? (
              <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100">
                {settings.footer_text}
              </p>
            ) : null}
            {contactItems.length > 0 ? (
              <ul className="mt-7 space-y-3 text-sm text-blue-100">
                {contactItems.map((item) => (
                  <li key={item.label} className="leading-6">
                    <span className="mr-2 font-bold text-white">{item.label}:</span>
                    {item.href ? (
                      <a className="transition hover:text-yellow-300" href={item.href}>
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
              <div className="mt-7 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-blue-100 transition duration-300 hover:-translate-y-0.5 hover:border-yellow-300/70 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
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
          <FooterLinkGroup
            title="Portals"
            items={[
              {
                label: "Student Portal",
                url: "/student-portal",
                target: "_self",
                sort_order: 0,
                children: [],
              },
              {
                label: "Faculty Portal",
                url: "/faculty-portal",
                target: "_self",
                sort_order: 1,
                children: [],
              },
            ]}
          />
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
      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-yellow-300">
        {title}
      </h2>
      {items.length > 0 ? (
        <ul className="mt-6 space-y-3 text-sm">
          {items.map((item) => (
            <li key={`${item.label}-${item.url}`}>
              <a
                className="inline-flex text-blue-100 transition duration-300 hover:translate-x-1 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
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
        null
      )}
    </div>
  );
}
