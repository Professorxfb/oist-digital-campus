import { DetailArticle } from "@/components/public-site/DetailArticle";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate, formatTimeRange } from "@/lib/cms-display";
import { getEventBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: event } = await getEventBySlug(slug);

  return createCmsMetadata({
    title: event?.meta_title ?? event?.title ?? "Event",
    description: event?.meta_description ?? event?.excerpt,
  });
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: event } = await getEventBySlug(slug);

  return (
    <PublicSiteShell>
      {event ? (
        <DetailArticle
          title={event.title}
          summary={event.excerpt}
          body={event.body}
          imagePath={event.featured_image_path}
          meta={[
            event.is_featured ? "Featured" : null,
            event.location,
            formatDate(event.event_date),
            formatTimeRange(event.start_time, event.end_time),
          ]}
          action={
            event.registration_url
              ? {
                  href: event.registration_url,
                  label: "Register",
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
