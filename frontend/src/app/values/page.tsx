import {
  createInstitutionalTypeMetadata,
  InstitutionalTypePage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

export function generateMetadata() {
  return createInstitutionalTypeMetadata({
    type: "values",
    fallbackTitle: "Values",
  });
}

export default function ValuesPage() {
  return (
    <InstitutionalTypePage
      type="values"
      eyebrow="Values"
    />
  );
}
