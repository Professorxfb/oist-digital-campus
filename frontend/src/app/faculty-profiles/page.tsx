import Link from "next/link";
import { CardGrid } from "@/components/public-site/CardGrid";
import { EmptyState } from "@/components/public-site/EmptyState";
import { FacultyCard } from "@/components/public-site/FacultyCard";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getFacultyProfiles } from "@/services/cms";

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

        <section className="pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          <FacultyProfilesContainer>
            {profiles.length > 0 ? (
              <CardGrid>
                {profiles.map((profile) => (
                  <FacultyCard key={profile.slug} profile={profile} />
                ))}
              </CardGrid>
            ) : (
              <EmptyState />
            )}
          </FacultyProfilesContainer>
        </section>
      </article>
    </PublicSiteShell>
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
