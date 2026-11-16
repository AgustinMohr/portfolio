import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import {
  ArrowUpRight,
  ClockIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  SparklesIcon,
} from "@/components/icons";
import { TwinTrigger } from "@/components/twin-trigger";
import { LocalClock } from "@/components/local-clock";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { profile } from "@/lib/data";

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden border-t border-line"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(216,255,62,0.12),transparent_65%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="grid-lines grid-mask absolute inset-0 opacity-30"
      />

      <div className="shell relative py-24 md:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal>
              <SectionLabel index="04" label="Contacto" />
            </Reveal>

            <Reveal delay={80}>
              <h2 className="section-title mt-8 text-bone">
                ¿Construimos
                <br />
                <span className="serif-accent text-acid">algo?</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-ash md:text-base md:leading-8">
                Busco mi primera oportunidad como pasante, trainee o
                desarrollador junior. Si te interesa cómo pienso y cómo trabajo,
                hablemos.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 border-t border-line">
                <div className="flex flex-col gap-3 border-b border-line py-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="label text-ash">Email</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${profile.email}`}
                      className="link-line inline-flex py-2 text-sm text-bone"
                    >
                      <MailIcon className="h-4 w-4 text-acid" />
                      {profile.email}
                    </a>
                    <CopyEmail />
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-b border-line py-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="label text-ash">LinkedIn</span>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="link-line inline-flex w-fit py-2 text-sm text-bone"
                  >
                    <LinkedInIcon className="h-4 w-4 text-acid" />
                    /in/agustin-mohr-tschopp
                    <ArrowUpRight className="h-3.5 w-3.5 text-ash" />
                  </a>
                </div>

                <div className="flex flex-col gap-3 border-b border-line py-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="label text-ash">Ubicación</span>
                  <span className="inline-flex items-center gap-2 text-sm text-bone">
                    <MapPinIcon className="h-4 w-4 text-acid" />
                    {profile.location}
                    <span className="hidden font-mono text-xs tracking-[0.14em] text-ash sm:inline">
                      {profile.coordinates}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col gap-3 border-b border-line py-5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="label text-ash">Disponibilidad</span>
                  <span className="inline-flex items-center gap-2 text-sm text-bone">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-acid" />
                    {profile.availability}
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8 flex items-center gap-3 text-ash">
                <ClockIcon className="h-4 w-4 text-acid" />
                <LocalClock />
                <span className="label text-ash">Hora local · UTC-3</span>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-8 border border-acid/25 bg-acid/5 p-5">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="h-3.5 w-3.5 text-acid" />
                  <p className="label text-acid">Gemelo digital</p>
                </div>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ash">
                  Preguntas rápidas sobre mi formación, mi stack o mi forma de
                  trabajar. Respuestas generadas por IA a partir de mi perfil.
                </p>
                <TwinTrigger className="mt-4" />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={120}>
              <div className="relative border border-line-strong bg-panel/50 p-6 backdrop-blur-sm md:p-8">
                <span
                  aria-hidden="true"
                  className="absolute -left-px -top-px h-3 w-3 border-l border-t border-acid"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-px -top-px h-3 w-3 border-r border-t border-acid"
                />

                <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
                  <div>
                    <p className="label text-acid">Formulario / 01</p>
                    <p className="mt-2 text-base font-medium tracking-tight text-bone">
                      Escribime directo
                    </p>
                  </div>
                  <MailIcon className="h-5 w-5 text-ash" />
                </div>

                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
