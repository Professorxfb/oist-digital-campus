import { ContentCard } from "@/components/public-site/ContentCard";
import type { FacultyProfile } from "@/types/cms";

export function FacultyCard({ profile }: Readonly<{ profile: FacultyProfile }>) {
  return (
    <ContentCard
      title={profile.name}
      description={profile.short_bio}
      imagePath={profile.photo_url ?? profile.photo_path ?? null}
      href={`/faculty-profiles/${profile.slug}`}
      meta={[profile.designation, profile.department?.name]}
    />
  );
}
