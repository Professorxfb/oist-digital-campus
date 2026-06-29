import { Container } from "@/components/public-site/Container";
import { EmptyState } from "@/components/public-site/EmptyState";
import { PageIntro } from "@/components/public-site/PageIntro";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { SearchForm } from "@/components/public-site/SearchForm";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate } from "@/lib/cms-display";
import {
  getInstitutionalPages,
  searchPublicContent,
} from "@/services/cms";
import type { InstitutionalPage, SearchResult } from "@/types/cms";

export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

const INSTITUTIONAL_TYPE_ROUTES: Record<string, string> = {
  about: "/about",
  mission: "/mission",
  vision: "/vision",
  values: "/values",
  why_choose_us: "/why-choose-us",
  campus_life: "/campus-life",
  student_support: "/student-support",
  accreditation: "/accreditation",
  facilities: "/facilities",
};

export async function generateMetadata() {
  return createCmsMetadata({
    title: "Search",
    description: "Search published public website content.",
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const shouldSearch = query.length >= 2;
  const [searchResult, institutionalPages] = shouldSearch
    ? await Promise.all([searchPublicContent(query), getInstitutionalPages()])
    : [
        { data: [], meta: {}, error: null },
        { data: [], meta: {}, error: null },
      ];
  const results = searchResult.data.map((result) =>
    normalizeSearchResultUrl(result, institutionalPages.data),
  );
  const groupedResults = groupResultsByType(results);

  return (
    <PublicSiteShell>
      <PageIntro
        eyebrow="Search"
        title="Search"
        description="Search results are provided by the public CMS API."
      />
      <Container className="py-10 sm:py-14">
        <SearchForm query={query} />

        <div className="mt-8">
          {!query ? (
            <EmptyState
              title="Search public content"
              message="Enter a keyword to search published CMS content."
            />
          ) : !shouldSearch ? (
            <EmptyState
              title="Keep typing"
              message="Search needs at least 2 characters."
            />
          ) : results.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedResults).map(([type, items]) => (
                <section key={type}>
                  <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                    {formatResultType(type)}
                  </h2>
                  <div className="mt-4 grid gap-4">
                    {items.map((item) => (
                      <article
                        key={`${item.type}-${item.title}-${item.url}`}
                        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                      >
                        <a
                          className="text-lg font-semibold tracking-tight text-slate-950 transition hover:text-blue-800"
                          href={item.url}
                        >
                          {item.title}
                        </a>
                        {item.excerpt ? (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.excerpt}
                          </p>
                        ) : null}
                        {item.published_at ? (
                          <p className="mt-3 text-xs font-medium text-slate-500">
                            {formatDate(item.published_at)}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No results found"
              message="No published public content matched this search."
            />
          )}
        </div>
      </Container>
    </PublicSiteShell>
  );
}

function normalizeSearchResultUrl(
  result: SearchResult,
  institutionalPages: InstitutionalPage[],
): SearchResult {
  if (result.type !== "institutional_page") {
    return result;
  }

  const slug = result.url.split("/").filter(Boolean).at(-1);
  const page = institutionalPages.find((item) => item.slug === slug);
  const route = page ? INSTITUTIONAL_TYPE_ROUTES[page.page_type] : null;

  return {
    ...result,
    url: route ?? result.url,
  };
}

function groupResultsByType(results: SearchResult[]): Record<string, SearchResult[]> {
  return results.reduce<Record<string, SearchResult[]>>((groups, result) => {
    groups[result.type] = groups[result.type] ?? [];
    groups[result.type].push(result);

    return groups;
  }, {});
}

function formatResultType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
