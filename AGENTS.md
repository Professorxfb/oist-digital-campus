# AGENTS.md - OIST Digital Campus Platform

This file is the permanent instruction rulebook for all future Codex work in this repository. Every change must follow this document and the official blueprint in `docs/PROJECT_BLUEPRINT.md`.

## 1. Project Identity

- Project name: OIST Digital Campus Platform.
- Institution type: Diploma engineering institute.
- Product type: Decoupled digital campus platform.
- Core areas: public institutional website, CMS/admin panel, online admission system, student portal, teacher portal, staff/admin portal, and REST API.
- Quality standard: production-ready, secure, scalable, mobile-first, SEO-friendly, accessible, and maintainable.
- Long-term goal: a stable institutional platform that staff can operate without developer involvement for routine content and administrative work.

## 2. Technology Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- Backend: Laravel 12, Filament v4, MySQL.
- Authentication: Laravel Sanctum unless the architect later changes this decision.
- Authorization/RBAC: Spatie Laravel Permission unless the architect later changes this decision.
- Deployment: frontend on Vercel, backend on cPanel, database on MySQL.
- Version control: GitHub.

## 3. Development Philosophy

- Prefer clean architecture over quick shortcuts.
- Keep backend business rules in the backend.
- Keep frontend code focused on presentation, user interaction, routing, data fetching, and client-side state needed for the UI.
- Keep public pages fast, crawlable, and SEO-friendly.
- Keep portal workflows simple, reliable, and mobile-first.
- Keep staff/admin features practical and easy to operate through Filament.
- Protect student, applicant, staff, academic, and financial data by default.
- Build in small, reviewable, well-documented increments.
- Match existing project conventions once implementation begins.

## 4. Hard Rules for Codex

- Do not create application code unless the user explicitly asks for implementation work.
- Do not install packages unless the user explicitly approves package installation.
- Do not create a Next.js or Laravel project unless the user explicitly asks for scaffolding.
- Do not modify `frontend` or `backend` during planning-only tasks.
- Read relevant documentation before making architectural changes.
- Treat `docs/PROJECT_BLUEPRINT.md` as the source of truth unless superseded by a later architect decision.
- Preserve user changes. Never revert unrelated work.
- Avoid destructive filesystem and Git commands.
- Do not commit secrets, credentials, API keys, `.env` files, database dumps, or private certificates.
- Do not expose sensitive backend data to the frontend.
- Do not mix frontend UI concerns with backend business rules.

## 5. Folder Ownership Rules

- `frontend`: Next.js public website, admission UI, student portal UI, teacher portal UI, shared frontend components, frontend API client, frontend layouts, frontend SEO utilities, and frontend types.
- `backend`: Laravel API, business logic, database layer, authentication, authorization, Filament admin panel, CMS management, file access control, backend services, jobs, notifications, policies, migrations, seeders, and tests.
- `docs`: project documentation, architecture notes, API documentation, deployment notes, operational guides, and decision records.
- `assets`: approved project reference assets, brand materials, and static planning resources.
- `prompts`: planning prompts and AI collaboration notes.
- Root files: repository-wide configuration, documentation, and workflow instructions only.

## 6. Frontend Coding Standards

- Use Next.js 15 App Router conventions unless the architect decides otherwise.
- Use TypeScript for all frontend source files.
- Use server components by default where possible.
- Use client components only for interactivity, browser APIs, local UI state, animations, and form interactions that require client behavior.
- Keep API access behind a clear frontend API client layer.
- Do not duplicate backend validation or business rules as authoritative logic in the frontend.
- Handle loading, empty, success, and error states for every data-driven UI.
- Keep public website pages SEO-friendly and portal pages protected from indexing.
- Build mobile-first layouts.
- Use accessible semantic markup.
- Avoid leaking internal IDs, hidden fields, or sensitive metadata unless required by the API contract.

## 7. Backend Coding Standards

- Use Laravel 12 conventions.
- Keep business logic out of controllers when it grows beyond simple request orchestration.
- Use Form Requests or equivalent validation boundaries for API/admin inputs.
- Use policies and permissions for protected actions.
- Use Eloquent relationships clearly and avoid unnecessary raw SQL.
- Use transactions for multi-step writes such as admission approval, payment verification, and enrollment conversion.
- Use soft deletes for administrative recovery where appropriate.
- Use audit logging for sensitive administrative actions.
- Keep API responses consistent.
- Keep database queries indexed and paginated for large records.

## 8. Laravel/Filament Standards

- Filament is the staff/admin CMS and operations interface.
- Filament resources must enforce authorization through policies, permissions, or resource-level checks.
- Filament forms must validate inputs clearly.
- Filament tables must support practical search, filters, sorting, and pagination for operational datasets.
- Use role-specific dashboards and navigation where helpful.
- Keep CMS editing flows simple for non-technical staff.
- Never expose private student, applicant, financial, or staff data through CMS resources without explicit permission checks.
- Destructive Filament actions must be confirmed and audited.

## 9. Next.js Standards

- Use Next.js 15 features intentionally and conservatively.
- Use server rendering or static generation for public website pages where appropriate.
- Use dynamic rendering only when required by personalization, authentication, or frequently changing private data.
- Use metadata APIs for titles, descriptions, canonical URLs, Open Graph, and robots behavior.
- Use route groups to separate public website, admission UI, student portal, and teacher portal when implementation begins.
- Keep portal routes authenticated.
- Ensure admin/staff content management remains in backend Filament, not in the frontend.

## 10. TypeScript Standards

- Use strict TypeScript.
- Define clear types for API responses, forms, authenticated users, roles, permissions, and domain entities.
- Avoid `any` unless there is a documented reason.
- Prefer narrow types and explicit interfaces for API contracts.
- Keep shared frontend types aligned with backend API documentation.
- Validate unknown external data before trusting it in the UI.

## 11. Tailwind CSS Standards

- Use Tailwind CSS for layout and styling.
- Build mobile-first responsive layouts.
- Prefer design tokens and reusable component variants over one-off styling.
- Keep spacing, typography, color, and states consistent.
- Avoid hard-coded colors when theme tokens are available.
- Maintain readable contrast.
- Avoid excessive decorative styling in operational portals.
- Public pages may be more expressive, but must remain fast, accessible, and institutionally appropriate.

## 12. shadcn/ui Usage Rules

- Use shadcn/ui as the base component system for frontend UI.
- Customize components through project conventions, not ad hoc rewrites.
- Preserve accessibility behavior of shadcn/ui components.
- Use appropriate components for forms, dialogs, dropdowns, tables, tabs, alerts, and navigation.
- Do not create duplicate custom components when shadcn/ui already provides a suitable base.
- Keep component variants consistent and reusable.

## 13. API Response Format

All REST API responses should use a consistent JSON envelope.

Successful single-resource responses should include:

- `success`: boolean.
- `message`: human-readable summary or `null`.
- `data`: returned resource or object.
- `meta`: optional metadata.

Successful list responses should include:

- `success`: boolean.
- `message`: human-readable summary or `null`.
- `data`: array of resources.
- `meta`: pagination, filters, sorting, and other response metadata.

The exact implementation may be refined during backend development, but consistency is mandatory.

## 14. Error Handling Format

API error responses should include:

- `success`: false.
- `message`: clear human-readable error.
- `error`: machine-readable error code or type.
- `errors`: field-level validation errors when applicable.
- `meta`: optional debugging reference such as request ID in non-sensitive form.

Rules:

- Never expose stack traces, SQL errors, secrets, or internal server details in production API responses.
- Use correct HTTP status codes.
- Return validation errors in a predictable field-keyed structure.
- Log server-side errors with enough context for diagnosis.
- Show user-friendly frontend messages without exposing sensitive details.

## 15. Authentication Rules

- Laravel is the source of truth for user identity.
- Use Laravel Sanctum unless the architect later changes this decision.
- Use HTTPS in production for all authentication traffic.
- Support separate login experiences for admin/staff, teachers, students, and applicants while keeping a coherent backend identity model.
- Enforce strong passwords.
- Support password reset flows.
- Use email or phone verification for applicants if institutional policy requires it.
- Expire inactive sessions or tokens according to security requirements.
- Keep admin/staff authentication stricter than public applicant workflows.
- Never store authentication secrets in frontend code.

## 16. Authorization/RBAC Rules

- Use Spatie Laravel Permission unless the architect later changes this decision.
- Apply role and permission checks to every privileged action.
- Use policies for model-level access control.
- Scope data by ownership, department, session, semester, batch, assignment, or role as appropriate.
- Teachers may access only assigned academic data.
- Students may access only their own records.
- Applicants may access only their own applications.
- CMS Editors may manage public content but not sensitive academic or financial records.
- Accounts Officers may manage payment verification and financial reports but not unrelated academic settings.
- Super Admin access must be reserved and audited.

## 17. Database Migration Rules

- Migrations must be reversible unless a documented exception is approved.
- Use clear table and column names.
- Add indexes for common lookup, filter, and relationship fields.
- Use foreign keys where practical and safe for the hosting environment.
- Use soft deletes for entities requiring administrative recovery.
- Do not modify production data through migrations unless explicitly planned and reviewed.
- Seed only safe reference data, roles, permissions, and development fixtures as appropriate.
- Never include real student, applicant, staff, financial, or credential data in seeders.

## 18. File Upload Rules

- Validate MIME type, extension, and file size.
- Store sensitive files privately by default.
- Use generated unique filenames.
- Preserve original filenames only as metadata.
- Prevent uploaded files from being executed.
- Authorize every private file download.
- Use signed temporary URLs or protected backend routes for private files.
- Keep public CMS media separate from admission, student, staff, payment, and certificate files.
- Optimize public images for web delivery.
- Define retention rules for temporary uploads and rejected applications.

## 19. Security Rules

- Enforce HTTPS in production.
- Store secrets only in environment configuration.
- Never commit `.env` files or credentials.
- Restrict CORS to approved frontend domains.
- Apply rate limiting to login, registration, password reset, contact forms, and admission submission endpoints.
- Validate and sanitize all user input.
- Use CSRF protection for web-authenticated forms where applicable.
- Hash passwords using Laravel-supported secure hashing.
- Use least privilege for database users and application permissions.
- Log failed authentication attempts and sensitive administrative actions.
- Keep private data private by default.
- Do not expose backend environment values, server paths, internal errors, or stack traces to the frontend.

## 20. SEO Rules

- Public pages must support unique titles, descriptions, canonical URLs, Open Graph metadata, and structured data where appropriate.
- Generate sitemap and robots rules for public content.
- Prevent portal, admin, authenticated, and private pages from being indexed.
- Use clean human-readable URLs.
- Support redirects when public slugs change.
- Use semantic HTML and meaningful headings.
- Require alt text for meaningful CMS images.
- Keep public pages fast and crawlable.

## 21. Accessibility Rules

- Use semantic HTML.
- Maintain keyboard navigation for menus, forms, modals, tables, and portal workflows.
- Provide visible focus states.
- Maintain sufficient color contrast.
- Use accessible labels, descriptions, and error messages for forms.
- Respect reduced-motion preferences for animation.
- Do not rely on color alone to communicate status.
- Test important workflows on mobile and with keyboard navigation.

## 22. Performance Rules

- Optimize public website pages for fast first load.
- Use caching for public content where safe.
- Use pagination for large lists.
- Avoid over-fetching portal data.
- Avoid unnecessary client-side JavaScript on public pages.
- Use image optimization and stable image dimensions.
- Index database columns used in filters, joins, search, and sorting.
- Profile slow API endpoints before adding complexity.
- Use queues or scheduled jobs for heavy work when hosting supports it.

## 23. Git Workflow Rules

- `main`: stable production-ready branch.
- `staging`: pre-production integration branch.
- `develop`: active integration branch for completed features.
- `feature/*`: individual feature work.
- `fix/*`: bug fixes.
- `hotfix/*`: urgent production fixes.
- `release/*`: release preparation and stabilization.
- Use pull requests for review.
- Keep feature branches short-lived.
- Keep frontend and backend changes logically separated where possible.
- Pull requests must document scope, testing, database impact, and deployment impact.
- Tag production releases.

## 24. Commit Message Rules

- Use clear, concise commit messages.
- Prefer conventional prefixes where practical: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`.
- Keep each commit focused on one logical change.
- Mention migrations, security changes, or breaking changes explicitly.
- Do not include secrets, credentials, or private operational details in commit messages.

## 25. Testing Expectations

- Add tests for authentication, authorization, admission workflows, payment verification, enrollment conversion, and sensitive administrative actions.
- Add API tests for important endpoints.
- Add frontend tests for critical user flows when the frontend exists.
- Test validation errors and unauthorized access.
- Test mobile layouts and key accessibility behavior.
- Run relevant tests before completing implementation work.
- Document any tests that could not be run and why.

## 26. Documentation Expectations

- Keep `docs/PROJECT_BLUEPRINT.md` aligned with major architectural decisions.
- Document API contracts as they are introduced.
- Document deployment steps for Vercel, cPanel, and MySQL.
- Document environment variables without exposing secret values.
- Document role and permission changes.
- Document database changes that affect operations or deployment.
- Add decision records for major changes to stack, authentication, authorization, hosting, or data architecture.

## 27. Prohibited Actions

- Do not create application implementation code during documentation-only tasks.
- Do not install packages without explicit approval.
- Do not scaffold Next.js or Laravel without explicit approval.
- Do not modify `frontend` or `backend` during planning-only tasks.
- Do not commit `.env` files, secrets, credentials, API keys, database dumps, private certificates, or real personal data.
- Do not expose sensitive student, applicant, teacher, staff, financial, or admission data to unauthorized users.
- Do not bypass authentication or authorization checks.
- Do not hard-code secrets, tokens, passwords, or production URLs.
- Do not use frontend code as the authority for business rules.
- Do not store private uploaded files in public web paths.
- Do not return stack traces or internal errors in production responses.
- Do not make destructive database or filesystem changes without explicit instruction and review.
- Do not introduce a new major framework, package, service, or architectural pattern without architect approval.

