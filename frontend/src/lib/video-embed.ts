export function getSafeVideoEmbedUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    if (hostname === "youtube-nocookie.com" && url.pathname.startsWith("/embed/")) {
      return url.toString();
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtu.be") {
      const videoId = getYouTubeVideoId(url);

      return videoId ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}` : null;
    }

    if (hostname === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
      return url.toString();
    }

    if (hostname === "vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];

      return videoId ? `https://player.vimeo.com/video/${encodeURIComponent(videoId)}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeThumbnailUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const videoId = getYouTubeVideoId(new URL(value));

    return videoId ? `https://img.youtube.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}

function getYouTubeVideoId(url: URL): string | null {
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  let videoId: string | null = null;

  if (hostname === "youtu.be") {
    videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com") {
    videoId = url.searchParams.get("v");

    if (!videoId && url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/").filter(Boolean)[1] ?? null;
    }

    if (!videoId && url.pathname.startsWith("/shorts/")) {
      videoId = url.pathname.split("/").filter(Boolean)[1] ?? null;
    }
  }

  return videoId && /^[A-Za-z0-9_-]+$/.test(videoId) ? videoId : null;
}
