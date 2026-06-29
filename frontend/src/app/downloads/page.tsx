import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getDownloads } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Downloads",
    description: "Published public downloads.",
  });
}

export default async function DownloadsPage() {
  const { data: downloads } = await getDownloads();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Files"
        title="Downloads"
        description="Published download files from the CMS appear here."
      />
      <Container className="py-10 sm:py-14">
        {downloads.length > 0 ? (
          <CardGrid>
            {downloads.map((download) => (
              <ContentCard
                key={download.slug}
                title={download.title}
                description={download.description}
                meta={[download.category]}
                filePath={download.file_path}
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
