# OIST Digital Campus Platform - Technical Blueprint

## 1. Project Overview

OIST Digital Campus Platform is a production-ready digital platform for OIST, a diploma engineering institute. The platform will combine a public institutional website, content management system, online admission workflow, student services, teacher services, staff operations, and a REST API into one maintainable ecosystem.

The platform will be built as a decoupled application:

- Frontend: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- Backend: Laravel 12, Filament v4, MySQL
- Deployment: Vercel for frontend, cPanel for backend, MySQL database, GitHub for version control

The architecture must support long-term institutional use, easy staff management, secure access control, mobile-first experiences, strong SEO, and clean separation between public content, academic operations, and administrative workflows.

## 2. Main Goals

- Present OIST publicly through a fast, SEO-friendly institutional website.
- Allow non-technical staff to manage website content through a CMS/admin panel.
- Provide a structured online admission system from application to final enrollment.
- Give students a secure portal for academic, administrative, and payment-related information.
- Give teachers a secure portal for class, course, attendance, notice, and academic workflows.
- Give staff and administrators operational tools for managing institute data.
- Expose a secure REST API for frontend, portals, and future integrations.
- Establish a maintainable architecture suitable for phased development and future expansion.

## 3. Functional Requirements

The system must provide:

- Public website with institutional pages, departments, notices, news, events, galleries, admission information, and contact details.
- CMS for managing dynamic public content without developer involvement.
- Admin panel for users, roles, permissions, academic data, admissions, content, reports, and settings.
- Online admission application form with applicant account, document upload, fee/payment tracking, review, approval, rejection, and enrollment conversion.
- Student portal with profile, academic information, notices, attendance, results, fees, documents, and support requests.
- Teacher portal with profile, assigned departments/courses/classes, student lists, attendance, notices, materials, and academic updates.
- Staff portal for admissions, records, content, student services, and reporting.
- REST API for frontend content, authentication, portal data, admission workflows, and administrative operations.
- Notification support for email and optional SMS integration.
- Audit trail for sensitive administrative actions.

## 4. Non-Functional Requirements

- Production-ready: robust validation, secure configuration, backups, monitoring, and deployment procedures.
- Secure: strong authentication, role-based authorization, protected uploads, rate limiting, CSRF protection where applicable, and least-privilege access.
- Scalable: modular domain design, API-first architecture, optimized database schema, cacheable public content, and deployable frontend/backend separation.
- Mobile-first: responsive layouts and portal workflows optimized for phones, tablets, and desktops.
- SEO-friendly: server-rendered public pages, metadata management, sitemap, structured data, Open Graph, and clean URLs.
- Accessible: WCAG-conscious UI, keyboard support, readable contrast, semantic HTML, and form error clarity.
- Maintainable: clear folder structure, consistent naming, service boundaries, documented APIs, tests, and disciplined Git workflow.
- Staff-friendly: simple CMS flows, validation hints, preview support where needed, and minimal operational complexity.
- Reliable: database backups, error logging, graceful failure states, and clear administrative recovery procedures.

## 5. Complete Module Breakdown

### Public Website Module

- Home page
- About OIST
- Departments
- Programs and curriculum information
- Admission information
- Notices
- News and events
- Gallery
- Faculty and staff directory
- Facilities
- Student life
- Contact page
- Search and archive pages

#### Public Website Target Style

The public website should follow a premium blue university/institution design direction inspired by `https://univet.rstheme.com/blue-two/`.

The approved reference URL and user-provided screenshots are visual guidance for the next public frontend redesign. The reference is approved for visual inspiration only. The project must not copy WordPress source code, proprietary assets, exact HTML/CSS, copyrighted images, icons, text, branding, or implementation details from the reference. OIST is not using WordPress; the frontend must be rebuilt with project-owned Next.js components, Tailwind CSS, shadcn/ui where appropriate, and Laravel CMS API data.

Target visual qualities:

- Premium university/institution feel.
- Dark navy institutional header.
- Yellow accent buttons and highlighted actions.
- Large hero image/banner section.
- Navy/blue hero and overlay sections.
- White/off-white content sections.
- Premium university typography and clear hierarchy.
- Modern rounded card-based sections.
- Dropdown navigation.
- Strong section spacing and rhythm comparable to the reference.
- Latest notices section replacing a generic academics/programs-heavy homepage section.
- Departments section replacing the faculties/departments reference pattern.
- Chairman or leadership message section.
- Video showcase section.
- Dark blue institutional footer.
- Clean responsive layout for desktop, tablet, and mobile.

### Homepage Section Direction

The public homepage should be CMS-driven and composed from these planned sections:

- Premium hero.
- Hero feature/stat cards.
- Notice strip.
- About or institutional intro.
- Latest notices replacing a generic academics/programs section.
- Departments replacing the reference faculties/departments section pattern.
- Chairman message.
- Scholarships.
- Facilities.
- Video showcase.
- News and events.
- Gallery/campus life.
- Footer.

Empty homepage sections should be hidden in production-style UI unless the architect explicitly requests a development empty state.

### Public Header Requirements

The public header should include:

- CMS-managed logo, title, and tagline.
- CMS-managed dropdown menu.
- Search button/link to `/search`.
- Student Portal placeholder link until real authentication is built.
- Faculty Portal placeholder link until real authentication is built.
- Apply Now CTA using CMS-managed admission CTA settings.
- Dark navy visual treatment with yellow accent actions.

The header must not hard-code editable institutional content. Search, Student Portal, and Faculty Portal links are structural navigation affordances, not CMS content requirements.

### Public Footer Requirements

The public footer should include:

- CMS-managed contact information.
- CMS-managed footer menu.
- CMS-managed quick links.
- CMS-managed social links.
- Portal links for Student Portal and Faculty Portal as structural placeholders until real authentication is implemented.
- Dark blue institutional visual treatment.

### CMS Module

- Pages
- Menus
- Banners and sliders
- Notices
- News
- Events
- Galleries
- Downloads
- Department content
- Faculty profiles
- SEO metadata
- Contact information
- Site settings

### Admission Module

- Admission session setup
- Program/department availability
- Applicant registration
- Application form
- Guardian and academic information
- Document upload
- Application fee tracking
- Application review
- Merit/selection status
- Admission approval or rejection
- Applicant communication
- Enrollment conversion
- Admission reports

### Student Portal Module

- Student dashboard
- Profile and guardian information
- Academic records
- Class routine
- Attendance summary
- Result view
- Fees and payment status
- Notices and announcements
- Downloadable documents
- Support/service requests

### Teacher Portal Module

- Teacher dashboard
- Profile management
- Assigned departments, courses, and classes
- Student lists
- Attendance management
- Academic materials
- Internal notices
- Result/assessment support, if approved by academic policy

### Staff/Admin Portal Module

- User management
- Role and permission management
- Student records
- Teacher records
- Staff records
- Department management
- Course and program management
- Session, semester, and batch management
- Admission operations
- CMS operations
- Reports
- Settings
- Audit logs

### API Module

- Public content API
- Authentication API
- Admission API
- Student portal API
- Teacher portal API
- Staff/admin API
- File upload API
- Notification API
- Reporting API

## 6. User Roles and Permissions

### Primary Roles

- Super Admin
- Admin
- Principal/Director
- Admission Officer
- Academic Officer
- Accounts Officer
- CMS Editor
- Teacher
- Student
- Applicant
- Staff

### Permission Principles

- Super Admin has full system access.
- Admin manages operational settings and users but may be restricted from destructive system-level actions.
- Principal/Director can view high-level reports and approve sensitive academic/admission decisions.
- Admission Officer manages admission sessions, applications, review status, and applicant communication.
- Academic Officer manages departments, programs, sessions, batches, courses, student records, routines, attendance, and results.
- Accounts Officer manages admission fee status, student dues, payment verification, and financial reports.
- CMS Editor manages public website content but cannot access student financial or sensitive academic records.
- Teacher manages only assigned academic data.
- Student can view and update only permitted personal/academic information.
- Applicant can access only their application and admission status.
- Staff permissions are assigned by department and operational responsibility.

### Access Control Rules

- All protected features require authentication.
- All privileged actions require role and permission checks.
- Sensitive actions must be logged.
- Data access must be scoped to role, ownership, department, session, or assignment.
- Destructive operations should use soft delete where appropriate.

## 7. Public Website Pages

- Home
- About OIST
- Message from Principal/Director
- Mission and Vision
- History
- Departments
- Department detail pages
- Programs/Courses
- Admission
- Admission circular
- Admission requirements
- Admission process
- Online application entry point
- Tuition and fees
- Notices
- Notice detail
- News
- News detail
- Events
- Event detail
- Gallery
- Downloads
- Faculty members
- Staff directory
- Facilities
- Library
- Labs/workshops
- Student life
- Clubs and activities
- Career guidance
- Contact
- Search results
- Privacy policy
- Terms and conditions

## 8. Admin/Staff Portal Features

- Dashboard with role-specific metrics and quick actions.
- User creation, invitation, activation, suspension, and password reset.
- Role and permission assignment.
- Department, program, course, batch, session, semester, and shift management.
- Student record management.
- Teacher and staff profile management.
- Admission session configuration.
- Application review and status updates.
- Payment verification for admission and fees.
- CMS content publishing workflow.
- Notice and announcement publishing.
- Gallery and media management.
- Reports for admission, student records, attendance, payments, and content.
- Export support for operational reports.
- Audit logs for sensitive changes.
- System settings for institute profile, contact data, SEO defaults, and integration settings.

## 9. Student Portal Features

- Secure login and dashboard.
- Student profile and guardian information.
- Academic enrollment details.
- Department, session, semester, shift, and batch information.
- Class routine.
- Attendance summary.
- Result and transcript view, depending on institutional policy.
- Fee status and payment history.
- Notices targeted by department, batch, semester, or all students.
- Downloadable documents and forms.
- Application/service request tracking.
- Password and account security settings.

## 10. Teacher Portal Features

- Secure login and dashboard.
- Teacher profile.
- Assigned courses, batches, semesters, and departments.
- Student lists by assignment.
- Attendance entry and attendance history.
- Course materials or downloadable resources.
- Internal notices and academic announcements.
- Result or assessment entry workflow, if enabled by academic policy.
- Communication support for assigned students or classes, if approved.
- Account security settings.

## 11. Admission System Workflow

1. Admin creates an admission session with program/department availability, eligibility rules, dates, fees, and required documents.
2. Applicant creates an account.
3. Applicant verifies email or phone, depending on configured policy.
4. Applicant fills out personal, guardian, academic, and program preference information.
5. Applicant uploads required documents.
6. Applicant submits the application.
7. System validates completeness and locks submitted fields except allowed corrections.
8. Applicant completes application fee/payment process or receives manual payment instructions.
9. Admission Officer reviews application data and documents.
10. Application may be marked as pending correction, accepted for review, rejected, shortlisted, selected, waitlisted, or admitted.
11. Applicant receives status notifications.
12. Accounts Officer verifies required payments.
13. Admission Officer or Academic Officer confirms final admission.
14. System converts admitted applicant into a student record.
15. Student receives portal access.
16. Admission reports are generated for management.

## 12. CMS Content Management Features

- Page management with title, slug, body, status, publish date, and SEO fields.
- Menu builder for header, footer, and quick links.
- Notice management with category, audience, publish date, expiry date, attachment, and pinned status.
- News management with images, categories, tags, and author information.
- Event management with date, location, description, images, and registration link if needed.
- Gallery management with albums and images.
- Download management for forms, circulars, policies, and academic documents.
- Department content management.
- Faculty and staff profile management.
- Banner/slider management.
- Contact and institute settings.
- SEO metadata management for key pages.
- Draft, published, archived, and scheduled content states.
- Media library with file validation and alt text.

## CMS-Driven Frontend Architecture

The public website frontend must be CMS-driven and backend-controlled as much as possible. Next.js should provide the rendering system, routing structure, reusable UI components, layouts, accessibility behavior, responsive design, animations, and data-fetching layer. Laravel and Filament must control editable institutional content through secure staff/admin workflows and expose that content through clean public API endpoints.

### Backend-Controlled Public Content

The following public website content must be managed from Laravel/Filament and delivered through the API:

- Logo, favicon, website title, institute identity text, and brand assets.
- SEO title, meta description, canonical URL, Open Graph image, social share text, robots behavior, and structured metadata.
- Header menu, footer menu, important links, footer text, contact details, social media links, and quick links.
- Hero title, hero subtitle, hero image, hero video, CTA button text, CTA button links, and homepage banners.
- Homepage section visibility, section order, section labels, section headings, and section content sources.
- Notices, popup notices, admission circulars, downloads, policies, forms, and important announcements.
- News, events, gallery images, gallery albums, videos, faculty profiles, department information, course information, scholarship information, and admission information.
- Contact page content, map/embed settings if approved, office hours, email addresses, phone numbers, and address records.

Hard-coded frontend public content is allowed only for structural UI labels that are not intended to be edited by staff, such as generic accessibility labels, fallback button labels, loading messages, and form control labels. Any content that staff may reasonably need to update must be backend-controlled.

### What Remains in Frontend Code

The frontend should contain:

- Route structure and page shells.
- Reusable components for layout, sections, cards, menus, banners, lists, galleries, and detail pages.
- TypeScript types for public API contracts.
- API client functions and response normalization.
- Loading, empty, error, and fallback states.
- Accessibility behavior, responsive layout, and animation behavior.
- Static structural copy only where the text is part of the UI mechanics rather than institutional content.

The frontend must not contain authoritative public website data such as institute contact details, menu items, notices, department copy, admission circular text, SEO content, or media URLs.

### Frontend Content Fetching

The Next.js frontend must fetch public website data from Laravel API endpoints. Public content should be grouped into practical API resources such as site settings, menus, homepage layout, notices, news, events, departments, courses, faculty profiles, galleries, downloads, admission content, scholarship content, contact details, and page SEO.

The frontend should prefer server-side data fetching for public pages so pages remain fast, SEO-friendly, and crawlable. Client-side fetching should be reserved for interactive widgets, non-critical enhancements, or content that does not need to be indexed.

### Caching and Revalidation

Public content should use a layered caching strategy:

- Laravel should cache expensive public CMS queries where safe.
- Next.js should use static generation, ISR, or route-level revalidation for public pages where appropriate.
- Frequently changing content such as urgent notices and popup notices should have shorter cache lifetimes.
- Stable content such as department pages, faculty profiles, downloads, and general pages can use longer cache lifetimes with manual or webhook-triggered revalidation.
- Admin publishing actions should be designed to trigger cache invalidation or revalidation in a future deployment phase.
- API responses should include update timestamps or version markers where useful for cache decisions.

If content freshness is critical, the page or section should be configured with a lower revalidation interval instead of bypassing caching for the entire public website.

### Images, Videos, and Files

Laravel must manage public CMS media metadata and file validation. Filament should allow authorized staff to upload and manage public images, videos, downloadable files, alt text, captions, publish status, and ordering.

Rules:

- Public media may be served from public storage only after validation.
- Sensitive files must remain private and must not be exposed through public CMS endpoints.
- Media records should include alt text, caption, file type, dimensions where practical, file size, URL, and status.
- Homepage hero media, banners, gallery images, news images, event images, department images, faculty photos, admission circulars, and downloads must come from backend-managed media records.
- The frontend should render media responsively and should not hard-code media URLs except for emergency fallback assets approved by the architect.

### SEO Metadata Control

SEO metadata must be controlled from the backend for public pages. Filament should allow authorized staff to manage SEO title, meta description, slug, canonical URL, Open Graph image, Open Graph title/description, robots directives, and structured data fields where appropriate.

The frontend should use Next.js metadata features to render backend-provided metadata. If backend metadata is missing, the frontend may use safe fallback metadata from backend-provided global site settings. Hard-coded SEO defaults should be minimal and generic.

### Homepage Section Control

The homepage must support backend-controlled sections. Authorized staff should be able to enable, disable, reorder, and configure homepage sections from Filament.

Examples of configurable homepage sections:

- Hero
- Hero feature/stat cards
- Banner/slider
- Notices
- Admission call-to-action
- About/institution intro
- Chairman or leadership message
- Departments
- Courses/programs
- News
- Events
- Gallery
- Faculty highlights
- Scholarship information
- Facilities
- Video showcase
- Downloads
- Contact block
- Important links

Each section should have a stable frontend component type, while its content, visibility, order, title, CTA, media, and item limits are controlled by the backend. The frontend should ignore unknown inactive section types safely and render known active sections in the backend-provided order.

### Menus and Footer Links

Header menu, footer menu, important links, social links, and footer text must be CMS-controlled. Filament should allow staff to manage labels, URLs, link targets, ordering, parent/child menu structure, visibility, and publish status.

The frontend should render menus from API data and should support nested menu structures where approved by the design. Hard-coded navigation should be limited to structural routes needed for application behavior and must not replace CMS-managed public menus.

### Fallback Content and API Failure

The frontend must handle API failures gracefully:

- Show a polished error or maintenance state for critical page-level failures.
- Render cached or previously generated content when available.
- Use safe generic fallback metadata if backend SEO metadata cannot be loaded.
- Avoid displaying stale urgent notices if their expiry date has passed.
- Avoid hard-coding full institutional content as a fallback.
- Log or report public content fetch failures through the approved monitoring strategy when implemented.

Fallback content should preserve usability without becoming a second hidden source of editable website content.

## 13. Database Entity List

Core entities:

- users
- roles
- permissions
- role_user
- permission_role
- departments
- programs
- courses
- sessions
- semesters
- batches
- shifts
- students
- guardians
- teachers
- staff_profiles
- applicants
- admission_sessions
- admission_applications
- admission_documents
- admission_payments
- admission_status_histories
- enrollments
- class_routines
- attendance_records
- results
- fees
- payments
- notices
- notice_audiences
- pages
- menus
- menu_items
- news_posts
- events
- galleries
- gallery_items
- downloads
- media_files
- seo_metadata
- contact_messages
- support_requests
- notifications
- audit_logs
- system_settings

The final schema should be normalized, indexed for common queries, and designed with soft deletes for administrative recovery where appropriate.

## 14. API Architecture

The backend will expose a REST API consumed by the Next.js frontend and portals.

### API Groups

- Public API: pages, menus, notices, news, events, galleries, departments, downloads, SEO data.
- Authentication API: login, logout, registration, applicant signup, password reset, profile, token/session management.
- Admission API: application creation, update, submission, document upload, payment status, application status.
- Student API: profile, academic details, attendance, results, fees, notices, documents, support requests.
- Teacher API: assignments, student lists, attendance, materials, notices, academic updates.
- Admin API: operational data, reports, management actions, settings, audit logs.

### API Standards

- Versioned API routes.
- Consistent JSON response envelope.
- Consistent error format.
- Request validation at backend boundary.
- Pagination for list endpoints.
- Filtering and sorting for administrative lists.
- Rate limiting for public and authentication endpoints.
- API documentation maintained alongside development.

## 15. Authentication Strategy

- Use Laravel authentication as the source of truth for backend users.
- Use secure session or token strategy based on final deployment constraints and frontend/backend domain setup.
- Use HTTPS in production for all authentication traffic.
- Support separate login flows for admin/staff, teachers, students, and applicants while sharing a unified user identity model where practical.
- Enforce strong password rules.
- Provide password reset by email and optional phone/SMS workflow.
- Use email or phone verification for applicants if required by policy.
- Expire inactive sessions.
- Protect admin access with stricter session lifetime and optional two-factor authentication in future phases.

## 16. Authorization Strategy

- Use role-based access control with permission-level checks.
- Apply authorization at controller/action level, API policy level, and Filament resource/action level.
- Scope data access by ownership and assignment.
- Teachers can access only assigned courses/classes/students.
- Students can access only their own records.
- Applicants can access only their own application.
- CMS Editors can manage content but not academic or financial records.
- Accounts Officers can manage financial verification but not unrelated academic settings.
- Super Admin permissions should be reserved for trusted technical/administrative leadership.

## 17. Security Strategy

- Enforce HTTPS in production.
- Store secrets only in environment configuration.
- Never expose backend environment data to the frontend.
- Validate and sanitize all user input.
- Use Laravel validation for API and admin panel requests.
- Use CSRF protection for web-authenticated forms where applicable.
- Use CORS rules limited to approved frontend domains.
- Apply rate limiting to login, registration, password reset, contact form, and admission submission endpoints.
- Hash passwords with Laravel-supported secure hashing.
- Use signed or protected URLs for private files.
- Restrict uploaded file types and sizes.
- Scan or validate file metadata where practical.
- Prevent direct execution of uploaded files.
- Use audit logs for administrative actions.
- Use least privilege for database users.
- Schedule regular backups.
- Monitor application errors and failed login attempts.
- Keep dependencies updated during maintenance windows.

## 18. File Upload and Storage Strategy

- Public media such as gallery images and news images may be stored in public-accessible storage after validation.
- Sensitive files such as admission documents, student documents, payment receipts, and certificates must be private by default.
- Store file metadata in the database.
- Use unique generated filenames and preserve original filenames only as metadata.
- Validate MIME type, extension, and file size.
- Use separate logical directories for public CMS media, admission files, student files, staff files, and temporary uploads.
- Use signed temporary URLs for private file access.
- Apply role and ownership authorization before file download.
- Optimize public images for web delivery.
- Define retention rules for rejected admission applications and inactive records.
- Ensure cPanel storage paths are outside executable web paths where possible.

## 19. SEO Strategy

- Use Next.js server rendering/static generation for public website pages where appropriate.
- Maintain clean, readable, canonical URLs.
- Generate dynamic metadata for pages, departments, notices, news, and events.
- Provide Open Graph and Twitter/social metadata.
- Generate XML sitemap and robots.txt.
- Add structured data for organization, breadcrumbs, articles/news, events, and educational institution information where appropriate.
- Use semantic HTML.
- Optimize images with alt text, dimensions, and responsive delivery.
- Keep public pages fast and crawlable.
- Avoid exposing portal/admin pages to search engines.
- Provide redirects for changed slugs.
- Maintain meaningful page titles and descriptions through CMS.

## 20. Performance Strategy

- Use Vercel edge/CDN benefits for frontend delivery.
- Cache public content responses where safe.
- Use ISR or revalidation strategy for frequently updated public content.
- Optimize database indexes for notices, admissions, students, attendance, payments, and content lists.
- Paginate large datasets.
- Avoid loading unnecessary portal data on first render.
- Use image optimization for public assets.
- Minimize JavaScript on public pages.
- Use loading states and optimistic UI only where appropriate.
- Profile slow API endpoints before launch.
- Use background jobs or queued processing for heavy notifications, reports, and file processing where hosting allows.

## 21. Accessibility Strategy

- Follow WCAG-conscious design principles.
- Use semantic HTML for public pages and portal interfaces.
- Maintain sufficient color contrast.
- Ensure keyboard navigation for menus, forms, modals, and admin actions.
- Provide visible focus states.
- Use accessible form labels and clear validation messages.
- Provide alt text for meaningful images.
- Avoid motion that prevents readability; respect reduced-motion preferences.
- Ensure error messages are understandable by non-technical users.
- Test key flows on mobile devices and keyboard-only navigation.

## 22. Scalability Strategy

- Keep frontend and backend independently deployable.
- Keep public website, CMS, admission, student, teacher, and admin domains modular.
- Use API versioning to support future clients.
- Use database indexes and normalized relationships.
- Add caching for high-traffic public content.
- Isolate file storage concerns behind backend services.
- Design roles/permissions to support new departments and responsibilities.
- Plan for future queue workers if cPanel hosting is upgraded.
- Keep business logic out of presentation layers.
- Prepare for future mobile app, payment gateway, SMS gateway, and learning management integrations.

## 23. Folder Structure Plan

No application folders should be modified until implementation begins. The planned repository structure is:

- frontend: Next.js 15 public website and user-facing portal frontend.
- backend: Laravel 12 API, Filament admin panel, authentication, business logic, and database layer.
- docs: project documentation, blueprint, API notes, deployment notes, and operational guides.
- assets: project reference assets, brand materials, and approved static resources.
- prompts: planning prompts and AI collaboration notes.

### Planned Frontend Areas

- Public website routes
- Admission routes
- Student portal routes
- Teacher portal routes
- Shared UI components
- API client layer
- Authentication helpers
- Layouts
- SEO utilities
- Type definitions

### Planned Backend Areas

- API routes
- Web/admin routes
- Filament resources
- Domain models
- Controllers
- Form requests/validators
- Policies
- Services
- Notifications
- Jobs
- Migrations
- Seeders
- Tests

## 24. Git Branch Strategy

- main: stable production-ready branch.
- staging: pre-production integration branch.
- develop: active integration branch for completed features.
- feature/*: individual feature work.
- fix/*: bug fixes.
- hotfix/*: urgent production fixes.
- release/*: release preparation and stabilization.

### Git Rules

- All work should be reviewed through pull requests.
- Feature branches should be short-lived.
- Pull requests must describe scope, testing, database changes, and deployment impact.
- Never commit secrets or environment files containing credentials.
- Use clear commit messages.
- Tag production releases.
- Keep frontend and backend changes logically separated when possible.

## 25. Development Milestones

### Milestone 1: Planning and Foundation

- Finalize project blueprint.
- Confirm institutional requirements.
- Confirm content structure.
- Confirm admission workflow.
- Confirm hosting constraints.
- Define environment strategy.

### Milestone 2: Backend Foundation

- Set up Laravel backend.
- Configure database.
- Establish authentication and authorization.
- Build core user, role, permission, department, program, session, and settings foundations.
- Set up Filament admin base.

### Milestone 3: CMS and Public Content API

- Build CMS resources.
- Build public content API.
- Add SEO metadata support.
- Add media management.

### Milestone 4: Frontend Public Website

- Set up Next.js frontend.
- Build mobile-first public website.
- Integrate public content API.
- Implement SEO, sitemap, and performance basics.

### Milestone 5: Admission System

- Build admission session setup.
- Build applicant registration and application workflow.
- Build document upload and payment tracking.
- Build review and enrollment conversion.
- Build admission reports.

### Milestone 6: Student Portal

- Build student dashboard.
- Integrate profile, academic data, notices, attendance, results, fees, and documents.
- Add support request workflow.

### Milestone 7: Teacher Portal

- Build teacher dashboard.
- Add assigned class/course views.
- Add student lists and attendance workflow.
- Add academic materials and internal notices.

### Milestone 8: Staff/Admin Operations

- Complete staff workflows.
- Add reporting.
- Add audit logs.
- Harden permissions.

### Milestone 9: Testing and Security Hardening

- Add feature and integration tests.
- Test authentication and authorization boundaries.
- Test admission workflow.
- Test responsive behavior and accessibility.
- Review security settings.

### Milestone 10: Deployment and Launch

- Configure Vercel frontend deployment.
- Configure cPanel backend deployment.
- Configure production database.
- Configure backups.
- Run launch checklist.
- Train staff.
- Launch production.

## 26. Risk Analysis

### Hosting Limitations

Risk: cPanel may limit queue workers, scheduled tasks, storage paths, and deployment automation.

Mitigation: Design backend features to work with cPanel first, document cron requirements, avoid relying on always-on workers in early phases, and plan upgrade paths.

### Admission Workflow Complexity

Risk: Admission rules may change each session.

Mitigation: Make admission sessions configurable and keep status history/audit trails.

### Staff Usability

Risk: Complex admin screens may slow staff adoption.

Mitigation: Use Filament resources carefully, create role-specific dashboards, add validation hints, and train users.

### Data Privacy

Risk: Student, applicant, and financial data require careful access control.

Mitigation: Use strict role permissions, ownership scoping, private storage, audit logs, and secure backups.

### SEO and Content Quality

Risk: Public pages may underperform if content is incomplete or poorly structured.

Mitigation: Provide CMS SEO fields, required metadata for important pages, and staff content guidelines.

### Long-Term Maintainability

Risk: Feature growth may create tightly coupled code.

Mitigation: Use domain modules, services, policies, clear API contracts, tests, and documentation.

### Deployment Drift

Risk: Manual cPanel deployment may diverge from GitHub source.

Mitigation: Maintain deployment checklist, tag releases, and document production environment changes.

### File Storage Growth

Risk: Admission documents, media, and student files may consume hosting storage.

Mitigation: Set upload limits, retention policies, image optimization, and storage monitoring.

## 27. Future Expansion Plan

- Online payment gateway integration.
- SMS gateway integration.
- Mobile app for students and teachers.
- Learning management features.
- Library management.
- Hostel management.
- Transport management.
- Alumni portal.
- Parent/guardian portal.
- Certificate verification portal.
- Advanced analytics dashboard.
- Biometric attendance integration.
- Routine generation tools.
- Exam management system.
- Result publication workflow.
- HR and payroll module.
- Inventory and asset management.
- Multi-campus support.
- Public API for approved third-party integrations.

## Architectural Principles

- Keep the public website fast, simple, and SEO-focused.
- Keep administrative workflows reliable and permission-aware.
- Keep student and teacher portals scoped to authenticated user responsibilities.
- Keep sensitive records private by default.
- Keep business logic centralized in the backend.
- Keep frontend components reusable and accessible.
- Keep deployment processes documented and repeatable.
- Keep future expansion possible without destabilizing the core platform.
