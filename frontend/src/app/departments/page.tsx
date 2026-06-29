import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { DepartmentCard } from "@/components/public-site/DepartmentCard";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getDepartments } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Departments",
    description: "Published department information.",
  });
}

export default async function DepartmentsPage() {
  const { data: departments } = await getDepartments();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Academic Areas"
        title="Departments"
        description="Published department information from the CMS appears here."
      />
      <Container className="py-10 sm:py-14">
        {departments.length > 0 ? (
          <CardGrid>
            {departments.map((department) => (
              <DepartmentCard key={department.slug} department={department} />
            ))}
          </CardGrid>
        ) : (
          <EmptyState />
        )}
      </Container>
    </PublicSiteShell>
  );
}
