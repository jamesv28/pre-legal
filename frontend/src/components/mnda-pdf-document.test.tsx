import { describe, expect, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { MndaPdfDocument } from "./mnda-pdf-document";
import { buildMndaDocument } from "@/lib/mnda/build-document";
import { validFormData } from "@/test/fixtures";

describe("MndaPdfDocument", () => {
  it("renders a non-empty PDF", async () => {
    const blocks = buildMndaDocument(validFormData());
    const buffer = await renderToBuffer(<MndaPdfDocument blocks={blocks} />);
    expect(buffer.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(buffer.length).toBeGreaterThan(5000);
  });
});
