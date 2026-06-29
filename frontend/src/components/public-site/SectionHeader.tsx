import { Container } from "@/components/public-site/Container";

export function SectionHeader({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string | null;
}>) {
  return (
    <Container className="mb-8">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        ) : null}
      </div>
    </Container>
  );
}
