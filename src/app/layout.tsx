import type { Metadata, Viewport } from "next";
import {
  Instrument_Serif,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import Script from "next/script";
import { TwinChat } from "@/components/twin-chat";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.headline}`,
    template: `%s · ${profile.name}`,
  },
  description:
    "Portfolio de Agustín Mohr Tschopp, estudiante avanzado de Ingeniería en Sistemas de Información en la UTN FRSF. Backend, arquitectura y desarrollo de software asistido por IA.",
  keywords: [
    "Agustín Mohr Tschopp",
    "Ingeniería en Sistemas",
    "UTN FRSF",
    "Spring Boot",
    "Java",
    "Backend",
    "Desarrollo asistido por IA",
    "Santa Fe",
    "Argentina",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  applicationName: profile.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: profile.name,
    title: `${profile.name} — ${profile.headline}`,
    description:
      "Backend, arquitectura y desarrollo de software asistido por IA. Estudiante avanzado de Ingeniería en Sistemas en la UTN FRSF.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.headline}`,
    description:
      "Backend, arquitectura y desarrollo de software asistido por IA. Estudiante avanzado de Ingeniería en Sistemas en la UTN FRSF.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-clip bg-void text-bone antialiased">
        <Script id="reveal-bootstrap" strategy="beforeInteractive">
          {`(function () {
  var root = document.documentElement;
  root.classList.add("js");
  function revealAll() {
    root.classList.add("reveal-fallback");
  }
  window.setTimeout(function () {
    if (!window.__portfolioRevealReady) revealAll();
  }, 2500);
  window.addEventListener("error", revealAll, true);
  window.addEventListener("unhandledrejection", revealAll);
})();`}
        </Script>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {children}
        <TwinChat />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
