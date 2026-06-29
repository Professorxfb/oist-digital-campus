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
  const shouldShowMedia = imagePath !== undefined;

  return (
    <article>
      <section className="relative overflow-hidden border-b border-white/10 bg-[#071733] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(250,204,21,0.16),transparent_24%),linear-gradient(135deg,#020617,#071733_58%,#0a2a5e)]" aria-hidden="true" />
        <Container className="relative py-14 sm:py-20">
          <div className="max-w-4xl">
            {visibleMeta.length > 0 ? (
              <ul className="mb-5 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.1em] text-yellow-300">
                {visibleMeta.map((item) => (
                  <li key={item} className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
              {title}
            </h1>
            {summary ? (
              <p className="mt-5 text-lg leading-8 text-blue-50">{summary}</p>
            ) : null}
            {action ? (
              <div className="mt-7">
                <CTAButton href={action.href}>{action.label}</CTAButton>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        {shouldShowMedia ? (
          imageUrl ? (
            <div
              className="mb-8 aspect-[16/9] rounded-3xl bg-slate-200 bg-cover bg-center shadow-2xl shadow-slate-950/10"
              style={{ backgroundImage: `url(${imageUrl})` }}
              aria-hidden="true"
            />
          ) : (
            <div className="mb-8 aspect-[16/9] rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.24),transparent_28%),linear-gradient(135deg,#071733,#1d4ed8_58%,#e0f2fe)] shadow-2xl shadow-slate-950/10" aria-hidden="true" />
          )
        ) : null}
        {body ? (
          <div className="max-w-3xl whitespace-pre-line text-base leading-8 text-slate-700">
            {body.replace(/<[^>]+>/g, " ").replace(/\n{3,}/g, "\n\n")}
          </div>
        ) : (
          null
        )}
      </Container>
    </article>
  );
}
