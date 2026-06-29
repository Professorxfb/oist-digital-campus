import { CardGrid } from "@/components/public-site/CardGrid";
import { Container } from "@/components/public-site/Container";
import { DetailArticle } from "@/components/public-site/DetailArticle";
import { FacultyCard } from "@/components/public-site/FacultyCard";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { SectionHeader } from "@/components/public-site/SectionHeader";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getDepartmentBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: department } = await getDepartmentBySlug(slug);

  return createCmsMetadata({
    title: department?.meta_title ?? department?.name ?? "Department",
    description:
      department?.meta_description ?? department?.short_description ?? undefined,
  });
}

export default async function DepartmentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: department } = await getDepartmentBySlug(slug);

  return (
    <PublicSiteShell>
      {department ? (
        <>
          <DetailArticle
            title={department.name}
            summary={department.short_description}
            body={department.description}
            imagePath={department.featured_image_path}
            meta={[department.icon]}
          />
          {department.faculty_profiles && department.faculty_profiles.length > 0 ? (
            <section className="bg-white py-10 sm:py-14">
              <SectionHeader title="Faculty Profiles" />
              <Container>
                <CardGrid>
                  {department.faculty_profiles.map((profile) => (
                    <FacultyCard key={profile.slug} profile={profile} />
                  ))}
                </CardGrid>
              </Container>
            </section>
          ) : null}
        </>
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}
