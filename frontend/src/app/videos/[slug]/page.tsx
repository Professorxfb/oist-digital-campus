import { Container } from "@/components/public-site/Container";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { VideoEmbed } from "@/components/public-site/VideoEmbed";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate } from "@/lib/cms-display";
import { getVideoBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: video } = await getVideoBySlug(slug);

  return createCmsMetadata({
    title: video?.meta_title ?? video?.title ?? "Video",
    description: video?.meta_description ?? video?.excerpt,
  });
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: video } = await getVideoBySlug(slug);

  return (
    <PublicSiteShell>
      {video ? (
        <article>
          <section className="border-b border-slate-200 bg-white">
            <Container className="py-12 sm:py-16">
              <div className="max-w-4xl">
                <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold text-teal-700">
                  {video.is_featured ? (
                    <span className="rounded-full bg-teal-50 px-3 py-1">
                      Featured
                    </span>
                  ) : null}
                  {video.category ? (
                    <span className="rounded-full bg-teal-50 px-3 py-1">
                      {video.category}
                    </span>
                  ) : null}
                  {formatDate(video.published_at ?? video.event_date) ? (
                    <span className="rounded-full bg-teal-50 px-3 py-1">
                      {formatDate(video.published_at ?? video.event_date)}
                    </span>
                  ) : null}
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {video.title}
                </h1>
                {video.excerpt ? (
                  <p className="mt-5 text-lg leading-8 text-slate-600">
                    {video.excerpt}
                  </p>
                ) : null}
              </div>
            </Container>
          </section>
          <Container className="py-10 sm:py-14">
            <VideoEmbed video={video} />
            {video.description ? (
              <p className="mt-8 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-700">
                {video.description.replace(/<[^>]+>/g, " ")}
              </p>
            ) : null}
          </Container>
        </article>
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}
