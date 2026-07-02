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
  const title = settings.site_title ?? settings.institute_name ?? "OIST Digital Campus";
  const brandInitial = title.trim().charAt(0).toUpperCase() || "O";
  const currentYear = new Date().getFullYear();
  const contactItems: FooterContactItem[] = [
    { label: "Address", value: settings.address, href: null, icon: "location" as const },
    {
      label: "Phone",
      value: settings.primary_phone,
      href: settings.primary_phone ? `tel:${settings.primary_phone}` : null,
      icon: "phone" as const,
    },
    {
      label: "Secondary",
      value: settings.secondary_phone,
      href: settings.secondary_phone ? `tel:${settings.secondary_phone}` : null,
      icon: "phone" as const,
    },
    {
      label: "Email",
      value: settings.email,
      href: settings.email ? `mailto:${settings.email}` : null,
      icon: "email" as const,
    },
  ]
    .filter((item) => Boolean(item.value))
    .map((item) => ({
      ...item,
      value: item.value ?? "",
    }));
  const socialLinks = [
    { label: "Facebook", href: settings.facebook_url, icon: "facebook" as const },
    { label: "YouTube", href: settings.youtube_url, icon: "youtube" as const },
    { label: "LinkedIn", href: settings.linkedin_url, icon: "linkedin" as const },
    {
      label: "WhatsApp",
      href: settings.whatsapp_number
        ? `https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`
        : null,
      icon: "whatsapp" as const,
    },
  ].filter((item): item is { label: string; href: string; icon: SocialIcon } => Boolean(item.href));
  const campusLinks = footerMenuItems.length > 0 ? footerMenuItems : defaultCampusLinks;
  const usefulLinks = quickLinks.length > 0 ? quickLinks : defaultUsefulLinks;

  return (
    <footer className="relative overflow-hidden bg-[#061f3f] text-white">
      <div className="absolute bottom-14 right-10 hidden h-32 w-32 border border-white/10 lg:block" aria-hidden="true" />
      <div className="absolute bottom-28 right-20 hidden h-24 w-24 rotate-45 border border-white/10 lg:block" aria-hidden="true" />
      <Container className="relative py-14 sm:py-16 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.45fr_0.72fr_0.72fr_0.82fr] lg:gap-14">
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <span
                  className="h-16 w-16 shrink-0 bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${logoUrl})` }}
                  aria-hidden="true"
                />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-yellow-300/35 bg-yellow-300 text-xl font-black text-[#061f3f]" aria-hidden="true">
                  {brandInitial}
                </span>
              )}
              <div className="min-w-0">
                {settings.site_tagline ? (
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-100">
                    {settings.site_tagline}
                  </p>
                ) : null}
                <p className="mt-1 font-serif text-[clamp(1.65rem,5vw,2.2rem)] font-bold leading-tight tracking-normal">
                  {title}
                </p>
              </div>
            </div>
            {contactItems.length > 0 ? (
              <ul className="mt-7 grid max-w-[680px] gap-4 text-sm text-blue-100 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {contactItems.map((item) => (
                  <li key={`${item.label}-${item.value}`} className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-yellow-300 ring-1 ring-white/10" aria-hidden="true">
                        {renderFooterIcon(item.icon)}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif text-[15px] font-bold leading-5 text-white">
                        {item.label}
                      </span>
                      {item.href ? (
                        <a className="mt-1 block max-w-full whitespace-nowrap leading-6 text-blue-100 transition duration-300 hover:text-yellow-300 max-sm:whitespace-normal max-sm:break-words" href={item.href}>
                          {item.value}
                        </a>
                      ) : (
                        <span className="mt-1 block leading-6 text-blue-100 break-words">{item.value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            {socialLinks.length > 0 ? (
              <div className="mt-9 flex flex-wrap items-center gap-2">
                <span className="mr-2 text-sm font-black text-white">Social Link</span>
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-[#074673] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-[#061f3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    {renderSocialIcon(link.icon)}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <FooterLinkGroup title="Our Campus" items={campusLinks} />
          <FooterLinkGroup title="Useful Links" items={usefulLinks} />
          <PortalLinks />
        </div>

        <div className="mt-12 border-t border-white/10 pt-7 text-center text-sm font-semibold text-blue-100">
          <p>&copy; {currentYear} OIST Digital Campus. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

type FooterIcon = "email" | "phone" | "location";
type SocialIcon = "facebook" | "youtube" | "linkedin" | "whatsapp";
type FooterContactItem = {
  label: string;
  value: string | null;
  href: string | null;
  icon: FooterIcon;
};

const defaultCampusLinks: MenuItem[] = [
  { label: "About OIST", url: "/about", target: "_self", sort_order: 0, children: [] },
  { label: "Departments", url: "/departments", target: "_self", sort_order: 1, children: [] },
  { label: "Campus Life", url: "/campus-life", target: "_self", sort_order: 2, children: [] },
  { label: "Facilities", url: "/facilities", target: "_self", sort_order: 3, children: [] },
];

const defaultUsefulLinks: MenuItem[] = [
  { label: "Notices", url: "/notices", target: "_self", sort_order: 0, children: [] },
  { label: "News", url: "/news", target: "_self", sort_order: 1, children: [] },
  { label: "Events", url: "/events", target: "_self", sort_order: 2, children: [] },
  { label: "Scholarships", url: "/scholarships", target: "_self", sort_order: 3, children: [] },
  { label: "Contact", url: "/contact", target: "_self", sort_order: 4, children: [] },
];

const portalLinks: MenuItem[] = [
  { label: "Student Login", url: "/student-portal", target: "_self", sort_order: 0, children: [] },
  { label: "Faculty Login", url: "/faculty-portal", target: "_self", sort_order: 1, children: [] },
  { label: "Staff Login", url: "/staff-portal", target: "_self", sort_order: 2, children: [] },
];

function FooterLinkGroup({
  title,
  items,
}: Readonly<{
  title: string;
  items: MenuItem[];
}>) {
  return (
    <div className="min-w-0">
      <h2 className="font-serif text-[clamp(1.45rem,4vw,1.7rem)] font-bold leading-tight text-white">
        {title}
      </h2>
      <div className="mt-4 h-px w-16 bg-white" aria-hidden="true" />
      {items.length > 0 ? (
        <ul className="mt-7 space-y-4 text-base">
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

function PortalLinks() {
  return (
    <div className="min-w-0">
      <h2 className="font-serif text-[clamp(1.45rem,4vw,1.7rem)] font-bold leading-tight text-white">
        Portals
      </h2>
      <div className="mt-4 h-px w-16 bg-white" aria-hidden="true" />
      <div className="mt-7 grid gap-3">
        {portalLinks.map((item) => (
          <a
            key={item.label}
            href={item.url}
            className="btn-public-navy w-full justify-between px-5"
          >
            <span>{item.label}</span>
            <span className="btn-public-dot" aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
}

function renderFooterIcon(icon: FooterIcon): React.ReactNode {
  switch (icon) {
    case "email":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 6h16v12H4V6Z" />
          <path d="m4.5 7 7.5 6 7.5-6" />
        </svg>
      );
    case "phone":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M8.8 5.2 6.9 3.3 4.4 5.8c-.8.8-.8 2.1-.2 3.3 2.2 4.8 5.9 8.5 10.7 10.7 1.2.6 2.5.6 3.3-.2l2.5-2.5-1.9-1.9c-.8-.8-2-.9-2.9-.3l-1 .7c-2.7-1.4-5.1-3.8-6.5-6.5l.7-1c.6-.9.5-2.1-.3-2.9Z" />
        </svg>
      );
    case "location":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" />
          <path d="M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
        </svg>
      );
  }
}

function renderSocialIcon(icon: SocialIcon): React.ReactNode {
  switch (icon) {
    case "facebook":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2.4c-.8-.1-1.6-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.3v2H7.6V12h2.8v9.8H14V12h2.8l.5-3.5H14Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21.6 7.1a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.4a2.7 2.7 0 0 0-1.9 1.9C2 8.8 2 12 2 12s0 3.2.4 4.9a2.7 2.7 0 0 0 1.9 1.9c1.7.4 7.7.4 7.7.4s6 0 7.7-.4a2.7 2.7 0 0 0 1.9-1.9c.4-1.7.4-4.9.4-4.9s0-3.2-.4-4.9ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.9 8.9H3.4v11.2h3.5V8.9ZM5.2 3.4a2 2 0 1 0 0 4.1 2 2 0 0 0 0-4.1Zm15.4 10.5c0-3.1-1.7-5.2-4.5-5.2-1.8 0-2.9 1-3.4 1.8V8.9H9.3v11.2h3.5v-6c0-1.5.8-2.4 2.1-2.4 1.2 0 2 .8 2 2.5v5.9h3.6v-6.2Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5A9.4 9.4 0 0 0 4 16.9l-1 3.8 3.9-1A9.5 9.5 0 1 0 12 2.5Zm5.5 13.3c-.2.6-1.3 1.2-1.8 1.3-.5.1-1.1.2-3.7-.9-3.1-1.3-5.1-4.5-5.2-4.7-.2-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .5 0 .7.5l.9 2.1c.1.3.1.5 0 .7l-.4.6c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.5-.3.8-.2l2 .9c.3.2.6.3.7.5.1.1.1.8-.1 1.4Z" />
        </svg>
      );
  }
}
