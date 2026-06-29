import { Container } from "@/components/public-site/Container";

export function PageIntro({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow?: string;
  title: string;
  description?: string | null;
}>) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#071733] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(250,204,21,0.16),transparent_24%),linear-gradient(135deg,#020617,#071733_58%,#0a2a5e)]" aria-hidden="true" />
      <Container className="relative py-14 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-sm font-black uppercase tracking-[0.18em] text-yellow-300">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 text-base font-medium leading-8 text-blue-50 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
