import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Portfolio } from "@/sections/portfolio";

describe("Portfolio", () => {
  it("labels project links as GitHub repositories instead of case studies", () => {
    render(<Portfolio />);

    const links = screen.getAllByRole("link", {
      name: /Ver repositorio en GitHub/i,
    });

    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      expect(link).toHaveTextContent("Ver repositorio");
      expect(link.getAttribute("href")).toContain("github.com/AgustinMohr/");
    }
  });
});
