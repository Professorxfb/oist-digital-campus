import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getFacilities } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Facilities",
    description: "Published facility information.",
  });
}

export default async function FacilitiesPage() {
  const { data: facilities } = await getFacilities();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Campus"
        title="Facilities"
        description="Published facility information from the CMS appears here."
      />
      <Container className="py-10 sm:py-14">
        {facilities.length > 0 ? (
          <CardGrid>
            {facilities.map((facility) => (
              <ContentCard
                key={facility.slug}
                title={facility.title}
                description={facility.summary}
                imagePath={facility.image_path ?? null}
                meta={[facility.icon]}
                href={`/facilities/${facility.slug}`}
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
