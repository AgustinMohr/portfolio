import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos trata este sitio, con qué proveedores y cómo ejercer tus derechos.",
  alternates: { canonical: "/privacidad" },
};

const sections = [
  {
    title: "Quién es el responsable",
    body: [
      `Este sitio lo gestiona ${profile.name}. Podés escribirme a ${profile.email} por cualquier consulta sobre tus datos.`,
    ],
  },
  {
    title: "Gemelo digital (chat con IA)",
    body: [
      "Lo que escribís en el chat se envía a mi servidor y de ahí a OpenRouter, que lo reenvía a un modelo de IA de un tercero. El proveedor del modelo puede registrar el contenido de los mensajes según su propia política.",
      "Este sitio no guarda las conversaciones: viven solo en tu navegador mientras el chat está abierto. No compartas datos sensibles ni personales de terceros.",
      "El gemelo es una IA y puede equivocarse. No es una persona ni compromete condiciones laborales.",
    ],
  },
  {
    title: "Límite de uso y dirección IP",
    body: [
      "Para evitar abusos se limita la cantidad de consultas. Para eso se usa tu dirección IP, que se transforma con un hash con sal antes de guardarse en un almacén de datos (Upstash) durante unos minutos. No se guarda la IP en claro.",
    ],
  },
  {
    title: "Hosting y registros técnicos",
    body: [
      "El sitio se aloja en Vercel, que puede registrar datos técnicos de cada visita (como la IP y la página solicitada) según su política.",
    ],
  },
  {
    title: "Contacto, cookies y analítica",
    body: [
      "El formulario de contacto abre tu cliente de correo con un mensaje armado: no pasa por este sitio ni se guarda aquí.",
      "El sitio no usa cookies de seguimiento ni herramientas de analítica.",
    ],
  },
  {
    title: "Tus derechos",
    body: [
      "Podés pedir acceso, rectificación o eliminación de los datos que tenga sobre vos escribiéndome por email. En Argentina, la autoridad de control de la Ley 25.326 es la Agencia de Acceso a la Información Pública.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main
      id="contenido"
      className="relative z-10 min-h-dvh border-t border-line"
    >
      <div className="shell max-w-3xl py-24 md:py-32">
        <p className="label text-acid">Privacidad</p>
        <h1 className="section-title mt-6 text-bone">
          Cómo trato <span className="serif-accent text-acid">tus datos.</span>
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-ash">
          Última actualización: noviembre de 2026.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl tracking-tight text-bone">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-sm leading-7 text-ash md:text-base md:leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <Link href="/" className="btn btn-primary mt-14">
          Volver al inicio
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
