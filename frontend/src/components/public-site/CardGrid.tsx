export function CardGrid({
  children,
  columns = "three",
}: Readonly<{
  children: React.ReactNode;
  columns?: "two" | "three";
}>) {
  const columnClassName =
    columns === "two" ? "lg:grid-cols-2" : "lg:grid-cols-3";

  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${columnClassName}`}>{children}</div>
  );
}
