import Link from "next/link";
import { Container } from "@/components/public-site/Container";
import { CTAButton } from "@/components/public-site/CTAButton";
import { MissingContent } from "@/components/public-site/MissingContent";
import { PublicSiteShell } from "@/components/public-site/PublicSiteShell";
import { sanitizeCmsHtml } from "@/lib/cms-html";
import { createCmsMetadata } from "@/lib/cms-metadata";
import { formatDate, getCmsAssetUrl, getTextPreview } from "@/lib/cms-display";
import { getSafeVideoEmbedUrl } from "@/lib/video-embed";
import { getNoticeBySlug } from "@/services/cms";
import type { Notice, NoticeContentBlock } from "@/types/cms";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { data: notice } = await getNoticeBySlug(slug);

  return createCmsMetadata({
    title: notice?.meta_title ?? notice?.title ?? "Notice",
    description: notice?.meta_description ?? notice?.excerpt,
  });
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { data: notice } = await getNoticeBySlug(slug);

  return (
    <PublicSiteShell>
      {notice ? <NoticeArticle notice={notice} /> : <MissingContent />}
    </PublicSiteShell>
  );
}

function NoticeArticle({ notice }: Readonly<{ notice: Notice }>) {
  const featuredImageUrl = getCmsAssetUrl(notice.featured_image_url ?? notice.featured_image_path);
  const attachmentUrl = getCmsAssetUrl(notice.attachment_url ?? notice.attachment_path);
  const externalLink = notice.external_link?.trim() || null;
  const summary = notice.excerpt ?? getTextPreview(notice.meta_description, 180);
  const publishedDate = formatDate(notice.published_at);
  const expiresDate = formatDate(notice.expires_at);
  const metaChips = [
    notice.category,
    notice.audience,
    publishedDate,
    notice.is_pinned ? "Pinned" : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <article className="bg-[#f7f3ea]">
      <section className="relative overflow-hidden bg-[#061f3f] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.34),transparent_48%),radial-gradient(circle_at_84%_20%,rgba(250,204,21,0.16),transparent_25%)]" aria-hidden="true" />
        <Container className="relative py-10 sm:py-14 lg:py-16">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-blue-100">
            <Link className="transition duration-300 hover:text-yellow-300" href="/">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link className="transition duration-300 hover:text-yellow-300" href="/notices">
              Notices
            </Link>
            <span aria-hidden="true">/</span>
            <span className="max-w-full truncate text-yellow-300">{notice.title}</span>
          </nav>

          {metaChips.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.1em]">
              {metaChips.map((item) => (
                <li key={item} className="rounded-full border border-yellow-300/35 bg-yellow-300/10 px-3 py-1 text-yellow-200">
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.15rem,7vw,4.35rem)] font-bold leading-[1.06] tracking-normal text-white">
            {notice.title}
          </h1>
          {summary ? (
            <p className="mt-5 max-w-3xl text-base leading-8 text-blue-50 sm:text-lg">
              {summary}
            </p>
          ) : null}
        </Container>
      </section>

      <Container className="py-10 sm:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(300px,0.32fr)] lg:items-start">
          <main className="min-w-0 overflow-hidden rounded-[8px] bg-white p-5 shadow-[0_18px_48px_rgba(2,6,23,0.07)] ring-1 ring-slate-200/70 sm:p-7 lg:p-8">
            {featuredImageUrl ? (
              <figure className="mb-8 overflow-hidden rounded-[8px] bg-[#061f3f]">
                <div
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${featuredImageUrl})` }}
                  aria-label={notice.title}
                  role="img"
                />
              </figure>
            ) : null}

            {notice.body ? (
              <div
                className="cms-rich-content"
                dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(notice.body) }}
              />
            ) : null}

            {notice.video_url ? (
              <NoticeVideoBlock id="notice-video" title="Notice Video" videoUrl={notice.video_url} />
            ) : null}

            {notice.content_blocks?.length ? (
              <div className="mt-9 grid gap-7">
                {notice.content_blocks.map((block, index) => (
                  <NoticeContentBlockView block={block} key={`${block.type}-${index}`} />
                ))}
              </div>
            ) : null}
          </main>

          <aside className="grid gap-5 lg:sticky lg:top-6">
            <SidebarCard title="Notice Information">
              <InfoRow label="Category" value={notice.category} />
              <InfoRow label="Audience" value={notice.audience} />
              <InfoRow label="Published" value={publishedDate} />
              <InfoRow label="Expires" value={expiresDate} />
            </SidebarCard>

            {attachmentUrl ? (
              <SidebarCard title="Downloads">
                <DownloadCard href={attachmentUrl} path={notice.attachment_path} title="Notice Attachment" />
              </SidebarCard>
            ) : null}

            {notice.video_url || externalLink ? (
              <SidebarCard title="Reference">
                {notice.video_url ? (
                  <a
                    className="block rounded-[8px] border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-black text-[#061f3f] transition duration-300 hover:border-yellow-300 hover:bg-yellow-300"
                    href="#notice-video"
                  >
                    Watch notice video
                  </a>
                ) : null}
                {externalLink ? (
                  <CTAButton className="mt-3 w-full" href={externalLink} target="_blank" variant="subtle">
                    Open Related Link
                  </CTAButton>
                ) : null}
              </SidebarCard>
            ) : null}

            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#061f3f] bg-[#061f3f] px-5 py-2.5 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-yellow-300 hover:text-[#061f3f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
              href="/notices"
            >
              Back to Notices
            </Link>
          </aside>
        </div>
      </Container>
    </article>
  );
}

function SidebarCard({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="rounded-[8px] bg-white p-5 shadow-[0_14px_38px_rgba(2,6,23,0.06)] ring-1 ring-slate-200/70">
      <h2 className="font-serif text-xl font-bold tracking-normal text-[#061f3f]">{title}</h2>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: Readonly<{ label: string; value?: string | null }>) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className="text-right text-sm font-black text-[#061f3f]">{value}</span>
    </div>
  );
}

function DownloadCard({
  href,
  path,
  title,
}: Readonly<{
  href: string;
  path?: string | null;
  title: string;
}>) {
  const extension = getFileExtension(path ?? href);

  return (
    <a
      className="group/download flex items-center gap-4 rounded-[8px] border border-slate-200 bg-white p-4 transition duration-300 hover:border-yellow-300 hover:bg-yellow-50"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#061f3f] text-xs font-black uppercase text-white transition duration-300 group-hover/download:bg-yellow-300 group-hover/download:text-[#061f3f]">
        {extension}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-[#061f3f]">{title}</span>
        <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Download file
        </span>
      </span>
    </a>
  );
}

function NoticeVideoBlock({
  id,
  title,
  videoUrl,
}: Readonly<{
  id?: string;
  title: string;
  videoUrl: string;
}>) {
  const embedUrl = getSafeVideoEmbedUrl(videoUrl);

  return (
    <section id={id} className="mt-9 rounded-[8px] border border-slate-200 bg-[#061f3f] p-4 text-white shadow-sm">
      <h2 className="font-serif text-2xl font-bold tracking-normal">{title}</h2>
      <div className="mt-4 overflow-hidden rounded-[8px] bg-slate-950">
        {embedUrl ? (
          <iframe
            className="aspect-video w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center p-6 text-center">
            <CTAButton href={videoUrl} target="_blank" variant="primary">
              Open Video
            </CTAButton>
          </div>
        )}
      </div>
    </section>
  );
}

function NoticeContentBlockView({ block }: Readonly<{ block: NoticeContentBlock }>) {
  if (block.type === "rich_text" && block.body) {
    return (
      <section>
        {block.title ? (
          <h2 className="mb-4 font-serif text-2xl font-bold tracking-normal text-[#061f3f]">{block.title}</h2>
        ) : null}
        <div className="cms-rich-content" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(block.body) }} />
      </section>
    );
  }

  if (block.type === "image") {
    const imageUrl = getCmsAssetUrl(block.image_url ?? block.image_path);

    if (!imageUrl) {
      return null;
    }

    return (
      <figure className="overflow-hidden rounded-[8px] border border-slate-200 bg-white">
        <div className="aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden="true" />
        {block.title ? <figcaption className="px-4 py-3 text-sm font-semibold text-slate-600">{block.title}</figcaption> : null}
      </figure>
    );
  }

  if (block.type === "video" && block.video_url) {
    return <NoticeVideoBlock title={block.title ?? "Notice Video"} videoUrl={block.video_url} />;
  }

  if (block.type === "attachment") {
    const href = getCmsAssetUrl(block.attachment_url ?? block.attachment_path);

    return href ? <DownloadCard href={href} path={block.attachment_path} title={block.title ?? "Download Attachment"} /> : null;
  }

  if (block.type === "link" && block.button_url) {
    return (
      <div>
        <CTAButton href={block.button_url} target={isExternalUrl(block.button_url) ? "_blank" : "_self"} variant="subtle">
          {block.button_text ?? block.title ?? "Open Link"}
        </CTAButton>
      </div>
    );
  }

  return null;
}

function getFileExtension(value?: string | null): string {
  const extension = value?.split("?")[0]?.split(".").pop()?.toUpperCase();

  return extension && extension.length <= 4 ? extension : "FILE";
}

function isExternalUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}
