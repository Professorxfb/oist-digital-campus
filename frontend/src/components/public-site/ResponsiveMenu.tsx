import type { MenuItem } from "@/types/cms";

export function ResponsiveMenu({
  items,
  label = "Menu",
}: Readonly<{
  items: MenuItem[];
  label?: string;
}>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex" aria-label={label}>
        <MenuItems items={items} />
      </nav>
      <details className="relative lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden">
          {label}
        </summary>
        <nav
          className="absolute right-0 z-30 mt-3 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
          aria-label={`${label} mobile`}
        >
          <MenuItems items={items} isMobile />
        </nav>
      </details>
    </>
  );
}

function MenuItems({
  items,
  isMobile = false,
}: Readonly<{
  items: MenuItem[];
  isMobile?: boolean;
}>) {
  return (
    <ul className={isMobile ? "space-y-1" : "flex items-center gap-1"}>
      {items.map((item) => (
        <li key={`${item.label}-${item.url}`} className="relative">
          <a
            className={
              isMobile
                ? "block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-800"
                : "rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-800"
            }
            href={item.url}
            target={item.target === "_blank" ? "_blank" : undefined}
            rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
          >
            {item.label}
          </a>
          {item.children.length > 0 ? (
            <div className={isMobile ? "ml-3 border-l border-slate-200 pl-2" : "hidden"}>
              <MenuItems items={item.children} isMobile />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
