import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl } from "@/lib/cms-display";
import type { Video } from "@/types/cms";

const ALLOWED_EMBED_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
  "www.facebook.com",
  "facebook.com",
];

export function VideoEmbed({ video }: Readonly<{ video: Video }>) {
  const embedUrl = getSafeEmbedUrl(video.embed_url ?? video.video_url ?? null);
  const thumbnailUrl = getCmsAssetUrl(video.thumbnail_path ?? null);
  const externalUrl = video.video_url ?? video.embed_url ?? null;

  if (embedUrl) {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm">
        <iframe
          className="aspect-video w-full"
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {thumbnailUrl ? (
        <div
          className="aspect-video bg-slate-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnailUrl})` }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="aspect-video bg-[linear-gradient(135deg,#eff6ff,#ccfbf1_52%,#e2e8f0)]"
          aria-hidden="true"
        />
      )}
      {externalUrl ? (
        <div className="p-5">
          <CTAButton href={externalUrl} target="_blank" variant="secondary">
            Watch externally
          </CTAButton>
        </div>
      ) : null}
    </div>
  );
}

function getSafeEmbedUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (isAllowedEmbedHost(url.hostname)) {
      return url.toString();
    }

    const youtubeEmbedUrl = getYoutubeEmbedUrl(url);

    if (youtubeEmbedUrl) {
      return youtubeEmbedUrl;
    }

    const vimeoEmbedUrl = getVimeoEmbedUrl(url);

    if (vimeoEmbedUrl) {
      return vimeoEmbedUrl;
    }
  } catch {
    return null;
  }

  return null;
}

function isAllowedEmbedHost(hostname: string): boolean {
  return ALLOWED_EMBED_HOSTS.includes(hostname.toLowerCase());
}

function getYoutubeEmbedUrl(url: URL): string | null {
  const hostname = url.hostname.toLowerCase();

  if (hostname === "youtu.be") {
    const videoId = url.pathname.replace(/^\/+/, "");

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  }

  if (hostname.endsWith("youtube.com")) {
    const videoId = url.searchParams.get("v");

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
  }

  return null;
}

function getVimeoEmbedUrl(url: URL): string | null {
  const hostname = url.hostname.toLowerCase();

  if (!hostname.endsWith("vimeo.com")) {
    return null;
  }

  const videoId = url.pathname.split("/").filter(Boolean).at(0);

  return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
}
