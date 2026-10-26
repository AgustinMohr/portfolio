import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { stackGroups, timeline } from "@/lib/data";

export function Trajectory() {
  return (
    <section id="trayectoria" className="relative border-t border-line">
      <div className="shell py-24 md:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
            <Reveal>
              <SectionLabel index="02" label="Trayectoria profesional" />
            </Reveal>

            <Reveal delay={80}>
              <h2 className="section-title mt-8 text-bone">
                Formación, foco
                <br />
                y el{" "}
                <span className="serif-accent text-acid">próximo paso.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-ash">
                Sin atajos ni títulos inflados: formación real, práctica
                constante y un objetivo claro.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 space-y-4">
                <div className="border border-line bg-panel/40 p-5">
                  <p className="label text-ash">Formación</p>
                  <p className="mt-3 text-lg tracking-tight text-bone">
                    Ingeniería en Sistemas
                  </p>
                  <p className="mt-1 text-sm text-ash">
                    UTN · Facultad Regional Santa Fe
                  </p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-acid">
                    2020 — En curso · 4.º año
                  </p>
                </div>

                <div className="border border-line bg-panel/40 p-5">
                  <p className="label text-ash">Idiomas</p>
                  <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                    <span className="text-bone">Español</span>
                    <span className="label text-ash">Nativo</span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-4 text-sm">
                    <span className="text-bone">Inglés</span>
                    <span className="label text-acid">Avanzado</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="border-t border-line">
              {timeline.map((item, index) => (
                <Reveal key={item.index} delay={index * 60}>
                  <article className="group border-b border-line py-8 transition-colors duration-300 hover:bg-panel/30 md:grid md:grid-cols-[8.5rem_1fr] md:gap-8">
                    <div className="flex items-start justify-between gap-4 md:block">
                      <span className="label text-acid">{item.index}</span>
                      <span className="label mt-0 block whitespace-nowrap text-ash md:mt-4">
                        {item.period}
                      </span>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <h3 className="text-2xl tracking-tight text-bone md:text-[1.75rem]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-bone/80">
                        {item.subtitle}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
                        {item.org}
                      </p>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-ash">
                        {item.body}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <li
                            key={tag}
                            className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ash transition-colors duration-300 group-hover:border-line-strong"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="mt-14">
                <div className="flex items-center justify-between gap-4">
                  <p className="label text-ash">Stack</p>
                  <p className="label text-ash">Herramientas & proceso</p>
                </div>

                <div className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2">
                  {stackGroups.map((group) => (
                    <div
                      key={group.index}
                      className="bg-void p-5 transition-colors duration-300 hover:bg-panel/60"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-sm font-medium tracking-tight text-bone">
                          {group.title}
                        </p>
                        <span className="label text-ash">{group.index}</span>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-2.5 text-[13px] text-ash"
                          >
                            <span className="h-1 w-1 shrink-0 rounded-full bg-acid/70" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
