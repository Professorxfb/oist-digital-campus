import { DetailArticle } from "@/components/public-site/DetailArticle";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { createCmsMetadata } from "@/lib/cms-metadata";
import {
  getInstitutionalPageBySlug,
  getInstitutionalPageByType,
} from "@/services/cms";
import type { InstitutionalPageType } from "@/types/cms";

export async function createInstitutionalTypeMetadata({
  type,
  fallbackTitle,
}: {
  type: InstitutionalPageType;
  fallbackTitle: string;
}) {
  const { data: page } = await getInstitutionalPageByType(type);

  return createCmsMetadata({
    title: page?.meta_title ?? page?.title ?? fallbackTitle,
    description: page?.meta_description ?? page?.excerpt,
  });
}

export async function InstitutionalTypePage({
  type,
  eyebrow = "Institutional Page",
}: {
  type: InstitutionalPageType;
  eyebrow?: string;
}) {
  const { data: page } = await getInstitutionalPageByType(type);

  return (
    <PublicSiteShell>
      {page ? (
        <DetailArticle
          title={page.title}
          summary={page.excerpt}
          body={page.body}
          imagePath={page.featured_image_path ?? null}
          meta={[eyebrow]}
        />
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}

export async function createInstitutionalSlugMetadata({
  slug,
}: {
  slug: string;
}) {
  const { data: page } = await getInstitutionalPageBySlug(slug);

  return createCmsMetadata({
    title: page?.meta_title ?? page?.title ?? "Institutional Page",
    description: page?.meta_description ?? page?.excerpt,
  });
}

export async function InstitutionalSlugPage({ slug }: { slug: string }) {
  const { data: page } = await getInstitutionalPageBySlug(slug);

  return (
    <PublicSiteShell>
      {page ? (
        <DetailArticle
          title={page.title}
          summary={page.excerpt}
          body={page.body}
          imagePath={page.featured_image_path ?? null}
          meta={[page.page_type]}
        />
      ) : (
        <MissingContent />
      )}
    </PublicSiteShell>
  );
}
