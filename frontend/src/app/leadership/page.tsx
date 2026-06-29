import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getLeadershipProfiles } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Leadership",
    description: "Published leadership profiles.",
  });
}

export default async function LeadershipPage() {
  const { data: profiles } = await getLeadershipProfiles();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Profiles"
        title="Leadership"
        description="Published leadership profiles from the CMS appear here."
      />
      <Container className="py-10 sm:py-14">
        {profiles.length > 0 ? (
          <CardGrid>
            {profiles.map((profile) => (
              <ContentCard
                key={profile.slug}
                title={profile.name}
                description={profile.short_bio ?? profile.designation}
                imagePath={profile.photo_path ?? null}
                meta={[profile.designation]}
                href={`/leadership/${profile.slug}`}
              />
            ))}
          </CardGrid>
        ) : (
          <EmptyState />
        )}
      </Container>
    </PublicSiteShell>
  );
}
