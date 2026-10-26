import {
  ArrowUpRight,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { profile, projects, siteYear } from "@/lib/data";

const channels = [
  {
    label: "LinkedIn",
    title: "Perfil profesional",
    hint: "Trayectoria, formación y contacto.",
    href: profile.linkedin,
    external: true,
    icon: LinkedInIcon,
  },
  {
    label: "Email",
    title: "Contacto directo",
    hint: profile.email,
    href: `mailto:${profile.email}`,
    external: false,
    icon: MailIcon,
  },
  {
    label: "CV",
    title: "Solicitar CV",
    hint: "Disponible a pedido.",
    href: `mailto:${profile.email}?subject=${encodeURIComponent("CV — Agustín Mohr Tschopp")}`,
    external: false,
    icon: MailIcon,
  },
];

export function Portfolio() {
  return (
    <section id="portafolio" className="relative border-t border-line">
      <div className="shell py-24 md:py-32 lg:py-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="03" label="Portafolio" />
            </Reveal>
            <Reveal delay={80}>
              <h2 className="section-title mt-8 text-bone">
                Trabajo{" "}
                <span className="serif-accent text-acid">en construcción.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pb-2">
            <Reveal delay={140}>
              <p className="max-w-md text-sm leading-relaxed text-ash">
                Estoy documentando mis primeros proyectos. Sin humo: cada caso
                de estudio se publica cuando el código, las decisiones y los
                resultados están listos para mostrarse.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 border-t border-line">
          {projects.map((project, index) => (
            <Reveal key={project.index} delay={index * 60}>
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} — ${project.status}. Ver perfil de LinkedIn.`}
                className="group grid gap-5 border-b border-line py-8 transition-colors duration-300 hover:bg-panel/40 md:grid-cols-12 md:items-center md:gap-6 md:py-10"
              >
                <div className="flex items-center justify-between md:col-span-1 md:block">
                  <span className="label text-ash transition-colors duration-300 group-hover:text-acid">
                    {project.index}
                  </span>
                  <span className="label inline-flex items-center gap-2 text-ash md:hidden">
                    <span className="h-1 w-1 rounded-full bg-acid" />
                    {project.status}
                  </span>
                </div>

                <div className="md:col-span-4">
                  <h3 className="text-2xl tracking-tight text-bone transition-colors duration-300 group-hover:text-acid md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
                    {project.kicker}
                  </p>
                </div>

                <div className="md:col-span-4">
                  <p className="text-sm leading-relaxed text-ash">
                    {project.body}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ash"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-3 md:col-span-3 md:gap-6">
                  <span className="label hidden items-center gap-2 border border-line px-3 py-1.5 text-ash md:inline-flex">
                    <span className="h-1 w-1 rounded-full bg-acid" />
                    {project.status}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash transition-colors group-hover:text-acid">
                    Ver perfil
                  </span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-line-strong text-bone transition-all duration-300 group-hover:border-acid group-hover:bg-acid group-hover:text-void">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-3">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noreferrer" : undefined}
                className="group flex flex-col justify-between gap-10 bg-void p-6 transition-colors duration-300 hover:bg-panel/60"
              >
                <div className="flex items-center justify-between">
                  <Icon className="h-4 w-4 text-acid" />
                  <ArrowUpRight className="h-4 w-4 text-ash transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid" />
                </div>
                <div>
                  <p className="label text-ash">{channel.label}</p>
                  <p className="mt-2 text-lg tracking-tight text-bone">
                    {channel.title}
                  </p>
                  <p className="mt-1.5 break-all text-xs leading-relaxed text-ash">
                    {channel.hint}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
          Actualizado · {siteYear}
        </p>
      </div>
    </section>
  );
}
