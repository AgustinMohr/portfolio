export type TwinRole = "user" | "assistant";

export type TwinMessage = {
  role: TwinRole;
  content: string;
};

export const TWIN_OPEN_EVENT = "twin:open";

export const twinWelcome =
  "Hola, soy el gemelo digital de Agustín. Podés preguntarme por mi formación, mi stack, mi forma de trabajar o cómo contactarme. ¿Qué querés saber?";

export const twinSuggestions = [
  "¿Qué estás buscando?",
  "Contame tu stack",
  "¿Cómo trabajás con IA?",
  "¿Cómo puedo contactarte?",
] as const;

export const TWIN_MAX_MESSAGES = 12;
export const TWIN_MAX_CHARS = 1200;
