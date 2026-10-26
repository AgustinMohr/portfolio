import { ArrowUpRight } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { principles } from "@/lib/data";

export function About() {
  return (
    <section id="sobre-mi" className="relative border-t border-line">
      <div className="shell py-24 md:py-32 lg:py-40">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="01" label="Sobre mí" />
            </Reveal>

            <Reveal delay={80}>
              <h2 className="section-title mt-8 text-bone">
                La IA acelera.
                <br />
                <span className="serif-accent text-acid">
                  La ingeniería decide.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-8 max-w-sm text-sm leading-relaxed text-ash">
                No me interesa usar IA para escribir más código. Me interesa
                diseñar mejores formas de trabajar: con contexto, reglas y
                verificación.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 border border-line bg-panel/40 p-5">
                <p className="label text-acid">Off-screen</p>
                <p className="mt-3 text-sm leading-relaxed text-ash">
                  Lectura, pádel, ajedrez y mezclar música. La curiosidad no se
                  apaga cuando se cierra el editor.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="dropcap text-lg leading-relaxed text-bone md:text-xl md:leading-9">
                Soy Agustín, vivo en Santa Fe y curso cuarto año de Ingeniería
                en Sistemas de Información en la UTN FRSF. La curiosidad por
                entender cómo funcionan las cosas me trajo hasta acá, y sigue
                siendo el motor de todo lo que aprendo.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <p className="mt-6 text-sm leading-7 text-ash md:text-base md:leading-8">
                Mi perfil está orientado al desarrollo de software y la
                arquitectura de sistemas. Mi stack principal es Java, Spring
                Boot, APIs REST y bases de datos, con conocimientos
                complementarios de frontend e infraestructura.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-6 text-sm leading-7 text-ash md:text-base md:leading-8">
                Hay un área que me interesa especialmente: el desarrollo
                asistido por IA. No se trata de generar más código, sino de
                diseñar flujos estructurados, controlados y verificables.
                Especificaciones antes de implementar, agentes con contexto,
                guardrails y calidad medible.
              </p>
            </Reveal>

            <div className="mt-12 border-t border-line">
              {principles.map((principle, index) => (
                <Reveal key={principle.index} delay={index * 70}>
                  <div className="group grid gap-3 border-b border-line py-6 sm:grid-cols-[auto_1fr] sm:gap-6">
                    <span className="label pt-1 text-acid">
                      {principle.index}
                    </span>
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-base font-medium tracking-tight text-bone transition-colors duration-300 group-hover:text-acid">
                          {principle.title}
                        </h3>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-ash transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid" />
                      </div>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-ash">
                        {principle.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
