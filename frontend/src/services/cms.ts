import { fetchCmsApi } from "@/lib/api-client";
import type {
  ApiFetchResult,
  Department,
  Download,
  Event,
  FacultyProfile,
  GalleryAlbum,
  HomepageSection,
  Menu,
  MenuLocation,
  NewsPost,
  Notice,
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

export function getNotices(): Promise<ApiFetchResult<Notice[]>> {
  return fetchCmsApi<Notice[]>("notices", []);
}

export function getNoticeBySlug(
  slug: string,
): Promise<ApiFetchResult<Notice | null>> {
  return fetchCmsApi<Notice | null>(`notices/${slug}`, null);
}

export function getNewsPosts(): Promise<ApiFetchResult<NewsPost[]>> {
  return fetchCmsApi<NewsPost[]>("news", []);
}

export function getNewsPostBySlug(
  slug: string,
): Promise<ApiFetchResult<NewsPost | null>> {
  return fetchCmsApi<NewsPost | null>(`news/${slug}`, null);
}

export function getEvents(): Promise<ApiFetchResult<Event[]>> {
  return fetchCmsApi<Event[]>("events", []);
}

export function getEventBySlug(
  slug: string,
): Promise<ApiFetchResult<Event | null>> {
  return fetchCmsApi<Event | null>(`events/${slug}`, null);
}

export function getGalleryAlbums(): Promise<ApiFetchResult<GalleryAlbum[]>> {
  return fetchCmsApi<GalleryAlbum[]>("gallery-albums", []);
}

export function getGalleryAlbumBySlug(
  slug: string,
): Promise<ApiFetchResult<GalleryAlbum | null>> {
  return fetchCmsApi<GalleryAlbum | null>(`gallery-albums/${slug}`, null);
}

export function getDownloads(): Promise<ApiFetchResult<Download[]>> {
  return fetchCmsApi<Download[]>("downloads", []);
}

export function getDepartments(): Promise<ApiFetchResult<Department[]>> {
  return fetchCmsApi<Department[]>("departments", []);
}

export function getDepartmentBySlug(
  slug: string,
): Promise<ApiFetchResult<Department | null>> {
  return fetchCmsApi<Department | null>(`departments/${slug}`, null);
}

export function getFacultyProfiles(): Promise<ApiFetchResult<FacultyProfile[]>> {
  return fetchCmsApi<FacultyProfile[]>("faculty-profiles", []);
}
