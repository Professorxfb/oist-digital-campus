import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl } from "@/lib/cms-display";

export function ContentCard({
  title,
  description,
  meta = [],
  imagePath,
  href,
  filePath,
}: Readonly<{
  title: string;
  description?: string | null;
  meta?: Array<string | null | undefined>;
  imagePath?: string | null;
  href?: string;
  filePath?: string | null;
}>) {
  const imageUrl = getCmsAssetUrl(imagePath);
  const fileUrl = getCmsAssetUrl(filePath);
  const visibleMeta = meta.filter(Boolean);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {imageUrl ? (
        <div
          className="aspect-[16/9] bg-slate-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        {visibleMeta.length > 0 ? (
          <ul className="mb-3 flex flex-wrap gap-2 text-xs font-medium text-teal-700">
            {visibleMeta.map((item) => (
              <li key={item} className="rounded-full bg-teal-50 px-2.5 py-1">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
            {description}
          </p>
        ) : null}
        <div className="mt-auto pt-5">
          {href ? (
            <CTAButton href={href} variant="subtle">
              View
            </CTAButton>
          ) : null}
          {!href && fileUrl ? (
            <CTAButton href={fileUrl} variant="subtle">
              Download
            </CTAButton>
          ) : null}
        </div>
      </div>
    </article>
  );
}
