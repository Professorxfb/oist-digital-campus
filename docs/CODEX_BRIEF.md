# Codex Brief

## Permanent Global Public Button Animation Rule

Every public website button or link styled as a button must use the same premium Univet-inspired hover animation behavior unless there is a clear design reason not to.

Default public button direction: yellow/gold primary background, navy text, rounded pill shape, and a small right-side dot/icon when suitable. Hover states must be visibly animated with smooth color or overlay movement, readable text, and subtle dot/icon movement or opacity change. Navy buttons should hover to yellow/gold or another clearly visible alternate state. Yellow buttons should hover to navy/darker tones or use a smooth overlay effect.

This rule applies to all future public buttons, including Apply Now, View All Professors, More About Us, Explore Labs, Download, Read More, Back buttons, detail page CTAs, and any new public page button. Do not ship static public buttons. Prefer shared classes or component variants such as `.btn-public-primary` and `.btn-public-navy` over random one-off hover styles. Before finishing any public page or section, visually verify button hover behavior.

## Permanent Public Footer Portal Rule

The public footer must keep the portal-login structure for Student Portal, Faculty Portal, and Staff/Admin access unless the user explicitly requests newsletter, Google Play, App Store, or similar promotional footer sections later.

Do not add newsletter signup areas, app-store badges, download-app banners, or equivalent promotional footer blocks by default. Footer content must remain CMS/backend-controlled where practical, while portal links may remain structural navigation affordances until real authentication and portal workflows are implemented.

## Permanent Global Public Page Layout Rule

Every public page/detail page must follow the Univet reference-style layout discipline.

Breadcrumb, meta text, page title, divider, intro text, and main content must start from a consistent left boundary. Do not randomly center hero text blocks unless the reference layout for that section is centered. Default public detail pages must be left-aligned like the Univet reference.

Header/navbar must never touch the hero content. Always keep clean breathing space after the header. Hero content must use consistent top/bottom padding. Page hero content and main content must share the same container alignment system.

At large desktop widths, content must not start too far inside/right. At `1920px` viewport, public detail page hero content should usually begin around `140px-180px` from the left edge unless the specific reference section requires otherwise. At `1366px` viewport, public detail page hero content should usually begin around `90px-120px` from the left edge. Avoid `250px-350px` left offsets for page titles unless the reference clearly uses that.

Page titles must be large and premium, but not oversized. Use responsive `clamp()` title sizes. Do not use ugly ellipsis/truncation for important page titles or intro text.

Do not create cramped hero sections. Do not create huge empty spaces. Do not create random extra sections unless CMS data and design require them. All public content must remain CMS/backend controlled.

Before finishing any public page, compare against the Univet reference for left alignment, top spacing after header, title size, line height, content width, vertical rhythm, responsive behavior, and no horizontal overflow.

Functional completion is not enough. Every public page must match reference-quality visual polish.

## Recommended Public Page Container System

Use a shared container style/pattern for public detail pages. Suggested desktop max width is `1480px-1520px` for hero/detail page wrappers when needed. Suggested desktop horizontal padding is `32px`. Suggested tablet padding is `24px`. Suggested mobile padding is `18px-20px`.

Hero content should be left-aligned inside this container. Main content should use the same left boundary. Intro text should have controlled max-width around `600px-700px`.

Do not use a narrow centered container that pushes hero content too far right. If a page needs a different layout, document why in `docs/SETUP_LOG.md`.

## Permanent Global Public Typography Rule

Public page titles must match the premium Univet-style scale. Titles should be elegant, readable, and balanced. Do not make titles huge just because they are hero titles.

Use responsive `clamp()` sizing. Hero/page title, section title, card title, and small meta text must each have separate size scale. Card titles should stay readable and must not be cut off. Main page titles should never look messy or oversized.

Always compare font size and spacing against the reference before finishing.

## Global Public Page Layout Rule

Every new public detail page must use a consistent centered max-width container. Hero/banner text must align with the main content container, never with a random left or right position.

Use the approved Univet-inspired public page style for breadcrumb spacing, a large but controlled serif title, a short divider, controlled intro text width, cream/off-white content backgrounds, white rounded content cards, soft shadows, and consistent vertical spacing.

Header/navbar elements must never touch hero content. Always keep clear breathing space between the header and the breadcrumb/title group, with proper hero top and bottom padding. Breadcrumb, title, divider, and intro content must align to the same container left edge. Never ship cramped hero sections or oversized title sections; compare header-to-hero spacing with the Univet reference before finishing.

Do not use oversized or cramped typography. Do not use ugly ellipsis or truncation for main page titles or detail content. Do not create huge empty spaces, and do not create random extra sections unless the CMS data requires them.

All page content must remain backend/CMS-controlled. Future public pages must not redesign already completed sections.

Before finishing any new public page, compare it against the reference for alignment, spacing, font size, width, responsive behavior, and horizontal overflow.

## Global Public Typography & Title Scale Rule

All public website titles must follow the Univet-style premium scale. Titles should be large and elegant, but never oversized, messy, cramped, or visually heavier than the reference.

Use responsive `clamp()` font sizing for large headings. Hero page titles, section titles, and card titles must have separate size scales: hero/page titles can be large and expressive, section titles should stay readable and premium, and card titles should remain fully readable within their containers.

Main hero/page titles should not exceed the visual balance of the reference. Section titles should not become huge decorative blocks. Card titles must not be cut off or forced into ugly ellipsis when they carry important content.

Maintain clean line-height and spacing around every heading. Avoid ugly ellipsis for important titles. Before finishing any public page or section, compare title size, alignment, spacing, and visual rhythm with the Univet reference.
