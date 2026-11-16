import { CursorGlow } from "@/components/cursor-glow";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile, profileFacts } from "@/lib/data";
import { serializeJsonLd } from "@/lib/json-ld";
import { seoDescription } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { About } from "@/sections/about";
import { Contact } from "@/sections/contact";
import { Hero } from "@/sections/hero";
import { Portfolio } from "@/sections/portfolio";
import { Trajectory } from "@/sections/trajectory";

const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: profile.name,
      inLanguage: "es-AR",
      publisher: { "@id": personId },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: profile.name,
      jobTitle: `Estudiante de ${profileFacts.education.degree}`,
      description: seoDescription,
      email: profile.email,
      url: siteUrl,
      image: `${siteUrl}/opengraph-image`,
      sameAs: [profile.linkedin, profile.github],
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.city,
        addressCountry: "AR",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: profileFacts.education.university,
      },
      knowsLanguage: ["es", "en"],
      knowsAbout: [
        "Java",
        "Spring Boot",
        "APIs REST",
        "SQL",
        "Arquitectura de software",
        "Desarrollo de software asistido por IA",
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <SiteHeader />

      <main id="contenido" className="relative z-10">
        <Hero />
        <About />
        <Trajectory />
        <Portfolio />
        <Contact />
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
    </>
  );
}
