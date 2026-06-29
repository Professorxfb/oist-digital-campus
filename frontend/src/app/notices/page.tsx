import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { ContentCard } from "@/components/public-site/ContentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate, getTextPreview } from "@/lib/cms-display";
import { getNotices } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Notices",
    description: "Published public notices.",
  });
}

export default async function NoticesPage() {
  const { data: notices } = await getNotices();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Public Updates"
        title="Notices"
        description="Published notices from the CMS appear here."
      />
      <Container className="py-10 sm:py-14">
        {notices.length > 0 ? (
          <CardGrid>
            {notices.map((notice) => (
              <ContentCard
                key={notice.slug}
                title={notice.title}
                description={getTextPreview(notice.body)}
                meta={[
                  notice.is_pinned ? "Pinned" : null,
                  notice.category,
                  notice.audience,
                  formatDate(notice.published_at),
                ]}
                href={`/notices/${notice.slug}`}
                filePath={notice.attachment_path}
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
