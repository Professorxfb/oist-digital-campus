export function CTAButton({
  href,
  children,
  variant = "primary",
  target,
}: Readonly<{
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "subtle";
  target?: "_self" | "_blank";
}>) {
  const variantClassName = {
    primary:
      "border-blue-700 bg-blue-700 text-white shadow-sm hover:border-blue-800 hover:bg-blue-800",
    secondary:
      "border-slate-300 bg-white text-slate-900 shadow-sm hover:border-blue-200 hover:text-blue-800",
    subtle:
      "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-950",
  }[variant];

  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${variantClassName}`}
      href={href}
      target={target === "_blank" ? "_blank" : undefined}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
