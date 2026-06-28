# CMS-Driven Frontend Architecture

This document defines how the OIST Digital Campus public website frontend must remain CMS-driven and backend-controlled. It complements `docs/PROJECT_BLUEPRINT.md` and `AGENTS.md`.

## 1. Core Rule

The Next.js frontend must render public website content from Laravel API data. It must not become a second content store.

Hard-coded public website content is allowed only when it is structural UI text that staff should not need to edit, such as generic loading labels, fallback labels, form control text, accessibility text, and layout mechanics.

## 2. CMS-Controlled Content List

The following content must be managed through Laravel + Filament and exposed through public API endpoints:

- Logo
- Favicon
- Website title
- Institute identity text
- SEO title
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Robots/indexing controls for public pages
- Hero title
- Hero subtitle
- Hero image
- Hero video
- Homepage banners
- CTA button text
- CTA button links
- Header menu
- Footer menu
- Footer text
- Important links
- Social media links
- Contact details
- Popup notices
- Notices
- Admission circulars
- News
- Events
- Gallery images
- Gallery albums
- Course information
- Department information
- Faculty profiles
- Scholarship information
- Download files
- Homepage section visibility
- Homepage section order
- Homepage section headings
- Homepage section item limits
- Homepage section CTA configuration

If staff may reasonably need to update the content without a developer, it belongs in the CMS.

## 3. API Endpoint Planning

The backend should expose clean, versioned, read-only public API endpoints for CMS content. Endpoint names may be refined during implementation, but the public API should cover these resource groups:

- `GET /api/v1/public/site-settings`: logo, favicon, website title, default SEO, contact summary, social links, and global settings.
- `GET /api/v1/public/menus/header`: header menu tree.
- `GET /api/v1/public/menus/footer`: footer menu tree.
- `GET /api/v1/public/homepage`: homepage page metadata and ordered section configuration.
- `GET /api/v1/public/pages/{slug}`: CMS page content and SEO metadata.
- `GET /api/v1/public/notices`: published notices with pagination and filters.
- `GET /api/v1/public/notices/{slug}`: notice detail.
- `GET /api/v1/public/popup-notices`: active popup notices.
- `GET /api/v1/public/news`: published news list.
- `GET /api/v1/public/news/{slug}`: news detail.
- `GET /api/v1/public/events`: published event list.
- `GET /api/v1/public/events/{slug}`: event detail.
- `GET /api/v1/public/departments`: published department list.
- `GET /api/v1/public/departments/{slug}`: department detail.
- `GET /api/v1/public/courses`: published course/program list.
- `GET /api/v1/public/courses/{slug}`: course/program detail.
- `GET /api/v1/public/faculty`: published faculty profile list.
- `GET /api/v1/public/faculty/{slug}`: faculty profile detail.
- `GET /api/v1/public/galleries`: gallery albums.
- `GET /api/v1/public/galleries/{slug}`: gallery album detail.
- `GET /api/v1/public/downloads`: published downloads and admission circular files.
- `GET /api/v1/public/admission`: admission information and active admission circulars.
- `GET /api/v1/public/scholarships`: scholarship information.
- `GET /api/v1/public/contact`: contact page data.

Public endpoints must not expose unpublished, private, draft, expired, sensitive, or role-restricted data.

## 4. Frontend Rendering Rules

- The frontend must fetch editable public content from Laravel APIs.
- Public pages should use server-side fetching, static generation, or revalidation-friendly fetching so content remains crawlable and fast.
- Client-side fetching should be reserved for non-critical interactive enhancements.
- Components must be reusable and data-driven.
- Components should render based on backend-provided content, visibility, order, media, links, and metadata.
- Components must handle missing optional fields gracefully.
- Unknown homepage section types should be ignored safely or rendered through an approved generic fallback only if the architect approves that pattern.
- Expired notices, unpublished content, and disabled sections must not render.
- Public website data types must align with backend API contracts.
- The frontend must not duplicate backend business rules for publication, scheduling, permissions, or content eligibility.

## 5. Backend Admin Management Rules

- Filament is the staff-facing CMS management interface.
- Authorized staff must be able to update public website content without developer help.
- CMS resources must use role and permission checks.
- CMS resources should support draft, published, scheduled, archived, active, inactive, and expired states where relevant.
- CMS resources should support ordering where order affects display.
- CMS resources should support preview fields where practical.
- Sensitive administrative data must not be mixed into public CMS endpoints.
- Publishing, unpublishing, deleting, and changing important content should be auditable.
- Media uploads must be validated before publication.
- CMS forms must provide clear validation messages suitable for non-technical staff.

## 6. Image, Video, and File Handling Rules

- Public CMS media must be uploaded and managed through Laravel/Filament.
- Media records should store file URL/path, type, size, alt text, caption, status, ordering, and ownership metadata where useful.
- Logo, favicon, hero images, hero videos, banners, gallery images, faculty photos, news images, event images, department images, course images, circulars, and downloadable files must come from backend-managed media records.
- Public images should include alt text before publication.
- Public media files must be validated by MIME type, extension, and size.
- Sensitive files such as applicant documents, student records, payment receipts, and certificates must never be exposed through public CMS media endpoints.
- Downloadable files should expose safe metadata such as title, file type, size, publish date, and public URL.
- The frontend should render responsive media and avoid hard-coded media URLs except for architect-approved emergency fallback assets.

## 7. SEO Metadata Rules

- Backend CMS data is the source of truth for public SEO metadata.
- Filament should allow authorized staff to manage SEO title, meta description, slug, canonical URL, Open Graph title, Open Graph description, Open Graph image, robots behavior, and structured data fields where appropriate.
- The frontend should render backend-provided SEO metadata using Next.js metadata features.
- If page-specific SEO metadata is missing, the frontend may fall back to backend-provided global SEO defaults.
- Hard-coded SEO fallbacks must be generic and minimal.
- Portal, admin, authenticated, private, draft, and preview pages must not be indexed.
- Sitemap and robots behavior should be generated from published public content only.

## 8. Homepage Section Control Rules

The homepage must be controlled by backend configuration. Filament should allow authorized staff to enable, disable, reorder, and configure homepage sections.

Planned section types:

- Hero
- Banner/slider
- Popup notices
- Notices
- Admission CTA
- Departments
- Courses/programs
- Faculty highlights
- News
- Events
- Gallery
- Scholarship information
- Downloads
- Contact block
- Important links

Each homepage section should support:

- Section key/type
- Display title
- Optional subtitle
- Visibility status
- Sort order
- Content source
- Item limit
- CTA label
- CTA URL
- Media reference where applicable
- Publish scheduling where applicable

The frontend should render known active sections in the order provided by the backend.

## 9. Header, Footer, and Menu Control Rules

- Header menu must be CMS-controlled.
- Footer menu must be CMS-controlled.
- Important links must be CMS-controlled.
- Social links must be CMS-controlled.
- Footer text must be CMS-controlled.
- Contact summary in the footer must be CMS-controlled.
- Menu items should support label, URL, target, parent item, sort order, visibility, and publish status.
- The frontend should support nested menus only to the depth approved by the design.
- Hard-coded navigation is allowed only for structural application behavior and must not replace public CMS menus.

## 10. Fallback and Error Handling Rules

The frontend must fail gracefully when public CMS APIs are unavailable or return incomplete data.

Rules:

- Use generated or cached content when available.
- Show a polished maintenance/error state for critical page-level failures.
- Show empty states for non-critical sections when data is unavailable.
- Do not invent institutional content in frontend fallback states.
- Do not render expired urgent notices from stale data.
- Use backend-provided global SEO defaults when page-specific SEO fails.
- Use minimal generic metadata only when no backend SEO data is available.
- Log or report public content fetch failures when monitoring is implemented.
- Keep fallback behavior simple enough that staff still understand the CMS is the source of truth.

## 11. Implementation Boundary

This document is architectural guidance only. It does not create application code, database tables, API routes, models, Filament resources, frontend components, or packages by itself.

