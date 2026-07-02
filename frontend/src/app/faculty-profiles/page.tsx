import Link from "next/link";
import { CTAButton } from "@/components/public-site/CTAButton";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getCmsAssetUrl } from "@/lib/cms-display";
import { getFacultyProfiles } from "@/services/cms";
import type { FacultyProfile } from "@/types/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "OIST Professors",
    description: "Faculty profiles.",
  });
}

export default async function FacultyProfilesPage() {
  const { data: profiles } = await getFacultyProfiles();

  return (
    <PublicSiteShell>
      <article className="bg-[#f7f3ea]">
        <section className="relative overflow-hidden bg-[#082f55] text-white">
          <FacultyProfilesContainer className="relative pb-14 pt-[124px] sm:pb-16 sm:pt-[148px] lg:pb-[76px] lg:pt-[168px]">
            <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold leading-6 text-blue-100 sm:text-sm" aria-label="Breadcrumb">
              <Link className="transition hover:text-yellow-300" href="/">
                Home
              </Link>
              <span className="text-yellow-300" aria-hidden="true">/</span>
              <span className="text-white">Faculty Profiles</span>
            </nav>

            <div className="mt-5 max-w-[680px]">
              <p className="text-xs font-black uppercase leading-5 tracking-[0.17em] text-yellow-300">
                Faculty Profiles
              </p>
              <h1 className="mt-3 font-serif text-[clamp(2.125rem,4.2vw,4rem)] font-bold leading-[1.06] tracking-normal text-white">
                OIST Professors
              </h1>
              <div className="mt-5 h-px w-28 bg-gradient-to-r from-white via-white/70 to-yellow-300/70" aria-hidden="true" />
            </div>
          </FacultyProfilesContainer>
        </section>

        <section className="pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14" data-section="faculty-listing">
          <FacultyProfilesContainer>
            {profiles.length > 0 ? (
              <div className="grid max-w-[1320px] gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
                {profiles.map((profile) => (
                  <FacultyListingCard key={profile.slug} profile={profile} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </FacultyProfilesContainer>
        </section>
      </article>
    </PublicSiteShell>
  );
}

function FacultyListingCard({
  profile,
}: Readonly<{
  profile: FacultyProfile;
}>) {
  const imageUrl = getCmsAssetUrl(profile.photo_url ?? profile.photo_path ?? null);
  const metaItems = [profile.designation, profile.department?.name].filter(Boolean);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-slate-200/70 bg-white shadow-[0_14px_34px_rgba(2,6,23,0.055)] transition duration-300 hover:-translate-y-1 hover:border-yellow-300/70 hover:shadow-[0_22px_48px_rgba(2,6,23,0.12)]" data-faculty-listing-card>
      <div className="overflow-hidden p-2.5 pb-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-slate-100">
          {imageUrl ? (
            <div
              className="h-full w-full bg-cover bg-[center_22%] transition duration-700 group-hover:scale-[1.035]"
              style={{ backgroundImage: `url(${imageUrl})` }}
              aria-hidden="true"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.2),transparent_28%),linear-gradient(135deg,#071733,#1d4ed8_58%,#e0f2fe)]" aria-hidden="true" />
          )}
          <div className="absolute inset-0 bg-[#061f3f]/0 transition duration-500 group-hover:bg-[#061f3f]/10" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-5 text-center">
        {metaItems.length > 0 ? (
          <p className="mx-auto max-w-full text-[11px] font-black uppercase leading-5 tracking-[0.12em] text-blue-800">
            {metaItems.map((item, index) => (
              <span key={item}>
                {index > 0 ? <span className="mx-1.5 text-yellow-500">/</span> : null}
                <span>{item}</span>
              </span>
            ))}
          </p>
        ) : null}

        <h2 className="mt-3 font-serif text-[clamp(1.25rem,3.4vw,1.5rem)] font-bold leading-[1.15] tracking-normal text-[#061f3f] transition duration-300 group-hover:text-blue-900">
          {profile.name}
        </h2>

        <div className="mt-auto pt-5">
          <CTAButton href={`/faculty-profiles/${profile.slug}`} variant="subtle" className="min-h-10 px-4 py-2 text-[13px]">
            Read More
          </CTAButton>
        </div>
      </div>
    </article>
  );
}

function FacultyProfilesContainer({
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
