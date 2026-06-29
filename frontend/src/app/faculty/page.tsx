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
    title: "Faculty",
    description: "Published faculty profiles.",
  });
}

export default async function FacultyPage() {
  const { data: profiles } = await getFacultyProfiles();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Profiles"
        title="Faculty"
        description="Published faculty profiles from the CMS appear here."
      />
      <Container className="py-10 sm:py-14">
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
