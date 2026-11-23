"use client";

import { useState } from "react";
import type { DocBlock } from "@/lib/mnda/build-document";

interface DownloadPdfButtonProps {
  blocks: DocBlock[];
  filename: string;
  /** When true, clicking calls onBlocked instead of downloading (e.g. the form is incomplete). */
  blocked?: boolean;
  onBlocked?: () => void;
}

/**
 * Renders the blocks to a PDF in the browser and triggers a download.
 * The PDF library is loaded on click so it stays out of the initial bundle.
 */
export function DownloadPdfButton({
  blocks,
  filename,
  blocked = false,
  onBlocked,
}: DownloadPdfButtonProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    if (blocked) {
      onBlocked?.();
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const [{ pdf }, { MndaPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./mnda-pdf-document"),
      ]);
      const blob = await pdf(<MndaPdfDocument blocks={blocks} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("The PDF could not be generated. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Preparing PDF…" : "Download PDF"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
