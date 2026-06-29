import { DetailArticle } from "@/components/public-site/DetailArticle";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getFacilityBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: facility } = await getFacilityBySlug(slug);

  return createCmsMetadata({
    title: facility?.meta_title ?? facility?.title ?? "Facility",
    description: facility?.meta_description ?? facility?.summary,
  });
}

export default async function FacilityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: facility } = await getFacilityBySlug(slug);

  return (
    <PublicSiteShell>
      {facility ? (
        <DetailArticle
          title={facility.title}
          summary={facility.summary}
          body={facility.description}
          imagePath={facility.image_path ?? null}
          meta={[facility.icon]}
        />
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}
