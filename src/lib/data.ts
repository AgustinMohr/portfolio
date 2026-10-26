export const profile = {
  name: "Agustín Mohr Tschopp",
  initials: "AMT",
  headline: "Sistemas con intención",
  role: "Ingeniería en Sistemas · Software & IA",
  location: "Santa Fe, Argentina",
  coordinates: "31.6107° S / 60.6973° O",
  email: "agustinmohr@hotmail.com",
  linkedin: "https://www.linkedin.com/in/agustin-mohr-tschopp-573806423",
  availability: "Disponible para pasantías y roles junior",
  availabilityLabel: "Open to work",
  description:
    "Estudiante avanzado de Ingeniería en Sistemas de Información en la UTN FRSF. Foco en backend, arquitectura y desarrollo de software asistido por inteligencia artificial.",
} as const;

export const siteYear = new Date().getFullYear();

export type ProfileFacts = {
  name: string;
  location: string;
  email: string;
  linkedin: string;
  education: {
    degree: string;
    university: string;
    year: string;
    startedAt: number;
    graduated: boolean;
  };
  experience: string;
  focus: string;
  stack: {
    primary: readonly string[];
    complementary: string;
    ai: string;
  };
  languages: string;
  availability: string;
  interests: readonly string[];
  projects: string;
};

export const profileFacts = {
  name: profile.name,
  location: profile.location,
  email: profile.email,
  linkedin: profile.linkedin,
  education: {
    degree: "Ingeniería en Sistemas de Información",
    university:
      "Universidad Tecnológica Nacional, Facultad Regional Santa Fe",
    year: "cuarto año",
    startedAt: 2020,
    graduated: false,
  },
  experience:
    "Todavía no tiene experiencia laboral formal. Su recorrido es académico y de aprendizaje autónomo.",
  focus: "desarrollo de software y arquitectura de sistemas",
  stack: {
    primary: ["Java", "Spring Boot", "APIs REST", "SQL", "Git"],
    complementary:
      "conocimientos complementarios de frontend e infraestructura, sin herramientas específicas detalladas en su perfil",
    ai: "desarrollo de software asistido por inteligencia artificial con criterio de ingeniería: Spec-Driven Development, agentes de programación, skills, MCP, guardrails, pruebas automatizadas, revisión de código y validaciones. Le interesa diseñar flujos de trabajo estructurados, controlados y verificables, no generar código sin control.",
  },
  languages:
    "inglés avanzado: puede leer documentación técnica y comunicarse en equipos multiculturales",
  availability: profile.availability,
  interests: ["la lectura", "el pádel", "el ajedrez", "mezclar música"],
  projects:
    "casos de estudio en preparación sobre APIs con Spring Boot, sistemas de gestión y flujos de ingeniería asistida por IA. No hay resultados, métricas, clientes ni empresas inventadas.",
} satisfies ProfileFacts;

export const navItems = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "portafolio", label: "Portafolio" },
  { id: "contacto", label: "Contacto" },
] as const;

export const marqueeItems = [
  "Java",
  "Spring Boot",
  "APIs REST",
  "SQL",
  "Arquitectura",
  "Git",
  "Testing",
  "Spec-Driven Development",
  "AI Agents",
  "MCP",
  "Guardrails",
  "Code Review",
] as const;

export const principles = [
  {
    index: "01",
    title: "Arquitectura antes que framework",
    body: "Entender el problema es la mitad del trabajo. El código viene después, y viene mejor.",
  },
  {
    index: "02",
    title: "IA con límites, no con fe",
    body: "Agentes, skills y guardrails al servicio de un resultado que se puede explicar y verificar.",
  },
  {
    index: "03",
    title: "Calidad que se demuestra",
    body: "Git, pruebas, revisión y validaciones. Menos promesas, más evidencia en cada entrega.",
  },
] as const;

export const timeline = [
  {
    index: "01",
    period: "2020 — Hoy",
    title: "Formación de grado",
    subtitle: "Ingeniería en Sistemas de Información",
    org: "UTN · Facultad Regional Santa Fe",
    body: "Cuarto año en curso. Una base amplia en algoritmos, arquitectura, bases de datos y sistemas operativos que ordena todo lo que construyo después.",
    tags: ["UTN FRSF", "4.º año", "Santa Fe"],
  },
  {
    index: "02",
    period: "Fundamentos",
    title: "Backend con criterio",
    subtitle: "Java · Spring Boot · APIs REST · SQL",
    org: "Desarrollo y aprendizaje autónomo",
    body: "Construcción de servicios, modelado de datos y contratos claros. Git como disciplina diaria, no como trámite al final del día.",
    tags: ["Java", "Spring Boot", "SQL", "Git"],
  },
  {
    index: "03",
    period: "Especialización",
    title: "Ingeniería asistida por IA",
    subtitle: "Spec-Driven Development · Agentes · MCP",
    org: "Flujos de trabajo estructurados",
    body: "Diseño procesos donde la IA trabaja con contexto, reglas y verificación. Especificaciones antes de implementar, guardrails que reducen el desvío y revisión humana en cada paso.",
    tags: ["SDD", "AI Agents", "MCP", "Guardrails"],
  },
  {
    index: "04",
    period: "Ahora",
    title: "Primera oportunidad",
    subtitle: "Pasantía · Trainee · Junior",
    org: "Abierto a equipos con ambición",
    body: "Busco un lugar donde aportar valor real desde el primer día, aprender de gente con oficio y crecer con una base técnica sólida.",
    tags: ["Open to work", "Inglés avanzado"],
  },
] as const;

export const stackGroups = [
  {
    index: "01",
    title: "Backend",
    items: ["Java", "Spring Boot", "APIs REST"],
  },
  {
    index: "02",
    title: "Datos",
    items: ["SQL", "Modelado relacional", "Persistencia"],
  },
  {
    index: "03",
    title: "Herramientas",
    items: ["Git", "Testing", "Code review"],
  },
  {
    index: "04",
    title: "IA & proceso",
    items: ["Spec-Driven Development", "AI Agents", "Skills & MCP", "Guardrails"],
  },
] as const;

export const projects = [
  {
    index: "01",
    title: "API de gestión",
    kicker: "Servicios REST con Spring Boot",
    body: "Diseño de dominio, persistencia y contratos de API con foco en claridad, seguridad y mantenibilidad.",
    tags: ["Java", "Spring Boot", "REST", "SQL"],
    status: "En preparación",
    href: profile.linkedin,
  },
  {
    index: "02",
    title: "Sistema de gestión",
    kicker: "Flujos operativos reales",
    body: "Modelado de datos y lógica de negocio para procesos que necesitan orden, trazabilidad y reglas explícitas.",
    tags: ["Arquitectura", "Backend", "SQL"],
    status: "En preparación",
    href: profile.linkedin,
  },
  {
    index: "03",
    title: "AI-assisted workflow",
    kicker: "Ingeniería con agentes",
    body: "Spec-driven development, skills y guardrails para que la IA acelere sin romper el proceso ni la calidad.",
    tags: ["SDD", "MCP", "AI Agents", "Guardrails"],
    status: "En preparación",
    href: profile.linkedin,
  },
] as const;


