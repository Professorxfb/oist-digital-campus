import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { EmptyState } from "@/components/public-site/EmptyState";
import { EventCard } from "@/components/public-site/EventCard";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getEvents } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Events",
    description: "Published public events.",
  });
}

export default async function EventsPage() {
  const { data: events } = await getEvents();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Calendar"
        title="Events"
        description="Published events from the CMS appear here."
      />
      <Container className="py-10 sm:py-14">
        {events.length > 0 ? (
          <CardGrid>
            {events.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </CardGrid>
        ) : (
          <EmptyState />
        )}
      </Container>
    </PublicSiteShell>
  );
}
