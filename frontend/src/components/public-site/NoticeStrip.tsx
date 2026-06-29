import { formatDate } from "@/lib/cms-display";
import type { Notice } from "@/types/cms";

export function NoticeStrip({ notices }: Readonly<{ notices: Notice[] }>) {
  const notice = notices.find((item) => item.is_pinned) ?? notices[0] ?? null;

  if (!notice) {
    return null;
  }

  return (
    <section className="border-b border-blue-100 bg-[linear-gradient(90deg,#eff6ff,#f0fdfa)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <span className="shrink-0 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm">
          Notice
        </span>
        <a className="font-semibold text-slate-950 transition hover:text-blue-800" href={`/notices/${notice.slug}`}>
          {notice.title}
        </a>
        {notice.published_at ? (
          <span className="text-slate-500">{formatDate(notice.published_at)}</span>
        ) : null}
      </div>
    </section>
  );
}
