import { Container } from "@/components/public-site/Container";
import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl } from "@/lib/cms-display";

export function DetailArticle({
  title,
  summary,
  body,
  imagePath,
  meta = [],
  action,
}: Readonly<{
  title: string;
  summary?: string | null;
  body?: string | null;
  imagePath?: string | null;
  meta?: Array<string | null | undefined>;
  action?: {
    href: string;
    label: string;
  } | null;
}>) {
  const imageUrl = getCmsAssetUrl(imagePath);
  const visibleMeta = meta.filter(Boolean);

  return (
    <article>
      <section className="border-b border-slate-200 bg-white">
        <Container className="py-12 sm:py-16">
          <div className="max-w-4xl">
            {visibleMeta.length > 0 ? (
              <ul className="mb-5 flex flex-wrap gap-2 text-xs font-semibold text-teal-700">
                {visibleMeta.map((item) => (
                  <li key={item} className="rounded-full bg-teal-50 px-3 py-1">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            {summary ? (
              <p className="mt-5 text-lg leading-8 text-slate-600">{summary}</p>
            ) : null}
            {action ? (
              <div className="mt-7">
                <CTAButton href={action.href}>{action.label}</CTAButton>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        {imageUrl ? (
          <div
            className="mb-8 aspect-[16/9] rounded-lg bg-slate-200 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
            aria-hidden="true"
          />
        ) : null}
        {body ? (
          <div className="max-w-3xl whitespace-pre-line text-base leading-8 text-slate-700">
            {body.replace(/<[^>]+>/g, " ").replace(/\n{3,}/g, "\n\n")}
          </div>
        ) : (
          <p className="max-w-3xl text-base leading-8 text-slate-600">
            Detailed content will appear here when it is published.
          </p>
        )}
      </Container>
    </article>
  );
}
