import { defaultMndaFormData, type MndaFormData } from "@/lib/mnda/schema";

/** A fully valid form submission used across tests. */
export function validFormData(overrides: Partial<MndaFormData> = {}): MndaFormData {
  return {
    ...defaultMndaFormData("2026-11-22"),
    party1: {
      company: "Acme Corp",
      name: "Ada Lovelace",
      title: "CEO",
      noticeAddress: "ada@acme.example",
    },
    party2: {
      company: "Beta LLC",
      name: "Grace Hopper",
      title: "CTO",
      noticeAddress: "grace@beta.example",
    },
    ...overrides,
  };
}
