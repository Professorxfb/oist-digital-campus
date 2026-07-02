import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getCmsAssetUrl } from "@/lib/cms-display";
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

type ContactIcon = "email" | "phone" | "location" | "website";

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
  const profileImageBackground = buildProfileImageBackground(photoUrl);
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
    Boolean(profile.website_url);

  return (
    <PublicSiteShell>
      <article className="bg-[#f7f3ea]">
        <section className="relative overflow-hidden bg-[#082f55] text-white">
          <FacultyPageContainer className="relative pb-14 pt-[124px] sm:pb-16 sm:pt-[148px] lg:pb-[76px] lg:pt-[168px]">
            <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold leading-6 text-blue-100 sm:text-sm" aria-label="Breadcrumb">
              <Link className="transition hover:text-yellow-300" href="/">
                Home
              </Link>
              <span className="text-yellow-300" aria-hidden="true">/</span>
              <Link className="transition hover:text-yellow-300" href="/faculty">
                Faculty Profiles
              </Link>
              <span className="text-yellow-300" aria-hidden="true">/</span>
              <span className="text-white">{profile.name}</span>
            </nav>

            <div className="mt-5 max-w-[680px]">
              {profile.department?.name || profile.designation ? (
                <p className="text-xs font-black uppercase leading-5 tracking-[0.17em] text-yellow-300">
                  {[profile.department?.name, profile.designation].filter(Boolean).join(" / ")}
                </p>
              ) : null}
              <h1 className="mt-3 font-serif text-[clamp(2.375rem,4.8vw,4.15rem)] font-bold leading-[1.05] tracking-normal text-white">
                {profile.name}
              </h1>
              <div className="mt-5 h-px w-28 bg-gradient-to-r from-white via-white/70 to-yellow-300/70" aria-hidden="true" />
              {profile.short_bio ? (
                <p className="mt-5 max-w-[640px] text-base font-medium leading-8 text-blue-50 sm:text-[17px]">
                  {profile.short_bio}
                </p>
              ) : null}
            </div>
          </FacultyPageContainer>
        </section>

        <section className="pb-16 pt-12 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
          <FacultyPageContainer>
            <div className="grid items-start gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[380px_minmax(0,1fr)]">
              <aside className="lg:self-start">
                <div className="overflow-hidden rounded-[14px] bg-white p-3 shadow-[0_18px_50px_rgba(2,6,23,0.08)] ring-1 ring-slate-200/70">
                  <div
                    className="aspect-[4/3] rounded-[10px] bg-cover bg-center"
                    style={{ backgroundImage: profileImageBackground }}
                    role="img"
                    aria-label={`${profile.name} profile photo`}
                  />
                  <div className="px-4 pb-5 pt-6 text-center sm:px-6">
                    <h2 className="font-serif text-[1.65rem] font-bold leading-tight tracking-normal text-[#061f3f]">
                      {profile.name}
                    </h2>
                    {profile.designation ? (
                      <p className="mt-2 text-base font-medium leading-6 text-slate-600">
                        {profile.designation}
                      </p>
                    ) : null}
                    {profile.department?.name ? (
                      <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-blue-800">
                        {profile.department.name}
                      </p>
                    ) : null}
                    {socialLinks.length > 0 ? (
                      <div className="mt-5 flex flex-wrap justify-center gap-2">
                        {socialLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#064c78] text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300 hover:text-[#061f3f] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/70"
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

              <div className="min-w-0 space-y-6">
                {aboutHtml || aboutText ? (
                  <DetailPanel title="About / Introduction">
                    {aboutHtml ? (
                      <div
                        className="cms-rich-text text-[16px] leading-8 text-slate-700 [&_a]:font-bold [&_a]:text-blue-800 [&_a:hover]:text-[#061f3f] [&_li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:text-slate-950 [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
                        dangerouslySetInnerHTML={{ __html: aboutHtml }}
                      />
                    ) : (
                      <p className="text-[16px] leading-8 text-slate-700">{aboutText}</p>
                    )}
                  </DetailPanel>
                ) : null}

                {hasAcademicDetails ? (
                  <DetailPanel title="Academic Details">
                    <div className="grid gap-8 lg:grid-cols-2">
                      <TextList title="Academic Qualifications" items={qualifications} />
                      <TextList title="Research Interests" items={researchInterests} />
                    </div>
                    {expertise.length > 0 ? (
                      <section className="mt-8 border-t border-slate-200 pt-7">
                        <h3 className="font-serif text-2xl font-bold leading-tight text-[#061f3f]">
                          Expertise
                        </h3>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {expertise.map((item) => (
                            <span
                              key={item}
                              className="rounded-full bg-[#f7f3ea] px-4 py-2 text-sm font-bold text-blue-900 ring-1 ring-slate-200"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </section>
                    ) : null}
                  </DetailPanel>
                ) : null}

                {hasContactDetails ? (
                  <DetailPanel title="Contact Information">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {profile.email ? (
                        <ContactItem icon="email" label="Email" href={`mailto:${profile.email}`} value={profile.email} />
                      ) : null}
                      {profile.phone ? (
                        <ContactItem icon="phone" label="Phone" href={`tel:${getPhoneHref(profile.phone)}`} value={profile.phone} />
                      ) : null}
                      {profile.office_location ? (
                        <ContactItem icon="location" label="Office" value={profile.office_location} />
                      ) : null}
                      {profile.website_url ? (
                        <ContactItem icon="website" label="Website" href={profile.website_url} value={profile.website_url} external />
                      ) : null}
                    </div>
                  </DetailPanel>
                ) : null}
              </div>
            </div>
          </FacultyPageContainer>
        </section>
      </article>
    </PublicSiteShell>
  );
}

function FacultyPageContainer({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div className={`mx-auto w-full max-w-[1220px] px-5 sm:px-6 lg:px-8 2xl:max-w-[1660px] ${className}`}>
      {children}
    </div>
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
    <section className="rounded-[12px] bg-white p-6 shadow-[0_14px_42px_rgba(2,6,23,0.055)] ring-1 ring-slate-200/70 sm:p-8">
      <h2 className="font-serif text-[clamp(1.7rem,3.5vw,2.05rem)] font-bold leading-[1.16] tracking-normal text-[#061f3f]">
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
      <h3 className="font-serif text-2xl font-bold leading-tight text-[#061f3f]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3 text-[16px] leading-7 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-yellow-400 ring-4 ring-yellow-100" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
  external = false,
}: Readonly<{
  icon: ContactIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}>) {
  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#064c78] shadow-sm ring-1 ring-slate-200">
        {renderContactIcon(icon)}
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-black uppercase tracking-[0.13em] text-blue-900">
          {label}
        </span>
        <span className="mt-1 block break-words text-[15px] font-semibold leading-6 text-slate-700">
          {value}
        </span>
      </span>
    </>
  );

  const className =
    "flex min-w-0 items-center gap-3 rounded-full bg-[#f7f3ea] px-4 py-3 shadow-[0_10px_28px_rgba(2,6,23,0.04)] ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-0.5 hover:bg-yellow-300/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300/70";

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function buildProfileImageBackground(photoUrl: string | null): string {
  const fallback =
    "radial-gradient(circle at 30% 20%, rgba(250,204,21,0.24), transparent 28%), linear-gradient(135deg,#071733,#1d4ed8 58%,#e0f2fe)";

  return photoUrl ? `url(${photoUrl}), ${fallback}` : fallback;
}

function getTextLines(value?: string | string[] | null): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => item.trim())
      .filter(Boolean);
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

function renderContactIcon(icon: ContactIcon): React.ReactNode {
  switch (icon) {
    case "email":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M4 6h16v12H4V6Z" />
          <path d="m4.5 7 7.5 6 7.5-6" />
        </svg>
      );
    case "phone":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M8.8 5.2 6.9 3.3 4.4 5.8c-.8.8-.8 2.1-.2 3.3 2.2 4.8 5.9 8.5 10.7 10.7 1.2.6 2.5.6 3.3-.2l2.5-2.5-1.9-1.9c-.8-.8-2-.9-2.9-.3l-1 .7c-2.7-1.4-5.1-3.8-6.5-6.5l.7-1c.6-.9.5-2.1-.3-2.9Z" />
        </svg>
      );
    case "location":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11Z" />
          <path d="M12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z" />
        </svg>
      );
    case "website":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
          <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.1 2.4 3.1 5.4 3.1 9s-1 6.6-3.1 9c-2.1-2.4-3.1-5.4-3.1-9s1-6.6 3.1-9Z" />
        </svg>
      );
  }

  return null;
}
