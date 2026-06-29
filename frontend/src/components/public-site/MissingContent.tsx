import { Container } from "@/components/public-site/Container";
import { EmptyState } from "@/components/public-site/EmptyState";

export function MissingContent() {
  return (
    <Container className="py-10 sm:py-14">
      <EmptyState
        title="Content was not found"
        message="This public item is unavailable or has not been published."
      />
    </Container>
  );
}
