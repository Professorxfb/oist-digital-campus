export interface ApiResponse<TData> {
  success: boolean;
  message: string | null;
  data: TData;
  meta: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  errors: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export interface ApiFetchResult<TData> {
  data: TData;
  error: string | null;
}

export interface SiteSetting {
  institute_name: string | null;
  site_title: string | null;
  site_tagline: string | null;
  meta_title: string | null;
  meta_description: string | null;
  logo_path: string | null;
  dark_logo_path: string | null;
  favicon_path: string | null;
  primary_phone: string | null;
  secondary_phone: string | null;
  email: string | null;
  address: string | null;
  google_map_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  whatsapp_number: string | null;
  footer_text: string | null;
  admission_cta_text: string | null;
  admission_cta_url: string | null;
  is_admission_open: boolean;
  popup_notice_title: string | null;
  popup_notice_body: string | null;
  is_popup_notice_enabled: boolean;
}

export interface HomepageSection {
  key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_path: string | null;
  video_path: string | null;
  button_text: string | null;
  button_url: string | null;
  sort_order: number;
  metadata: Record<string, unknown>;
}

export type MenuLocation = "header" | "footer" | "quick_links";

export interface MenuItem {
  label: string;
  url: string;
  target: "_self" | "_blank" | string;
  sort_order: number;
  children: MenuItem[];
}

export interface Menu {
  location: MenuLocation | string;
  items: MenuItem[];
}
