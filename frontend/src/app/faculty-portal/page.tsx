import { Container } from "@/components/public-site/Container";
import { CTAButton } from "@/components/public-site/CTAButton";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";

export const revalidate = 60;

export function generateMetadata() {
  return createCmsMetadata({
    title: "Faculty Portal",
    description: "Faculty portal access will be available when portal authentication is launched.",
  });
}

export default function FacultyPortalPlaceholderPage() {
  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Portal"
        title="Faculty Portal"
        description="Faculty portal access will be available when portal authentication is launched."
      />
      <Container className="py-12 sm:py-16">
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Portal coming soon
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            This public placeholder does not include login or protected faculty features yet.
          </p>
          <div className="mt-7">
            <CTAButton href="/" variant="subtle">
              Back to Home
            </CTAButton>
          </div>
        </section>
      </Container>
    </PublicSiteShell>
  );
}
