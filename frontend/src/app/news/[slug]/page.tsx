import { DetailArticle } from "@/components/public-site/DetailArticle";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate } from "@/lib/cms-display";
import { getNewsPostBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: post } = await getNewsPostBySlug(slug);

  return createCmsMetadata({
    title: post?.meta_title ?? post?.title ?? "News",
    description: post?.meta_description ?? post?.excerpt,
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: post } = await getNewsPostBySlug(slug);

  return (
    <PublicSiteShell>
      {post ? (
        <DetailArticle
          title={post.title}
          summary={post.excerpt}
          body={post.body}
          imagePath={post.featured_image_path}
          meta={[
            post.is_featured ? "Featured" : null,
            post.category,
            post.author_name,
            formatDate(post.published_at),
          ]}
        />
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}
