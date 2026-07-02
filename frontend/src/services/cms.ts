import { fetchCmsApi } from "@/lib/api-client";
import { cmsApiBaseUrl } from "@/lib/api-client";
import type {
  AdmissionApplicationPayload,
  ApiFetchResult,
  ApiMutationResult,
  AboutSectionContent,
  AcademicProgram,
  CampusLifeSectionContent,
  ChairmanMessageContent,
  Department,
  Download,
  Event,
  Facility,
  FAQ,
  FacultyProfile,
  GalleryAlbum,
  HeroSectionContent,
  HeroFeatureCard,
  HomepageSection,
  InstitutionalPage,
  InstitutionalPageType,
  LeadershipProfile,
  Menu,
  MenuLocation,
  NewsPost,
  Notice,
  OistLabContent,
  Scholarship,
  SearchResult,
  SiteSetting,
  Video,
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

export function getHeroSection(): Promise<ApiFetchResult<HeroSectionContent | null>> {
  return fetchCmsApi<HeroSectionContent | null>("hero-section", null);
}

export function getAboutSection(): Promise<ApiFetchResult<AboutSectionContent | null>> {
  return fetchCmsApi<AboutSectionContent | null>("about-section", null);
}

export function getChairmanMessage(): Promise<ApiFetchResult<ChairmanMessageContent | null>> {
  return fetchCmsApi<ChairmanMessageContent | null>("chairman-message", null);
}

export function getOistLab(): Promise<ApiFetchResult<OistLabContent | null>> {
  return fetchCmsApi<OistLabContent | null>("oist-lab", null);
}

export function getCampusLifeSection(): Promise<
  ApiFetchResult<CampusLifeSectionContent | null>
> {
  return fetchCmsApi<CampusLifeSectionContent | null>("campus-life-section", null);
}

export function getHeroFeatureCards(): Promise<
  ApiFetchResult<HeroFeatureCard[]>
> {
  return fetchCmsApi<HeroFeatureCard[]>("hero-feature-cards", []);
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

export function getAcademicPrograms(): Promise<ApiFetchResult<AcademicProgram[]>> {
  return fetchCmsApi<AcademicProgram[]>("academic-programs", []);
}

export function getDepartmentBySlug(
  slug: string,
): Promise<ApiFetchResult<Department | null>> {
  return fetchCmsApi<Department | null>(`departments/${slug}`, null);
}

export function getFacultyProfiles(): Promise<ApiFetchResult<FacultyProfile[]>> {
  return fetchCmsApi<FacultyProfile[]>("faculty-profiles", []);
}

export function getFacultyProfileBySlug(
  slug: string,
): Promise<ApiFetchResult<FacultyProfile | null>> {
  return fetchCmsApi<FacultyProfile | null>(`faculty-profiles/${slug}`, null);
}

export function getInstitutionalPages(): Promise<
  ApiFetchResult<InstitutionalPage[]>
> {
  return fetchCmsApi<InstitutionalPage[]>("institutional-pages", []);
}

export function getInstitutionalPageBySlug(
  slug: string,
): Promise<ApiFetchResult<InstitutionalPage | null>> {
  return fetchCmsApi<InstitutionalPage | null>(
    `institutional-pages/${slug}`,
    null,
  );
}

export async function getInstitutionalPageByType(
  type: InstitutionalPageType,
): Promise<ApiFetchResult<InstitutionalPage | null>> {
  const result = await getInstitutionalPages();

  return {
    ...result,
    data: result.data.find((page) => page.page_type === type) ?? null,
  };
}

export function getScholarships(): Promise<ApiFetchResult<Scholarship[]>> {
  return fetchCmsApi<Scholarship[]>("scholarships", []);
}

export function getScholarshipBySlug(
  slug: string,
): Promise<ApiFetchResult<Scholarship | null>> {
  return fetchCmsApi<Scholarship | null>(`scholarships/${slug}`, null);
}

export function getFacilities(): Promise<ApiFetchResult<Facility[]>> {
  return fetchCmsApi<Facility[]>("facilities", []);
}

export function getFacilityBySlug(
  slug: string,
): Promise<ApiFetchResult<Facility | null>> {
  return fetchCmsApi<Facility | null>(`facilities/${slug}`, null);
}

export function getFaqs(): Promise<ApiFetchResult<FAQ[]>> {
  return fetchCmsApi<FAQ[]>("faqs", []);
}

export function getLeadershipProfiles(): Promise<
  ApiFetchResult<LeadershipProfile[]>
> {
  return fetchCmsApi<LeadershipProfile[]>("leadership-profiles", []);
}

export function getLeadershipProfileBySlug(
  slug: string,
): Promise<ApiFetchResult<LeadershipProfile | null>> {
  return fetchCmsApi<LeadershipProfile | null>(
    `leadership-profiles/${slug}`,
    null,
  );
}

export function getVideos(): Promise<ApiFetchResult<Video[]>> {
  return fetchCmsApi<Video[]>("videos", []);
}

export function getVideoBySlug(
  slug: string,
): Promise<ApiFetchResult<Video | null>> {
  return fetchCmsApi<Video | null>(`videos/${slug}`, null);
}

export function searchPublicContent(
  query: string,
): Promise<ApiFetchResult<SearchResult[]>> {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    return Promise.resolve({
      data: [],
      meta: {},
      error: null,
    });
  }

  return fetchCmsApi<SearchResult[]>(
    `search?q=${encodeURIComponent(normalizedQuery)}`,
    [],
  );
}

export async function submitAdmissionApplication(
  payload: AdmissionApplicationPayload,
): Promise<ApiMutationResult> {
  try {
    const response = await fetch(`${cmsApiBaseUrl}/admission-applications`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: unknown = await response.json().catch(() => null);

    if (response.ok && isMutationResponse(data)) {
      return {
        success: true,
        message: data.message ?? "Application submitted successfully. We will contact you soon.",
        errors: {},
      };
    }

    return {
      success: false,
      message: getMutationMessage(data),
      errors: getValidationErrors(data),
    };
  } catch {
    return {
      success: false,
      message: "Application submission failed. Please try again.",
      errors: {},
    };
  }
}

function isMutationResponse(payload: unknown): payload is { success: boolean; message?: string | null } {
  return Boolean(payload && typeof payload === "object" && "success" in payload);
}

function getMutationMessage(payload: unknown): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return "Application submission failed. Please check the form and try again.";
}

function getValidationErrors(payload: unknown): Record<string, string[]> {
  if (!payload || typeof payload !== "object" || !("errors" in payload)) {
    return {};
  }

  const errors = (payload as { errors?: unknown }).errors;

  if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(errors as Record<string, unknown>)
      .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]))
      .map(([key, value]) => [key, value.filter((message): message is string => typeof message === "string")]),
  );
}
