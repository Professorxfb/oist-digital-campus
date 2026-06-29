import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate, getTextPreview } from "@/lib/cms-display";
import { getScholarships } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Scholarships",
    description: "Published scholarship information.",
  });
}

export default async function ScholarshipsPage() {
  const { data: scholarships } = await getScholarships();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Support"
        title="Scholarships"
        description="Published scholarship information from the CMS appears here."
      />
      <Container className="py-10 sm:py-14">
        {scholarships.length > 0 ? (
          <CardGrid>
            {scholarships.map((scholarship) => (
              <ContentCard
                key={scholarship.slug}
                title={scholarship.title}
                description={
                  scholarship.summary ?? getTextPreview(scholarship.description)
                }
                meta={[
                  scholarship.is_featured ? "Featured" : null,
                  scholarship.deadline
                    ? `Deadline ${formatDate(scholarship.deadline)}`
                    : null,
                ]}
                href={`/scholarships/${scholarship.slug}`}
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
