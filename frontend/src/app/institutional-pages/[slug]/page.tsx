import {
  createInstitutionalSlugMetadata,
  InstitutionalSlugPage,
} from "@/components/public-site/InstitutionalPageRoute";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  return createInstitutionalSlugMetadata({ slug });
}

export default async function GenericInstitutionalPage({ params }: PageProps) {
  const { slug } = await params;

  return <InstitutionalSlugPage slug={slug} />;
}
