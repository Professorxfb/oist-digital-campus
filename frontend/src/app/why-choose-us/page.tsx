import {
  createInstitutionalTypeMetadata,
  InstitutionalTypePage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

export function generateMetadata() {
  return createInstitutionalTypeMetadata({
    type: "why_choose_us",
    fallbackTitle: "Why Choose Us",
  });
}

export default function WhyChooseUsPage() {
  return (
    <InstitutionalTypePage
      type="why_choose_us"
      eyebrow="Institutional Page"
    />
  );
}
