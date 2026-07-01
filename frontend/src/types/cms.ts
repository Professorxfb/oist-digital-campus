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
  meta: Record<string, unknown>;
  error: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface PaginatedApiResponse<TData> {
  success: boolean;
  message: string | null;
  data: TData[];
  meta: PaginationMeta;
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
  metadata: Record<string, unknown> & {
    gallery_images?: string[] | string | null;
    video_url?: string | null;
    youtube_url?: string | null;
    chairman_name?: string | null;
    chairman_designation?: string | null;
    signature_image?: string | null;
    quote_label?: string | null;
    layout_variant?: string | null;
    features?: unknown;
    feature_list?: unknown;
  };
}

export type HeroFeatureCardIconKey =
  | "library"
  | "educator"
  | "achievement"
  | "default";

export type HeroFeatureCardStyleVariant = "navy" | "yellow" | string;

export interface HeroFeatureCard {
  title: string;
  description?: string | null;
  icon_key: HeroFeatureCardIconKey | string;
  image_path?: string | null;
  style_variant: HeroFeatureCardStyleVariant;
  button_text?: string | null;
  button_url?: string | null;
  sort_order: number;
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

export interface Notice {
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  featured_image_path?: string | null;
  category?: string | null;
  audience?: string | null;
  attachment_path?: string | null;
  external_link?: string | null;
  video_url?: string | null;
  is_pinned?: boolean;
  is_published?: boolean;
  published_at?: string | null;
  expires_at?: string | null;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface NewsPost {
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  featured_image_path?: string | null;
  category?: string | null;
  department?: FacultyProfileDepartment | null;
  tags?: string[];
  author_name?: string | null;
  is_featured?: boolean;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface Event {
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  featured_image_path?: string | null;
  location?: string | null;
  event_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  registration_url?: string | null;
  is_featured?: boolean;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface GalleryItem {
  title?: string | null;
  image_path: string;
  caption?: string | null;
  sort_order?: number;
}

export interface GalleryAlbum {
  title: string;
  slug: string;
  description?: string | null;
  cover_image_path?: string | null;
  sort_order?: number;
  items?: GalleryItem[];
}

export interface Download {
  title: string;
  slug: string;
  description?: string | null;
  file_path: string;
  category?: string | null;
  sort_order?: number;
}

export interface FacultyProfileDepartment {
  name: string;
  slug: string;
}

export interface FacultyProfile {
  name: string;
  slug: string;
  designation?: string | null;
  department?: FacultyProfileDepartment | null;
  photo_path?: string | null;
  short_bio?: string | null;
  email?: string | null;
  phone?: string | null;
  sort_order?: number;
}

export interface Department {
  name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  featured_image_path?: string | null;
  icon?: string | null;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  faculty_profiles?: FacultyProfile[];
}

export interface AcademicProgram {
  title: string;
  slug: string;
  category?: string | null;
  short_description?: string | null;
  description?: string | null;
  featured_image_path?: string | null;
  icon?: string | null;
  bullet_points?: string[] | null;
  button_text?: string | null;
  button_url?: string | null;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

export type InstitutionalPageType =
  | "about"
  | "mission"
  | "vision"
  | "values"
  | "why_choose_us"
  | "campus_life"
  | "facilities"
  | "accreditation"
  | "student_support"
  | "general";

export interface InstitutionalPage {
  title: string;
  slug: string;
  page_type: InstitutionalPageType | string;
  excerpt?: string | null;
  body?: string | null;
  featured_image_path?: string | null;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface Scholarship {
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  eligibility?: string | null;
  benefits?: string | null;
  application_process?: string | null;
  deadline?: string | null;
  attachment_path?: string | null;
  is_featured?: boolean;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface Facility {
  title: string;
  slug: string;
  summary?: string | null;
  description?: string | null;
  image_path?: string | null;
  icon?: string | null;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface FAQ {
  question: string;
  answer: string;
  category?: string | null;
  sort_order?: number;
}

export interface LeadershipProfile {
  name: string;
  slug: string;
  designation?: string | null;
  message?: string | null;
  short_bio?: string | null;
  photo_path?: string | null;
  email?: string | null;
  phone?: string | null;
  sort_order?: number;
}

export type VideoType = "youtube" | "facebook" | "vimeo" | "uploaded" | "external";

export interface Video {
  title: string;
  slug: string;
  excerpt?: string | null;
  description?: string | null;
  video_type?: VideoType | string;
  video_url?: string | null;
  embed_url?: string | null;
  thumbnail_path?: string | null;
  category?: string | null;
  tags?: string[];
  event_date?: string | null;
  is_featured?: boolean;
  published_at?: string | null;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface SearchResult {
  type: string;
  title: string;
  excerpt?: string | null;
  url: string;
  published_at?: string | null;
}
