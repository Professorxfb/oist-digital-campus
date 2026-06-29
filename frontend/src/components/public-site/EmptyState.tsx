export function EmptyState({
  title = "Content is being prepared",
  message = "This section will show published CMS content when it is available.",
}: Readonly<{
  title?: string;
  message?: string;
}>) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2 leading-6">{message}</p>
    </div>
  );
}
