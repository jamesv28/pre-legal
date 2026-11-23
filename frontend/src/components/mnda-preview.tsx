import type { DocBlock } from "@/lib/mnda/build-document";
import { signatureRows } from "@/lib/mnda/signature";

/** On-screen rendering of the document blocks. The PDF uses the same blocks. */
export function MndaPreview({ blocks }: { blocks: DocBlock[] }) {
  return (
    <article className="mx-auto max-w-3xl space-y-4 bg-white px-10 py-12 text-[15px] leading-relaxed text-zinc-900 shadow-sm ring-1 ring-zinc-200">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </article>
  );
}

function Block({ block }: { block: DocBlock }) {
  switch (block.kind) {
    case "title":
      return (
        <h1 className="pb-2 text-center text-2xl font-bold">{block.text}</h1>
      );
    case "heading":
      return <h2 className="pt-4 text-base font-semibold">{block.text}</h2>;
    case "paragraph":
      return <p className="text-justify">{block.text}</p>;
    case "field":
      return (
        <p>
          <span className="font-semibold">{block.label}:</span> {block.value}
        </p>
      );
    case "checkbox":
      return (
        <p className="pl-4">
          <span className="font-mono">[{block.checked ? "x" : " "}]</span>{" "}
          {block.text}
        </p>
      );
    case "section":
      return (
        <p className="text-justify">
          <span className="font-semibold">
            {block.number}. {block.title}.
          </span>{" "}
          {block.body}
        </p>
      );
    case "signature":
      return (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-1/4 border-b border-zinc-300 py-2 text-left" />
              <th className="w-[37.5%] border-b border-zinc-300 py-2 text-left">
                Party 1
              </th>
              <th className="w-[37.5%] border-b border-zinc-300 py-2 text-left">
                Party 2
              </th>
            </tr>
          </thead>
          <tbody>
            {signatureRows(block.parties).map((row) => (
              <tr key={row.label}>
                <td className="border-b border-zinc-200 py-3 align-top font-semibold">
                  {row.label}
                  {row.note && (
                    <span className="block text-xs font-normal text-zinc-500">
                      {row.note}
                    </span>
                  )}
                </td>
                {row.values.map((value, i) => (
                  <td
                    key={i}
                    className="border-b border-zinc-200 py-3 align-top"
                  >
                    {value || " "}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "footer":
      return <p className="pt-6 text-xs text-zinc-500">{block.text}</p>;
  }
}
