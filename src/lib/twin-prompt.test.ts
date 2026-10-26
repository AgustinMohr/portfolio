import { describe, expect, it } from "vitest";
import { profileFacts, type ProfileFacts } from "@/lib/data";
import { buildTwinPrompt } from "@/lib/twin-server";

describe("buildTwinPrompt", () => {
  it("builds the factual section from the shared profile facts", () => {
    const prompt = buildTwinPrompt(profileFacts);

    expect(prompt).toContain(profileFacts.name);
    expect(prompt).toContain(profileFacts.email);
    expect(prompt).toContain(profileFacts.linkedin);
    expect(prompt).toContain(profileFacts.education.degree);
    expect(prompt).toContain(profileFacts.stack.primary.join(", "));
    expect(prompt).toContain(profileFacts.availability);
    expect(prompt).toContain("No inventes experiencia laboral");
  });

  it("reflects changes made to the facts object", () => {
    const facts: ProfileFacts = {
      ...profileFacts,
      name: "Persona de Prueba",
      education: {
        ...profileFacts.education,
        year: "segundo año",
      },
    };

    const prompt = buildTwinPrompt(facts);

    expect(prompt).toContain("Persona de Prueba");
    expect(prompt).toContain("segundo año");
    expect(prompt).not.toContain(profileFacts.name);
  });
});
