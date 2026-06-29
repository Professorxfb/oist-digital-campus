import {
  createInstitutionalTypeMetadata,
  InstitutionalTypePage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

export function generateMetadata() {
  return createInstitutionalTypeMetadata({
    type: "campus_life",
    fallbackTitle: "Campus Life",
  });
}

export default function CampusLifePage() {
  return (
    <InstitutionalTypePage
      type="campus_life"
      eyebrow="Campus"
    />
  );
}
