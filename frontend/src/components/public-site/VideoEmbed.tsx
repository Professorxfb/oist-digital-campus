import { CTAButton } from "@/components/public-site/CTAButton";
import { getCmsAssetUrl } from "@/lib/cms-display";
import { getSafeVideoEmbedUrl } from "@/lib/video-embed";
import type { Video } from "@/types/cms";

export function VideoEmbed({ video }: Readonly<{ video: Video }>) {
  const embedUrl = getSafeVideoEmbedUrl(video.embed_url ?? video.video_url ?? null);
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
