import { ArrowDown, ArrowUpRight } from "@/components/icons";
import { LocalClock } from "@/components/local-clock";
import { marqueeItems, profile, siteYear } from "@/lib/data";

function MarqueeList() {
  return (
    <div className="flex shrink-0 items-center">
      {marqueeItems.map((item) => (
        <span
          key={item}
          className="flex shrink-0 items-center gap-6 pr-6 font-mono text-xs uppercase tracking-[0.2em] whitespace-nowrap text-ash"
        >
          {item}
          <span className="h-1 w-1 rounded-full bg-acid/70" />
        </span>
      ))}
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5 last:border-b-0">
      <dt className="label shrink-0 text-ash">{label}</dt>
      <dd className="text-right text-[13px] text-bone">{value}</dd>
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="grid-lines grid-mask absolute inset-0 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 top-[-8rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(216,255,62,0.12),transparent_62%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(216,255,62,0.05),transparent_65%)] blur-3xl"
      />

      <div className="shell relative flex min-h-[100svh] flex-col justify-center pb-10 pt-28 md:pt-32">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div
              className="rise flex flex-wrap items-center gap-x-4 gap-y-2"
              style={{ animationDelay: "80ms" }}
            >
              <span className="label text-acid">{profile.name}</span>
              <span className="h-px w-8 bg-line-strong" />
              <span className="label text-ash">{profile.city} · Argentina</span>
            </div>

            <h1
              className="hero-title rise mt-8 text-bone"
              style={{ animationDelay: "160ms" }}
            >
              Sistemas
              <br />
              con <span className="serif-accent text-acid">intención.</span>
            </h1>

            <p
              className="rise mt-8 max-w-xl text-[15px] leading-7 text-ash md:text-base md:leading-8"
              style={{ animationDelay: "260ms" }}
            >
              Estudiante avanzado de Ingeniería en Sistemas en la UTN FRSF.
              Construyo software con foco en{" "}
              <span className="text-bone">
                backend, arquitectura y desarrollo asistido por IA
              </span>{" "}
              — con criterio de ingeniería, no con piloto automático.
            </p>

            <div
              className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "340ms" }}
            >
              <a href="#contacto" className="btn btn-primary">
                Hablemos
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a href="#trayectoria" className="btn btn-ghost">
                Ver trayectoria
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            <div
              className="rise mt-10 flex flex-wrap items-center gap-x-5 gap-y-3"
              style={{ animationDelay: "420ms" }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-acid" />
                <span className="label text-bone">{profile.availabilityLabel}</span>
              </span>
              <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
              <span className="label text-ash">Inglés avanzado</span>
              <span aria-hidden="true" className="h-px w-5 bg-line-strong" />
              <span className="label text-ash">{profile.year} · UTN FRSF</span>
            </div>
          </div>

          <div
            className="rise lg:col-span-5"
            style={{ animationDelay: "300ms" }}
          >
            <div className="relative mx-auto w-full max-w-md lg:ml-auto">
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-full bg-acid/5 blur-3xl"
              />
              <aside className="relative border border-line-strong bg-panel/60 backdrop-blur-md">
                <span
                  aria-hidden="true"
                  className="absolute -left-px -top-px h-3 w-3 border-l border-t border-acid"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-px -top-px h-3 w-3 border-r border-t border-acid"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-acid"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-acid"
                />

                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <span className="label text-ash">
                    Perfil / {siteYear}
                  </span>
                  <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-acid">
                    <span className="pulse-dot h-1 w-1 rounded-full bg-acid" />
                    Disponible
                  </span>
                </div>

                <div className="relative aspect-[5/4] overflow-hidden border-b border-line">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(216,255,62,0.2),transparent_55%)]" />
                  <div className="grid-lines absolute inset-0 opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="serif-accent text-[clamp(4.5rem,11vw,7.5rem)] leading-none text-bone">
                      {profile.initials}
                    </span>
                  </div>
                  <span className="label absolute left-4 top-4 text-ash">
                    SYS / 01
                  </span>
                  <span className="label absolute bottom-4 left-4 text-ash">
                    {profile.startedAt} — ∞
                  </span>
                  <span className="label absolute bottom-4 right-4 text-acid">
                    FRSF
                  </span>
                </div>

                <dl>
                  <ProfileRow label="Base" value={profile.location} />
                  <ProfileRow
                    label="Foco"
                    value="Backend · Arquitectura · IA"
                  />
                  <ProfileRow label="Formación" value={`UTN FRSF — ${profile.year}`} />
                  <ProfileRow
                    label="Idiomas"
                    value="Español · Inglés avanzado"
                  />
                </dl>

                <div className="flex items-center justify-between border-t border-line px-5 py-3">
                  <span className="label text-ash">Hora local</span>
                  <LocalClock />
                </div>
              </aside>
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-line pt-5 md:mt-20">
          <span className="label text-ash">{profile.coordinates}</span>
          <a
            href="#sobre-mi"
            className="group inline-flex items-center gap-3 text-ash transition-colors hover:text-acid"
          >
            <span className="label">Desplazá</span>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-acid">
              <ArrowDown className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>

      <div
        className="marquee relative border-y border-line bg-panel/40 py-4"
        aria-hidden="true"
      >
        <div className="marquee-track">
          <MarqueeList />
          <MarqueeList />
        </div>
      </div>
    </section>
  );
}
