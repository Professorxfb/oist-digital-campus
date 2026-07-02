import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import type { FacultyProfile } from "@/types/cms";

export function FacultyCard({ profile }: Readonly<{ profile: FacultyProfile }>) {
  const imageUrl = getCmsAssetUrl(profile.photo_url ?? profile.photo_path ?? null);
  const visibleMeta = [profile.designation, profile.department?.name].filter(Boolean);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-white bg-white shadow-[0_18px_44px_rgba(2,6,23,0.06)] transition duration-300 hover:-translate-y-1.5 hover:border-yellow-300/70 hover:shadow-[0_26px_62px_rgba(2,6,23,0.13)]">
      <div className="overflow-hidden p-3 pb-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-slate-100">
          {imageUrl ? (
            <div
              className="h-full w-full bg-cover bg-[center_22%] transition duration-700 group-hover:scale-[1.035]"
              style={{ backgroundImage: `url(${imageUrl})` }}
              aria-hidden="true"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(250,204,21,0.24),transparent_28%),linear-gradient(135deg,#071733,#1d4ed8_58%,#e0f2fe)]" aria-hidden="true" />
          )}
          <div className="absolute inset-0 bg-[#061f3f]/0 transition duration-500 group-hover:bg-[#061f3f]/12" aria-hidden="true" />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-6 pb-7 pt-6 text-center sm:px-7">
        {visibleMeta.length > 0 ? (
          <ul className="mb-4 flex flex-wrap justify-center gap-2 text-[11px] font-black uppercase tracking-[0.1em] text-blue-900">
            {visibleMeta.map((item) => (
              <li key={item} className="max-w-full rounded-full bg-yellow-300/25 px-2.5 py-1 ring-1 ring-yellow-300/40">
                <span className="block max-w-full truncate">{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <h2 className="font-serif text-[clamp(1.42rem,4.5vw,1.72rem)] font-bold leading-[1.14] tracking-normal text-[#061f3f] transition duration-300 group-hover:text-blue-900">
          {profile.name}
        </h2>
        {profile.short_bio ? (
          <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-slate-600">
            {getTextPreview(profile.short_bio, 150)}
          </p>
        ) : null}
        <div className="mt-auto pt-6">
          <CTAButton href={`/faculty-profiles/${profile.slug}`} variant="subtle">
            Read More
          </CTAButton>
        </div>
      </div>
    </article>
  );
}
