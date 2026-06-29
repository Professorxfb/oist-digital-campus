import { DetailArticle } from "@/components/public-site/DetailArticle";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate, getCmsAssetUrl } from "@/lib/cms-display";
import { getNoticeBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: notice } = await getNoticeBySlug(slug);

  return createCmsMetadata({
    title: notice?.meta_title ?? notice?.title ?? "Notice",
    description: notice?.meta_description,
  });
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: notice } = await getNoticeBySlug(slug);
  const attachmentUrl = getCmsAssetUrl(notice?.attachment_path);

  return (
    <PublicSiteShell>
      {notice ? (
        <DetailArticle
          title={notice.title}
          body={notice.body}
          meta={[
            notice.is_pinned ? "Pinned" : null,
            notice.category,
            notice.audience,
            formatDate(notice.published_at),
          ]}
          action={
            attachmentUrl
              ? {
                  href: attachmentUrl,
                  label: "Download",
                }
              : null
          }
        />
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}
