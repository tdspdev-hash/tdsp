import "server-only";
import type { Locale } from "./config";
import { sw, type Dictionary } from "./dictionaries/sw";
import { en } from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { sw, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
