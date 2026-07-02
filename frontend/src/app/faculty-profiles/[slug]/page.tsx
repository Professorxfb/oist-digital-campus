import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/public-site/Container";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import { getFacultyProfileBySlug } from "@/services/cms";
import type { FacultyProfile } from "@/types/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

type FacultySocialLink = {
  label: string;
  href: string;
  icon: "facebook" | "linkedin" | "twitter" | "website";
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: profile } = await getFacultyProfileBySlug(slug);

  return createCmsMetadata({
    title: profile?.name ?? "Faculty Profile",
    description: profile?.short_bio ?? profile?.designation,
  });
}

export default async function FacultyProfileDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: profile } = await getFacultyProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const photoUrl = getCmsAssetUrl(profile.photo_url ?? profile.photo_path ?? null);
  const photoBackgroundImage = photoUrl
    ? `url(${photoUrl})`
    : "radial-gradient(circle at 30% 20%, rgba(250,204,21,0.24), transparent 28%), linear-gradient(135deg,#071733,#1d4ed8 58%,#e0f2fe)";
  const socialLinks = getFacultySocialLinks(profile);
  const aboutHtml = sanitizeCmsHtml(profile.detailed_bio);
  const aboutText = aboutHtml ? null : profile.short_bio;
  const qualifications = getTextLines(profile.qualifications);
  const researchInterests = getTextLines(profile.research_interests);
  const expertise = getTextLines(profile.expertise);
  const hasAcademicDetails =
    qualifications.length > 0 || researchInterests.length > 0 || expertise.length > 0;
  const hasContactDetails =
    Boolean(profile.email) ||
    Boolean(profile.phone) ||
    Boolean(profile.office_location) ||
    socialLinks.length > 0;

  return (
    <PublicSiteShell>
      <article>
        <section className="relative overflow-hidden border-b border-white/10 bg-[#071733] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(250,204,21,0.16),transparent_24%),linear-gradient(135deg,#020617,#071733_58%,#0a2a5e)]" aria-hidden="true" />
          <Container className="relative py-14 sm:py-20 lg:py-24">
            <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-blue-100" aria-label="Breadcrumb">
              <Link className="transition hover:text-yellow-300" href="/">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link className="transition hover:text-yellow-300" href="/faculty">
                Faculty Profiles
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-yellow-300">{profile.name}</span>
            </nav>
            <div className="mt-8 max-w-4xl">
              {profile.department?.name || profile.designation ? (
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                  {[profile.department?.name, profile.designation].filter(Boolean).join(" / ")}
                </p>
              ) : null}
              <h1 className="mt-3 font-serif text-[clamp(2.6rem,8vw,5.5rem)] font-bold leading-[1.02] tracking-normal text-white">
                {profile.name}
              </h1>
              {profile.short_bio ? (
                <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-blue-50 sm:text-lg">
                  {getTextPreview(profile.short_bio, 220)}
                </p>
              ) : null}
            </div>
          </Container>
        </section>

        <section className="bg-[#f7f3ea] py-12 sm:py-16 lg:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[360px_1fr] xl:grid-cols-[390px_1fr]">
              <aside className="lg:sticky lg:top-8 lg:self-start">
                <div className="overflow-hidden rounded-[18px] border border-white bg-white shadow-[0_22px_60px_rgba(2,6,23,0.09)]">
                  <div
                    className="aspect-[4/5] bg-cover bg-center"
                    style={{ backgroundImage: photoBackgroundImage }}
                    role="img"
                    aria-label={`${profile.name} profile photo`}
                  />
                  <div className="p-7 text-center">
                    <h2 className="font-serif text-3xl font-bold leading-tight text-[#061f3f]">
                      {profile.name}
                    </h2>
                    {profile.designation ? (
                      <p className="mt-2 text-base font-semibold leading-6 text-slate-600">
                        {profile.designation}
                      </p>
                    ) : null}
                    {profile.department?.name ? (
                      <p className="mt-2 text-sm font-black uppercase tracking-[0.13em] text-blue-800">
                        {profile.department.name}
                      </p>
                    ) : null}
                    {socialLinks.length > 0 ? (
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {socialLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#064c78] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-[#061f3f] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/70"
                            aria-label={`${profile.name} ${link.label}`}
                          >
                            {renderFacultySocialIcon(link.icon)}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </aside>

              <div className="min-w-0 space-y-7">
                {aboutHtml || aboutText ? (
                  <DetailPanel title="About / Introduction">
                    {aboutHtml ? (
                      <div
                        className="cms-rich-text text-base leading-8 text-slate-700 [&_a]:font-bold [&_a]:text-blue-800 [&_a:hover]:text-[#061f3f] [&_li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_strong]:text-slate-950 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
                        dangerouslySetInnerHTML={{ __html: aboutHtml }}
                      />
                    ) : (
                      <p className="text-base leading-8 text-slate-700">{aboutText}</p>
                    )}
                  </DetailPanel>
                ) : null}

                {hasAcademicDetails ? (
                  <DetailPanel title="Academic Details">
                    <div className="grid gap-6 xl:grid-cols-2">
                      <TextList title="Academic Qualifications" items={qualifications} />
                      <TextList title="Research Interests" items={researchInterests} />
                      <TextList title="Expertise" items={expertise} />
                    </div>
                  </DetailPanel>
                ) : null}

                {hasContactDetails ? (
                  <DetailPanel title="Contact Information">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {profile.email ? (
                        <ContactItem label="Email" href={`mailto:${profile.email}`} value={profile.email} />
                      ) : null}
                      {profile.phone ? (
                        <ContactItem label="Phone" href={`tel:${getPhoneHref(profile.phone)}`} value={profile.phone} />
                      ) : null}
                      {profile.office_location ? (
                        <ContactItem label="Office" value={profile.office_location} />
                      ) : null}
                      {profile.website_url ? (
                        <ContactItem label="Website" href={profile.website_url} value={profile.website_url} external />
                      ) : null}
                    </div>
                  </DetailPanel>
                ) : null}

                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-full bg-[#064c78] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-[#061f3f] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/70"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </article>
    </PublicSiteShell>
  );
}

function DetailPanel({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="rounded-[18px] border border-white bg-white p-6 shadow-[0_18px_48px_rgba(2,6,23,0.06)] sm:p-8">
      <h2 className="font-serif text-3xl font-bold leading-tight text-[#061f3f]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TextList({
  title,
  items,
}: Readonly<{
  title: string;
  items: string[];
}>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-sm font-black uppercase tracking-[0.14em] text-blue-900">
        {title}
      </h3>
      <ul className="mt-4 space-y-3 text-base leading-7 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-yellow-400" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactItem({
  label,
  value,
  href,
  external = false,
}: Readonly<{
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}>) {
  const content = (
    <>
      <span className="text-xs font-black uppercase tracking-[0.13em] text-blue-900">
        {label}
      </span>
      <span className="mt-2 block break-words text-base font-semibold leading-7 text-slate-700">
        {value}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="rounded-[12px] bg-[#f7f3ea] p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/70"
      >
        {content}
      </a>
    );
  }

  return <div className="rounded-[12px] bg-[#f7f3ea] p-5">{content}</div>;
}

function getTextLines(value?: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .replace(/<[^>]+>/g, "\n")
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function sanitizeCmsHtml(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src)=("|')\s*javascript:[^"']*\2/gi, "");

  return cleaned.trim().length > 0 ? cleaned : null;
}

function getPhoneHref(value: string): string {
  return value.replace(/[^\d+]/g, "");
}

function getFacultySocialLinks(profile: FacultyProfile): FacultySocialLink[] {
  return [
    profile.facebook_url
      ? { label: "Facebook profile", href: profile.facebook_url, icon: "facebook" as const }
      : null,
    profile.linkedin_url
      ? { label: "LinkedIn profile", href: profile.linkedin_url, icon: "linkedin" as const }
      : null,
    profile.twitter_url
      ? { label: "X profile", href: profile.twitter_url, icon: "twitter" as const }
      : null,
    profile.website_url
      ? { label: "website", href: profile.website_url, icon: "website" as const }
      : null,
  ].filter((link): link is FacultySocialLink => link !== null);
}

function renderFacultySocialIcon(icon: FacultySocialLink["icon"]): React.ReactNode {
  switch (icon) {
    case "facebook":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14 8.5V6.8c0-.8.5-1.3 1.4-1.3H17V2.4c-.8-.1-1.6-.2-2.4-.2-2.5 0-4.2 1.5-4.2 4.3v2H7.6V12h2.8v9.8H14V12h2.8l.5-3.5H14Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.9 8.9H3.4v11.2h3.5V8.9ZM5.2 3.4a2 2 0 1 0 0 4.1 2 2 0 0 0 0-4.1Zm15.4 10.5c0-3.1-1.7-5.2-4.5-5.2-1.8 0-2.9 1-3.4 1.8V8.9H9.3v11.2h3.5v-6c0-1.5.8-2.4 2.1-2.4 1.2 0 2 .8 2 2.5v5.9h3.6v-6.2Z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m15 10.6 6-7h-3.3l-4.2 4.9-3.4-4.9H3.4l6.3 9-6.5 7.8h3.3l4.8-5.7 4 5.7h6.7l-7-9.8Zm-2 2.4-1.4-1.9-3.7-5.2h1.5l3 4.2 1.4 1.9 4 5.7h-1.5L13 13Z" />
        </svg>
      );
    case "website":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.1 2.4 3.1 5.4 3.1 9s-1 6.6-3.1 9c-2.1-2.4-3.1-5.4-3.1-9s1-6.6 3.1-9Z" />
        </svg>
      );
  }

  return null;
}
