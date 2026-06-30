export function sanitizeCmsHtml(value?: string | null): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|input|button|link|meta|base|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?(script|style|iframe|object|embed|form|input|button|link|meta|base|svg|math)[^>]*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+style\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (match, attribute: string, rawValue: string) => {
      const unquotedValue = rawValue.replace(/^['"]|['"]$/g, "").trim();

      return isSafeCmsUrl(unquotedValue) ? ` ${attribute}="${escapeAttribute(unquotedValue)}"` : "";
    });
}

function isSafeCmsUrl(value: string): boolean {
  if (!value) {
    return false;
  }

  if (value.startsWith("#") || value.startsWith("/") || value.startsWith("./") || value.startsWith("../")) {
    return true;
  }

  return /^(https?:|mailto:|tel:)/i.test(value);
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
