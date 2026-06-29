import type { MenuItem } from "@/types/cms";

export function ResponsiveMenu({
  items,
  label = "Menu",
  action,
  links = [],
}: Readonly<{
  items: MenuItem[];
  label?: string;
  action?: {
    href: string;
    label: string;
  } | null;
  links?: Array<{
    href: string;
    label: string;
  }>;
}>) {
  if (items.length === 0 && !action && links.length === 0) {
    return null;
  }

  return (
    <>
      <nav className="hidden items-center gap-1 xl:flex" aria-label={label}>
        <MenuItems items={items} />
      </nav>
      <details className="relative xl:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-sm font-bold text-white marker:hidden transition hover:border-yellow-300 hover:bg-yellow-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300 [&::-webkit-details-marker]:hidden">
          {label}
        </summary>
        <nav
          className="absolute right-0 z-30 mt-3 max-h-[calc(100vh-7rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
          aria-label={`${label} mobile`}
        >
          <MenuItems items={items} variant="mobile" />
          {links.length > 0 ? (
            <div className="mt-3 border-t border-slate-100 pt-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-900"
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
          {action ? (
            <a
              className="mt-3 flex min-h-11 items-center justify-center rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
              href={action.href}
            >
              {action.label}
            </a>
          ) : null}
        </nav>
      </details>
    </>
  );
}

function MenuItems({
  items,
  variant = "desktop",
}: Readonly<{
  items: MenuItem[];
  variant?: "desktop" | "dropdown" | "mobile";
}>) {
  const isMobile = variant === "mobile";
  const isDropdown = variant === "dropdown";

  return (
    <ul className={isMobile || isDropdown ? "space-y-1" : "flex items-center gap-1"}>
      {items.map((item) => (
        <li key={`${item.label}-${item.url}`} className="group relative">
          <a
            className={
              isMobile
                ? "block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-900"
                : isDropdown
                  ? "flex min-h-10 items-center justify-between rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                : "inline-flex min-h-10 items-center rounded-full px-3 py-2 text-sm font-bold text-white/90 transition-colors hover:bg-white/10 hover:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            }
            href={item.url}
            target={item.target === "_blank" ? "_blank" : undefined}
            rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
          >
            {item.label}
            {!isMobile && !isDropdown && item.children.length > 0 ? (
              <span className="ml-1 text-[10px] text-yellow-300" aria-hidden="true">
                v
              </span>
            ) : null}
          </a>
          {item.children.length > 0 ? (
            <div
              className={
                isMobile || isDropdown
                  ? "ml-3 border-l border-slate-200 pl-2"
                  : "invisible absolute left-0 top-full z-40 min-w-56 translate-y-2 rounded-2xl border border-slate-100 bg-white p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
              }
            >
              <MenuItems items={item.children} variant={isMobile ? "mobile" : "dropdown"} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
