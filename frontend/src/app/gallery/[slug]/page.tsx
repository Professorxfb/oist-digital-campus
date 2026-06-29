import { Container } from "@/components/public-site/Container";
import { EmptyState } from "@/components/public-site/EmptyState";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getCmsAssetUrl } from "@/lib/cms-display";
import { getGalleryAlbumBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: album } = await getGalleryAlbumBySlug(slug);

  return createCmsMetadata({
    title: album?.title ?? "Gallery",
    description: album?.description,
  });
}

export default async function GalleryAlbumPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: album } = await getGalleryAlbumBySlug(slug);

  return (
    <PublicSiteShell>
      {album ? (
        <>
          <PageIntro
            eyebrow="Gallery"
            title={album.title}
            description={album.description}
          />
          <Container className="py-10 sm:py-14">
            {album.items && album.items.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {album.items.map((item) => {
                  const imageUrl = getCmsAssetUrl(item.image_path);

                  return (
                    <article
                      key={`${item.image_path}-${item.sort_order ?? 0}`}
                      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                    >
                      {imageUrl ? (
                        <div
                          className="aspect-[4/3] bg-slate-200 bg-cover bg-center"
                          style={{ backgroundImage: `url(${imageUrl})` }}
                          aria-label={item.title ?? item.caption ?? album.title}
                        />
                      ) : null}
                      {(item.title || item.caption) ? (
                        <div className="p-5">
                          {item.title ? (
                            <h2 className="text-base font-semibold text-slate-950">
                              {item.title}
                            </h2>
                          ) : null}
                          {item.caption ? (
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {item.caption}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState />
            )}
          </Container>
        </>
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}
