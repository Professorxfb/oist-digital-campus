import {
  createInstitutionalTypeMetadata,
  InstitutionalTypePage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

export function generateMetadata() {
  return createInstitutionalTypeMetadata({
    type: "accreditation",
    fallbackTitle: "Accreditation",
  });
}

export default function AccreditationPage() {
  return (
    <InstitutionalTypePage
      type="accreditation"
      eyebrow="Institutional Page"
    />
  );
}
