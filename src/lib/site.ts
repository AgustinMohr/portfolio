const LOCAL_SITE_URL = "http://localhost:3100";

function normalizeSiteUrl(value: string) {
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use http or https.");
  }

  return url.href.replace(/\/$/, "");
}

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return normalizeSiteUrl(configured);
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (vercelHost) {
    return normalizeSiteUrl(`https://${vercelHost}`);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_URL is required for production builds.");
  }

  return LOCAL_SITE_URL;
}

export const siteUrl = resolveSiteUrl();
