import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const lastModified = new Date("2026-11-16");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified },
    { url: `${siteUrl}/privacidad`, lastModified },
  ];
}
