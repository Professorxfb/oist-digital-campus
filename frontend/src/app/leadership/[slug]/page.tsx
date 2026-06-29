import { DetailArticle } from "@/components/public-site/DetailArticle";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getLeadershipProfileBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: profile } = await getLeadershipProfileBySlug(slug);

  return createCmsMetadata({
    title: profile?.name ?? "Leadership Profile",
    description: profile?.short_bio ?? profile?.designation,
  });
}

export default async function LeadershipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: profile } = await getLeadershipProfileBySlug(slug);

  return (
    <PublicSiteShell>
      {profile ? (
        <DetailArticle
          title={profile.name}
          summary={profile.short_bio}
          body={profile.message}
          imagePath={profile.photo_path ?? null}
          meta={[profile.designation, profile.email, profile.phone]}
        />
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}
