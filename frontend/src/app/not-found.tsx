import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";

export default function NotFound() {
  return (
    <PublicSiteShell>
      <MissingContent />
    </PublicSiteShell>
  );
}
