import { Container } from "@/components/public-site/Container";
import { CTAButton } from "@/components/public-site/CTAButton";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getSiteSettings } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  const { data: settings } = await getSiteSettings();

  return createCmsMetadata({
    title: "Contact",
    description: settings.meta_description ?? settings.site_tagline,
    settings,
  });
}

export default async function ContactPage() {
  const { data: settings } = await getSiteSettings();
  const contactItems = [
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
    {
      label: "Address",
      value: settings.address,
      href: null,
    },
  ].filter((item) => item.value);
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
    <PublicSiteShell>
      <PageIntro
        eyebrow="Contact"
        title="Contact"
        description="Contact information from the CMS appears here."
      />
      <Container className="py-10 sm:py-14">
        {contactItems.length > 0 || socialLinks.length > 0 || settings.google_map_url ? (
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Contact Details
              </h2>
              {contactItems.length > 0 ? (
                <dl className="mt-6 divide-y divide-slate-100">
                  {contactItems.map((item) => (
                    <div
                      key={item.label}
                      className="grid gap-1 py-4 text-sm sm:grid-cols-[180px_1fr]"
                    >
                      <dt className="font-semibold text-slate-950">{item.label}</dt>
                      <dd className="leading-6 text-slate-600">
                        {item.href ? (
                          <a
                            className="text-blue-700 underline-offset-4 hover:underline"
                            href={item.href}
                          >
                            {item.value}
                          </a>
                        ) : (
                          item.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <div className="mt-6">
                  <EmptyState />
                </div>
              )}
            </section>

            <aside className="space-y-5">
              {settings.google_map_url ? (
                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                    Location
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    The map link is managed from the CMS.
                  </p>
                  <div className="mt-5">
                    <CTAButton
                      href={settings.google_map_url}
                      variant="secondary"
                      target="_blank"
                    >
                      Open Map
                    </CTAButton>
                  </div>
                </section>
              ) : null}

              {socialLinks.length > 0 ? (
                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                    Social Links
                  </h2>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {socialLinks.map((link) => (
                      <CTAButton
                        key={link.label}
                        href={link.href}
                        variant="subtle"
                        target="_blank"
                      >
                        {link.label}
                      </CTAButton>
                    ))}
                  </div>
                </section>
              ) : null}
            </aside>
          </div>
        ) : (
          <EmptyState />
        )}
      </Container>
    </PublicSiteShell>
  );
}
