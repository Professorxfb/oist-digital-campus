import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate, getTextPreview } from "@/lib/cms-display";
import { getNewsPosts } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "News",
    description: "Published public news.",
  });
}

export default async function NewsPage() {
  const { data: newsPosts } = await getNewsPosts();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Public Updates"
        title="News"
        description="Published news posts from the CMS appear here."
      />
      <Container className="py-10 sm:py-14">
        {newsPosts.length > 0 ? (
          <CardGrid>
            {newsPosts.map((post) => (
              <ContentCard
                key={post.slug}
                title={post.title}
                description={post.excerpt ?? getTextPreview(post.body)}
                imagePath={post.featured_image_path ?? null}
                meta={[
                  post.is_featured ? "Featured" : null,
                  post.category,
                  formatDate(post.published_at),
                ]}
                href={`/news/${post.slug}`}
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
