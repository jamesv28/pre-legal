"use client";

import { useState } from "react";
import { DownloadPdfButton } from "@/components/download-pdf-button";
import { MndaForm } from "@/components/mnda-form";
import { MndaPreview } from "@/components/mnda-preview";
import { buildMndaDocument } from "@/lib/mnda/build-document";
import {
  defaultMndaFormData,
  mndaFormSchema,
  toErrorMap,
  type MndaFormData,
} from "@/lib/mnda/schema";

/** Local calendar date as yyyy-mm-dd. This component is client-only, so it reads the user's clock. */
function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Form on the left, live document preview on the right. */
export function NdaWorkspace() {
  const [values, setValues] = useState<MndaFormData>(() =>
    defaultMndaFormData(todayIso()),
  );
  // Field errors are only shown after the user tries to download, so the form isn't red on load.
  const [showErrors, setShowErrors] = useState(false);

  const validation = mndaFormSchema.safeParse(values);
  const errors = validation.success ? {} : toErrorMap(validation.error.issues);
  const missingCount = Object.keys(errors).length;
  const blocks = buildMndaDocument(values);
  const filename = `Mutual-NDA-${values.effectiveDate || "draft"}.pdf`;

  return (
    <main className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">Mutual NDA</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Common Paper Mutual Non-Disclosure Agreement. The preview updates as you type.
        </p>
      </header>

      <div className="grid gap-6 p-6 lg:grid-cols-2 lg:items-start">
        <section aria-label="NDA details" className="lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
          <MndaForm
            values={values}
            onChange={setValues}
            errors={showErrors ? errors : {}}
          />
        </section>

        <section
          aria-label="Document preview"
          className="space-y-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-zinc-600">
              {showErrors && missingCount > 0 ? (
                <p role="alert" className="text-red-600">
                  Fill in the {missingCount} highlighted{" "}
                  {missingCount === 1 ? "field" : "fields"} to download.
                </p>
              ) : (
                <p>Preview</p>
              )}
            </div>
            <DownloadPdfButton
              blocks={blocks}
              filename={filename}
              blocked={!validation.success}
              onBlocked={() => setShowErrors(true)}
            />
          </div>
          <MndaPreview blocks={blocks} />
        </section>
      </div>
    </main>
  );
}
