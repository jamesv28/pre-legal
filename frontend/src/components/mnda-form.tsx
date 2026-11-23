"use client";

import type { ReactNode } from "react";
import {
  US_STATES,
  type MndaFormData,
  type Party,
} from "@/lib/mnda/schema";

export type FormErrors = Record<string, string>;

const YEAR_OPTIONS = [1, 2, 3, 4, 5];

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900";

interface MndaFormProps {
  values: MndaFormData;
  onChange: (values: MndaFormData) => void;
  /** Validation messages keyed by field path. Shown only once the user has tried to download. */
  errors: FormErrors;
}

/** Controlled form for the NDA details. The parent owns the values so the preview can follow them. */
export function MndaForm({ values, onChange, errors }: MndaFormProps) {
  function update<K extends keyof MndaFormData>(key: K, value: MndaFormData[K]) {
    onChange({ ...values, [key]: value });
  }

  function updateParty(which: "party1" | "party2", field: keyof Party, value: string) {
    onChange({ ...values, [which]: { ...values[which], [field]: value } });
  }

  const mndaTermValue =
    values.mndaTerm.type === "years" ? String(values.mndaTerm.years) : "until-terminated";
  const confidentialityValue =
    values.confidentialityTerm.type === "years"
      ? String(values.confidentialityTerm.years)
      : "perpetual";

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-6">
      <Section title="Agreement details">
        <Field
          label="Purpose"
          name="purpose"
          error={errors.purpose}
          hint="How Confidential Information may be used"
        >
          <textarea
            id="purpose"
            rows={2}
            value={values.purpose}
            onChange={(e) => update("purpose", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Effective date" name="effectiveDate" error={errors.effectiveDate}>
          <input
            id="effectiveDate"
            type="date"
            value={values.effectiveDate}
            onChange={(e) => update("effectiveDate", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field
          label="MNDA term"
          name="mndaTerm"
          error={errors["mndaTerm.years"] ?? errors["mndaTerm.type"]}
          hint="How long the agreement lasts"
        >
          <select
            id="mndaTerm"
            value={mndaTermValue}
            onChange={(e) =>
              update(
                "mndaTerm",
                e.target.value === "until-terminated"
                  ? { type: "until-terminated" }
                  : { type: "years", years: Number(e.target.value) },
              )
            }
            className={inputClass}
          >
            {YEAR_OPTIONS.map((n) => (
              <option key={n} value={n}>
                Expires {n} {n === 1 ? "year" : "years"} from the effective date
              </option>
            ))}
            <option value="until-terminated">Continues until terminated</option>
          </select>
        </Field>

        <Field
          label="Term of confidentiality"
          name="confidentialityTerm"
          error={errors["confidentialityTerm.years"] ?? errors["confidentialityTerm.type"]}
          hint="How long Confidential Information is protected"
        >
          <select
            id="confidentialityTerm"
            value={confidentialityValue}
            onChange={(e) =>
              update(
                "confidentialityTerm",
                e.target.value === "perpetual"
                  ? { type: "perpetual" }
                  : { type: "years", years: Number(e.target.value) },
              )
            }
            className={inputClass}
          >
            {YEAR_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "year" : "years"} from the effective date
              </option>
            ))}
            <option value="perpetual">In perpetuity</option>
          </select>
        </Field>
      </Section>

      <Section title="Governing law">
        <Field label="Governing state" name="governingLaw" error={errors.governingLaw}>
          <select
            id="governingLaw"
            value={values.governingLaw}
            onChange={(e) =>
              update("governingLaw", e.target.value as MndaFormData["governingLaw"])
            }
            className={inputClass}
          >
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Jurisdiction"
          name="jurisdiction"
          error={errors.jurisdiction}
          hint="City or county and state, e.g. New Castle, DE"
        >
          <input
            id="jurisdiction"
            type="text"
            value={values.jurisdiction}
            onChange={(e) => update("jurisdiction", e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Modifications">
        <Field
          label="Modifications to the standard terms"
          name="modifications"
          hint="Optional. Leave blank if there are none."
        >
          <textarea
            id="modifications"
            rows={3}
            value={values.modifications}
            onChange={(e) => update("modifications", e.target.value)}
            className={inputClass}
          />
        </Field>
      </Section>

      {(["party1", "party2"] as const).map((which, index) => (
        <Section key={which} title={`Party ${index + 1}`}>
          <PartyFields
            which={which}
            party={values[which]}
            errors={errors}
            onChange={updateParty}
          />
        </Section>
      ))}
    </form>
  );
}

const PARTY_FIELDS: { key: keyof Party; label: string; hint?: string }[] = [
  { key: "company", label: "Company" },
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "noticeAddress", label: "Notice address", hint: "Email address or postal address" },
];

function PartyFields({
  which,
  party,
  errors,
  onChange,
}: {
  which: "party1" | "party2";
  party: Party;
  errors: FormErrors;
  onChange: (which: "party1" | "party2", field: keyof Party, value: string) => void;
}) {
  return (
    <>
      {PARTY_FIELDS.map(({ key, label, hint }) => {
        const name = `${which}.${key}`;
        return (
          <Field key={key} label={label} name={name} error={errors[name]} hint={hint}>
            <input
              id={name}
              type="text"
              value={party[key]}
              onChange={(e) => onChange(which, key, e.target.value)}
              className={inputClass}
            />
          </Field>
        );
      })}
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
      <legend className="px-1 text-sm font-semibold text-zinc-900">{title}</legend>
      {children}
    </fieldset>
  );
}

interface FieldProps {
  label: string;
  /** Must match the `id` of the control inside the field. */
  name: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function Field({ label, name, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-800" htmlFor={name}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-zinc-500">{hint}</p>
      )}
    </div>
  );
}
