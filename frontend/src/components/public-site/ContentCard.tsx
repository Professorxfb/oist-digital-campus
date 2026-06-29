import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl } from "@/lib/cms-display";

export function ContentCard({
  title,
  description,
  meta = [],
  imagePath,
  href,
  filePath,
  media = "auto",
  actionLabel = "Read More",
  downloadLabel = "Download",
}: Readonly<{
  title: string;
  description?: string | null;
  meta?: Array<string | null | undefined>;
  imagePath?: string | null;
  href?: string;
  filePath?: string | null;
  media?: "auto" | "none";
  actionLabel?: string;
  downloadLabel?: string;
}>) {
  const imageUrl = getCmsAssetUrl(imagePath);
  const fileUrl = getCmsAssetUrl(filePath);
  const visibleMeta = meta.filter(Boolean);
  const shouldShowMedia = media === "auto" && imagePath !== undefined;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_14px_42px_rgba(2,6,23,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-yellow-300/60 hover:shadow-[0_24px_58px_rgba(2,6,23,0.13)]">
      {shouldShowMedia ? (
        <div className="overflow-hidden">
          {imageUrl ? (
            <div
              className="aspect-[16/9] bg-slate-100 bg-cover bg-center transition duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${imageUrl})` }}
              aria-hidden="true"
            />
          ) : (
            <div className="aspect-[16/9] bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.24),transparent_28%),linear-gradient(135deg,#071733,#1d4ed8_58%,#e0f2fe)]" aria-hidden="true" />
          )}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {visibleMeta.length > 0 ? (
          <ul className="mb-4 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-blue-900">
            {visibleMeta.map((item) => (
              <li key={item} className="rounded-full bg-yellow-300/25 px-2.5 py-1 ring-1 ring-yellow-300/40">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <h3 className="font-serif text-[1.55rem] font-bold leading-[1.16] tracking-normal text-slate-950 transition group-hover:text-blue-900">
          {title}
        </h3>
        {description ? (
          <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-slate-600">
            {description}
          </p>
        ) : null}
        <div className="mt-auto pt-6">
          {href ? (
            <CTAButton href={href} variant="subtle">
              {actionLabel}
            </CTAButton>
          ) : null}
          {!href && fileUrl ? (
            <CTAButton href={fileUrl} variant="subtle">
              {downloadLabel}
            </CTAButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}
