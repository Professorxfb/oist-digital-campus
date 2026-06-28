import { fetchCmsApi } from "@/lib/api-client";
import type {
  ApiFetchResult,
  HomepageSection,
  Menu,
  MenuLocation,
  SiteSetting,
} from "@/types/cms";

export const emptySiteSettings: SiteSetting = {
  institute_name: null,
  site_title: null,
  site_tagline: null,
  meta_title: null,
  meta_description: null,
  logo_path: null,
  dark_logo_path: null,
  favicon_path: null,
  primary_phone: null,
  secondary_phone: null,
  email: null,
  address: null,
  google_map_url: null,
  facebook_url: null,
  youtube_url: null,
  linkedin_url: null,
  whatsapp_number: null,
  footer_text: null,
  admission_cta_text: null,
  admission_cta_url: null,
  is_admission_open: false,
  popup_notice_title: null,
  popup_notice_body: null,
  is_popup_notice_enabled: false,
};

export function getSiteSettings(): Promise<ApiFetchResult<SiteSetting>> {
  return fetchCmsApi<SiteSetting>("site-settings", emptySiteSettings);
}

export function getHomepageSections(): Promise<
  ApiFetchResult<HomepageSection[]>
> {
  return fetchCmsApi<HomepageSection[]>("homepage-sections", []);
}

export function getMenuByLocation(
  location: MenuLocation,
): Promise<ApiFetchResult<Menu>> {
  return fetchCmsApi<Menu>(`menus/${location}`, {
    location,
    items: [],
  });
}
