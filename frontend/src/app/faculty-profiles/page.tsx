import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { EmptyState } from "@/components/public-site/EmptyState";
import { FacultyCard } from "@/components/public-site/FacultyCard";
import { PageIntro } from "@/components/public-site/PageIntro";
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
      <PageIntro
        eyebrow="Faculty Profiles"
        title="OIST Professors"
      />
      <Container className="py-10 sm:py-14 lg:py-16">
        {profiles.length > 0 ? (
          <CardGrid>
            {profiles.map((profile) => (
              <FacultyCard key={profile.slug} profile={profile} />
            ))}
          </CardGrid>
        ) : (
          <EmptyState />
        )}
      </Container>
    </PublicSiteShell>
  );
}
