export function SearchForm({
  query,
}: Readonly<{
  query: string;
}>) {
  return (
    <form action="/search" className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <label className="text-sm font-semibold text-slate-950" htmlFor="site-search">
        Search public content
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="site-search"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Type at least 2 characters"
          className="min-h-11 flex-1 rounded-md border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-blue-700 bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:border-blue-800 hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
