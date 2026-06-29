import {
  createInstitutionalTypeMetadata,
  InstitutionalTypePage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

export function generateMetadata() {
  return createInstitutionalTypeMetadata({
    type: "student_support",
    fallbackTitle: "Student Support",
  });
}

export default function StudentSupportPage() {
  return (
    <InstitutionalTypePage
      type="student_support"
      eyebrow="Support"
    />
  );
}
