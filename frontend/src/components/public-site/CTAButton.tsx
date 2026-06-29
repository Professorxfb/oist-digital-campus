export function CTAButton({
  href,
  children,
  variant = "primary",
  target,
  className = "",
}: Readonly<{
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "subtle";
  target?: "_self" | "_blank";
  className?: string;
}>) {
  const variantClassName = {
    primary:
      "border-yellow-400 bg-yellow-400 text-slate-950 shadow-sm shadow-yellow-500/20 hover:border-yellow-300 hover:bg-yellow-300",
    secondary:
      "border-white/20 bg-white text-slate-950 shadow-sm hover:border-yellow-300 hover:bg-yellow-50 hover:text-slate-950",
    subtle:
      "border-blue-100 bg-blue-50 text-blue-950 hover:border-blue-200 hover:bg-blue-100 hover:text-blue-950",
  }[variant];

  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${variantClassName} ${className}`}
      href={href}
      target={target === "_blank" ? "_blank" : undefined}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}
