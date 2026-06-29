import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate } from "@/lib/cms-display";
import { getVideos } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Videos",
    description: "Published video showcase content.",
  });
}

export default async function VideosPage() {
  const { data: videos } = await getVideos();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Media"
        title="Videos"
        description="Published video showcase content from the CMS appears here."
      />
      <Container className="py-10 sm:py-14">
        {videos.length > 0 ? (
          <CardGrid>
            {videos.map((video) => (
              <ContentCard
                key={video.slug}
                title={video.title}
                description={video.excerpt}
                imagePath={video.thumbnail_path ?? null}
                meta={[
                  video.is_featured ? "Featured" : null,
                  video.category,
                  formatDate(video.published_at ?? video.event_date),
                ]}
                href={`/videos/${video.slug}`}
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
