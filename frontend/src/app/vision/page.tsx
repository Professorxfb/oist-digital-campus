import {
  createInstitutionalTypeMetadata,
  InstitutionalTypePage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

export function generateMetadata() {
  return createInstitutionalTypeMetadata({
    type: "vision",
    fallbackTitle: "Vision",
  });
}

export default function VisionPage() {
  return (
    <InstitutionalTypePage
      type="vision"
      eyebrow="Vision"
    />
  );
}
