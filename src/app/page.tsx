import { CursorGlow } from "@/components/cursor-glow";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/lib/data";
import { serializeJsonLd } from "@/lib/json-ld";
import { siteUrl } from "@/lib/site";
import { About } from "@/sections/about";
import { Contact } from "@/sections/contact";
import { Hero } from "@/sections/hero";
import { Portfolio } from "@/sections/portfolio";
import { Trajectory } from "@/sections/trajectory";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Estudiante de Ingeniería en Sistemas de Información",
  description: profile.description,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  sameAs: [profile.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santa Fe",
    addressCountry: "AR",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidad Tecnológica Nacional — Facultad Regional Santa Fe",
  },
  knowsLanguage: ["es", "en"],
  knowsAbout: [
    "Java",
    "Spring Boot",
    "REST APIs",
    "SQL",
    "Software Architecture",
    "AI-assisted software development",
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
