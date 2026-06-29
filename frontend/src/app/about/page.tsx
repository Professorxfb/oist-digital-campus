import {
  createInstitutionalTypeMetadata,
  InstitutionalTypePage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

export function generateMetadata() {
  return createInstitutionalTypeMetadata({
    type: "about",
    fallbackTitle: "About",
  });
}

export default function AboutPage() {
  return (
    <InstitutionalTypePage
      type="about"
      eyebrow="About"
    />
  );
}
