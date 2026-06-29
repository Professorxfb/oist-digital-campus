import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getGalleryAlbums } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Gallery",
    description: "Published gallery albums.",
  });
}

export default async function GalleryPage() {
  const { data: albums } = await getGalleryAlbums();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Media"
        title="Gallery"
        description="Published gallery albums from the CMS appear here."
      />
      <Container className="py-10 sm:py-14">
        {albums.length > 0 ? (
          <CardGrid>
            {albums.map((album) => (
              <ContentCard
                key={album.slug}
                title={album.title}
                description={album.description}
                imagePath={album.cover_image_path}
                href={`/gallery/${album.slug}`}
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
