import { formatDate } from "@/lib/cms-display";
import type { Notice } from "@/types/cms";

export function NoticeStrip({ notices }: Readonly<{ notices: Notice[] }>) {
  const notice = notices.find((item) => item.is_pinned) ?? notices[0] ?? null;

  if (!notice) {
    return null;
  }

  return (
    <section className="border-b border-yellow-300/30 bg-[#0a2a5e]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3 text-sm text-blue-50 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <span className="shrink-0 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate-950 shadow-sm">
          Notice
        </span>
        <a className="font-bold text-white transition hover:text-yellow-300" href={`/notices/${notice.slug}`}>
          {notice.title}
        </a>
        {notice.published_at ? (
          <span className="text-blue-100">{formatDate(notice.published_at)}</span>
        ) : null}
      </div>
    </section>
  );
}
