import { Container } from "@/components/public-site/Container";
import { DetailArticle } from "@/components/public-site/DetailArticle";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { getCmsAssetUrl } from "@/lib/cms-display";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate } from "@/lib/cms-display";
import { getScholarshipBySlug } from "@/services/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: scholarship } = await getScholarshipBySlug(slug);

  return createCmsMetadata({
    title: scholarship?.meta_title ?? scholarship?.title ?? "Scholarship",
    description: scholarship?.meta_description ?? scholarship?.summary,
  });
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: scholarship } = await getScholarshipBySlug(slug);
  const attachmentUrl = getCmsAssetUrl(scholarship?.attachment_path ?? null);

  return (
    <PublicSiteShell>
      {scholarship ? (
        <>
          <DetailArticle
            title={scholarship.title}
            summary={scholarship.summary}
            body={scholarship.description}
            meta={[
              scholarship.is_featured ? "Featured" : null,
              scholarship.deadline
                ? `Deadline ${formatDate(scholarship.deadline)}`
                : null,
            ]}
            action={
              attachmentUrl
                ? {
                    href: attachmentUrl,
                    label: "Download attachment",
                  }
                : null
            }
          />
          <ScholarshipDetails
            eligibility={scholarship.eligibility}
            benefits={scholarship.benefits}
            applicationProcess={scholarship.application_process}
          />
        </>
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}

function ScholarshipDetails({
  eligibility,
  benefits,
  applicationProcess,
}: Readonly<{
  eligibility?: string | null;
  benefits?: string | null;
  applicationProcess?: string | null;
}>) {
  const sections = [
    { title: "Eligibility", body: eligibility },
    { title: "Benefits", body: benefits },
    { title: "Application Process", body: applicationProcess },
  ].filter((section): section is { title: string; body: string } =>
    Boolean(section.body),
  );

  if (sections.length === 0) {
    return null;
  }

  return (
    <Container className="pb-10 sm:pb-14">
      <div className="grid gap-5 lg:grid-cols-3">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">
              {section.title}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {section.body.replace(/<[^>]+>/g, " ")}
            </p>
          </section>
        ))}
      </div>
    </Container>
  );
}
