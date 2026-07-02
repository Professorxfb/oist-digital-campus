import type { ApiFetchResult, ApiResponse } from "@/types/cms";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const cmsApiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export async function fetchCmsApi<TData>(
  path: string,
  fallbackData: TData,
  options: { revalidate?: number } = {},
): Promise<ApiFetchResult<TData>> {
  const endpoint = buildEndpoint(path);

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: options.revalidate ?? 60,
      },
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(getErrorMessage(payload, response.status));
    }

    if (!isApiResponse<TData>(payload)) {
      throw new Error("Unexpected CMS API response format.");
    }

    if (!payload.success) {
      throw new Error(payload.message ?? "CMS API request failed.");
    }

    return {
      data: payload.data,
      meta: payload.meta,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "CMS API request failed.";

    if (process.env.NODE_ENV !== "production") {
      console.warn(`[cms-api] ${endpoint}: ${message}`);
    }

    return {
      data: fallbackData,
      meta: {},
      error: message,
    };
  }
}

export function resolveCmsAssetUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }

  const backendOrigin = getBackendOrigin();

  if (/^https?:\/\//i.test(path)) {
    try {
      const assetUrl = new URL(path);

      if (
        assetUrl.pathname.startsWith("/storage/") &&
        ["localhost", "127.0.0.1"].includes(assetUrl.hostname)
      ) {
        return `${backendOrigin}${assetUrl.pathname}${assetUrl.search}`;
      }

      return path;
    } catch {
      return path;
    }
  }

  const normalizedPath = path.replace(/^\/+/, "");

  if (normalizedPath.startsWith("storage/")) {
    return `${backendOrigin}/${normalizedPath}`;
  }

  return `${backendOrigin}/storage/${normalizedPath}`;
}

function buildEndpoint(path: string): string {
  return `${cmsApiBaseUrl}/${path.replace(/^\/+/, "")}`;
}

function getBackendOrigin(): string {
  const apiUrl = new URL(cmsApiBaseUrl);

  return apiUrl.origin;
}

function isApiResponse<TData>(payload: unknown): payload is ApiResponse<TData> {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Partial<ApiResponse<TData>>;

  return (
    typeof candidate.success === "boolean" &&
    "data" in candidate &&
    "meta" in candidate
  );
}

function getErrorMessage(payload: unknown, status: number): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return `CMS API request failed with status ${status}.`;
}
