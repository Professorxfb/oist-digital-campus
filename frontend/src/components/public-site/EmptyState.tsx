export function EmptyState({
  title = "Content is being prepared",
  message = "This section will show published CMS content when it is available.",
}: Readonly<{
  title?: string;
  message?: string;
}>) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-7 text-sm text-slate-600 shadow-sm">
      <div className="mb-4 h-10 w-10 rounded-full bg-[linear-gradient(135deg,#facc15,#1d4ed8)]" aria-hidden="true" />
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-2 max-w-xl leading-6">{message}</p>
    </div>
  );
}
