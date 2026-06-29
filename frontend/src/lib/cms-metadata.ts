import type { Metadata } from "next";
import { resolveCmsAssetUrl } from "@/lib/api-client";
import { getSiteSettings } from "@/services/cms";
import type { SiteSetting } from "@/types/cms";

const GENERIC_TITLE = "Campus Website";
const GENERIC_DESCRIPTION = "CMS-managed public website.";

export async function createCmsMetadata({
  title,
  description,
  settings,
}: {
  title?: string | null;
  description?: string | null;
  settings?: SiteSetting;
}): Promise<Metadata> {
  const resolvedSettings = settings ?? (await getSiteSettings()).data;
  const siteTitle =
    resolvedSettings.site_title ??
    resolvedSettings.institute_name ??
    GENERIC_TITLE;
  const resolvedTitle = title ?? resolvedSettings.meta_title ?? siteTitle;
  const resolvedDescription =
    description ??
    resolvedSettings.meta_description ??
    resolvedSettings.site_tagline ??
    GENERIC_DESCRIPTION;
  const faviconUrl = resolveCmsAssetUrl(resolvedSettings.favicon_path);

  return {
    title: resolvedTitle === siteTitle ? resolvedTitle : `${resolvedTitle} | ${siteTitle}`,
    description: resolvedDescription,
    icons: faviconUrl
      ? {
          icon: faviconUrl,
        }
      : undefined,
  };
}
