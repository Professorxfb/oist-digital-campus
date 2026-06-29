import {
  createInstitutionalTypeMetadata,
  InstitutionalTypePage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

export function generateMetadata() {
  return createInstitutionalTypeMetadata({
    type: "mission",
    fallbackTitle: "Mission",
  });
}

export default function MissionPage() {
  return (
    <InstitutionalTypePage
      type="mission"
      eyebrow="Mission"
    />
  );
}
