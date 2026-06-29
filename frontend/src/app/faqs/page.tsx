import { Container } from "@/components/public-site/Container";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { getFaqs } from "@/services/cms";

export const revalidate = 60;

export async function generateMetadata() {
  return createCmsMetadata({
    title: "FAQs",
    description: "Published frequently asked questions.",
  });
}

export default async function FaqsPage() {
  const { data: faqs } = await getFaqs();

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Help"
        title="FAQs"
        description="Published questions and answers from the CMS appear here."
      />
      <Container className="py-10 sm:py-14">
        {faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={`${faq.category ?? "general"}-${faq.question}`}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <summary className="cursor-pointer text-base font-semibold text-slate-950">
                  {faq.question}
                </summary>
                {faq.category ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                    {faq.category}
                  </p>
                ) : null}
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {faq.answer.replace(/<[^>]+>/g, " ")}
                </p>
              </details>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </Container>
    </PublicSiteShell>
  );
}
