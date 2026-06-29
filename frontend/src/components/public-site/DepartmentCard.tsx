import { ContentCard } from "@/components/public-site/ContentCard";
import type { Department } from "@/types/cms";

export function DepartmentCard({ department }: Readonly<{ department: Department }>) {
  return (
    <ContentCard
      title={department.name}
      description={department.short_description}
      imagePath={department.featured_image_path}
      meta={[department.icon]}
      href={`/departments/${department.slug}`}
    />
  );
}
