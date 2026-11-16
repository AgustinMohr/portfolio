import Link from "next/link";
import { navItems, profile, siteYear } from "@/lib/data";
import { ArrowUp, ArrowUpRight, LinkedInIcon, MailIcon } from "./icons";
import { LocalClock } from "./local-clock";

export function SiteFooter() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-line">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a
              href="#inicio"
              className="group inline-flex items-center gap-3"
            >
              <span className="relative grid h-10 w-10 place-items-center border border-line-strong transition-colors group-hover:border-acid">
                <span className="font-mono text-xs tracking-[0.08em] text-bone">
                  {profile.initials}
                </span>
                <span className="absolute -right-[3px] -top-[3px] h-[5px] w-[5px] bg-acid" />
              </span>
              <span className="text-sm font-medium tracking-tight text-bone">
                Agustín Mohr <span className="text-ash">/ Sistemas</span>
              </span>
            </a>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ash">
              Software con criterio de ingeniería. Diseñado y construido con
              Next.js. Cuidado en cada detalle.
            </p>
            <div className="mt-8 inline-flex items-center gap-2 border border-line px-3 py-2">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-acid" />
              <span className="label text-acid">
                {profile.availabilityLabel}
              </span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="label text-ash">Navegación</p>
            <ul className="mt-4 space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="link-line inline-flex py-2 text-sm text-bone/80 hover:text-bone"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between gap-10 lg:col-span-4">
            <div>
              <p className="label text-ash">Contacto directo</p>
              <div className="mt-4 flex flex-col items-start gap-1">
                <a
                  href={`mailto:${profile.email}`}
                  className="link-line inline-flex w-fit py-2 text-base text-bone"
                >
                  <MailIcon className="h-4 w-4 text-acid" />
                  {profile.email}
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="link-line inline-flex w-fit py-2 text-base text-bone"
                >
                  <LinkedInIcon className="h-4 w-4 text-acid" />
                  LinkedIn
                  <ArrowUpRight className="h-3.5 w-3.5 text-ash" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="label flex items-center gap-2 text-ash">
                {profile.city}
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <LocalClock />
              </span>
              <a
                href="#inicio"
                aria-label="Volver arriba"
                className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-bone transition-colors hover:border-acid hover:text-acid"
              >
                <ArrowUp className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ash">
            © {siteYear} {profile.name}
          </p>
          <div className="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.18em] text-ash">
            <Link href="/privacidad" className="inline-flex py-2 transition-colors hover:text-acid">
              Privacidad
            </Link>
            <span>{profile.coordinates}</span>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none overflow-hidden"
      >
        <p className="translate-y-[26%] whitespace-nowrap text-center text-[21vw] font-medium leading-none tracking-[-0.06em] text-bone/5 before:content-['MOHR']" />
      </div>
    </footer>
  );
}
