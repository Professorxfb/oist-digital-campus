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
      "border-yellow-400 bg-yellow-400 text-[#061f3f] shadow-sm shadow-yellow-500/20 hover:border-white hover:bg-white hover:text-[#061f3f] hover:shadow-xl hover:shadow-slate-950/10",
    secondary:
      "border-white/20 bg-white text-slate-950 shadow-sm hover:border-yellow-300 hover:bg-yellow-50 hover:text-[#061f3f] hover:shadow-xl hover:shadow-slate-950/10",
    subtle:
      "border-blue-100 bg-blue-50 text-blue-950 hover:border-yellow-300 hover:bg-yellow-300 hover:text-[#061f3f] hover:shadow-xl hover:shadow-slate-950/10",
  }[variant];

  return (
    <a
      className={`group/cta inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full border px-5 py-2.5 text-sm font-black transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 ${variantClassName} ${className}`}
      href={href}
      target={target === "_blank" ? "_blank" : undefined}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
    >
      <span>{children}</span>
      <span className="relative ml-3 inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover/cta:translate-x-1">
        <span className="absolute h-1.5 w-1.5 rounded-full bg-current transition-all duration-300 group-hover/cta:h-px group-hover/cta:w-4" aria-hidden="true" />
        <svg
          className="h-3.5 w-3.5 translate-x-[-8px] opacity-0 transition-all duration-300 group-hover/cta:translate-x-1 group-hover/cta:opacity-100"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 8h9" />
          <path d="m8 4 4 4-4 4" />
        </svg>
      </span>
    </a>
  );
}
