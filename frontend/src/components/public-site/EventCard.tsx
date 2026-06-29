import { ContentCard } from "@/components/public-site/ContentCard";
import { formatDate, formatTimeRange } from "@/lib/cms-display";
import type { Event } from "@/types/cms";

export function EventCard({ event }: Readonly<{ event: Event }>) {
  return (
    <ContentCard
      title={event.title}
      description={event.excerpt ?? event.location}
      imagePath={event.featured_image_path ?? null}
      meta={[
        formatDate(event.event_date),
        formatTimeRange(event.start_time, event.end_time),
      ]}
      href={`/events/${event.slug}`}
    />
  );
}
