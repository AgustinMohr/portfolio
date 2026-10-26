import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/lib/json-ld";

describe("serializeJsonLd", () => {
  it("escapes characters that could break a script block", () => {
    const value = {
      name: "</script><script>alert(1)</script>",
      ampersand: "a&b",
      separators: "\u2028\u2029",
    };

    const serialized = serializeJsonLd(value);

    expect(serialized).not.toContain("</script>");
    expect(serialized).toContain("\\u003c");
    expect(serialized).toContain("\\u0026");
    expect(serialized).toContain("\\u2028");
    expect(serialized).toContain("\\u2029");
    expect(JSON.parse(serialized)).toEqual(value);
  });
});
