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
  actionLabel = "View",
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
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-950/10">
      {shouldShowMedia ? (
        imageUrl ? (
          <div
            className="aspect-[16/9] bg-slate-100 bg-cover bg-center transition duration-300 group-hover:scale-[1.02]"
            style={{ backgroundImage: `url(${imageUrl})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="aspect-[16/9] bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.24),transparent_28%),linear-gradient(135deg,#071733,#1d4ed8_58%,#e0f2fe)]" aria-hidden="true" />
        )
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        {visibleMeta.length > 0 ? (
          <ul className="mb-3 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.08em] text-blue-800">
            {visibleMeta.map((item) => (
              <li key={item} className="rounded-full bg-blue-50 px-2.5 py-1 ring-1 ring-blue-100">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <h3 className="text-xl font-black tracking-tight text-slate-950 transition group-hover:text-blue-800">
          {title}
        </h3>
        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
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
