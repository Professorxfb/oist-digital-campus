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
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
      {shouldShowMedia ? (
        imageUrl ? (
          <div
            className="aspect-[16/9] bg-slate-100 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="aspect-[16/9] bg-[linear-gradient(135deg,#eff6ff,#ccfbf1_52%,#e2e8f0)]" aria-hidden="true" />
        )
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        {visibleMeta.length > 0 ? (
          <ul className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-teal-700">
            {visibleMeta.map((item) => (
              <li key={item} className="rounded-full bg-teal-50 px-2.5 py-1 ring-1 ring-teal-100">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <h3 className="text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-blue-800">
          {title}
        </h3>
        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
        <div className="mt-auto pt-5">
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
