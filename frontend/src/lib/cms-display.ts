import { resolveCmsAssetUrl } from "@/lib/api-client";
import type { HomepageSection } from "@/types/cms";

export function findHomepageSection(
  sections: HomepageSection[],
  key: string,
): HomepageSection | null {
  return sections.find((section) => section.key === key) ?? null;
}

export function formatDate(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

export function formatTimeRange(
  startTime?: string | null,
  endTime?: string | null,
): string | null {
  const values = [startTime, endTime].filter(Boolean);

  return values.length > 0 ? values.join(" - ") : null;
}

export function getCmsAssetUrl(path?: string | null): string | null {
  return resolveCmsAssetUrl(path ?? null);
}

export function getTextPreview(value?: string | null, maxLength = 150): string | null {
  if (!value) {
    return null;
  }

  const plainText = value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trim()}...`;
}
