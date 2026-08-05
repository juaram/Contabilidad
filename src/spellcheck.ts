import { Movement } from './types';

const ALPHABET = 'abcdefghijklmnñopqrstuvwxyzáéíóúü';

let baseDictionaryPromise: Promise<Set<string>> | null = null;

/**
 * Carga (de forma diferida y con caché) el diccionario base en español.
 * El JSON (~636k palabras) se descarga solo la primera vez que se usa.
 */
export function loadBaseDictionary(): Promise<Set<string>> {
  if (!baseDictionaryPromise) {
    baseDictionaryPromise = (async () => {
      const mod: unknown = await import('an-array-of-spanish-words');
      const arr = (mod as { default?: string[] }).default ?? (mod as string[]);
      return new Set(arr);
    })();
  }
  return baseDictionaryPromise;
}

/** Divide una descripción en tokens de letras (ignora números y símbolos). */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter((w) => w.length >= 2 && /[a-záéíóúüñ]/.test(w));
}

function edits1(word: string): Set<string> {
  const result = new Set<string>();
  const len = word.length;
  const splits: Array<[string, string]> = [];
  for (let i = 0; i <= len; i++) splits.push([word.slice(0, i), word.slice(i)]);
  for (const [l, r] of splits) {
    if (r.length > 0) result.add(l + r.slice(1)); // borrado
    if (r.length > 1) result.add(l + r[1] + r[0] + r.slice(2)); // transposición
    if (r.length > 0) {
      for (const c of ALPHABET) result.add(l + c + r.slice(1)); // sustitución
      for (const c of ALPHABET) result.add(l + c + r); // inserción
    }
  }
  return result;
}

export function damerauLevenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const d: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }
  return d[m][n];
}

/**
 * Sugerencias de corrección: primero palabras a distancia de edición 1;
 * si no hay, busca a distancia 2 de forma acotada.
 */
export function spellSuggestions(word: string, dict: Set<string>, limit = 5): string[] {
  const found = new Map<string, number>();
  for (const c of edits1(word)) {
    if (dict.has(c)) found.set(c, 1);
  }
  if (found.size === 0) {
    const e1List = [...edits1(word)].slice(0, 80);
    for (const e1 of e1List) {
      for (const e2 of edits1(e1)) {
        if (dict.has(e2) && !found.has(e2)) {
          found.set(e2, damerauLevenshtein(word, e2));
        }
      }
    }
  }
  return [...found.entries()]
    .sort(
      (a, b) =>
        a[1] - b[1] ||
        Math.abs(a[0].length - word.length) - Math.abs(b[0].length - word.length) ||
        a[0].localeCompare(b[0]),
    )
    .slice(0, limit)
    .map(([w]) => w);
}

export interface SpellingRecord {
  id: string;
  description: string;
}

export interface MisspelledWord {
  word: string;
  count: number;
  records: SpellingRecord[];
}

/** Agrupa por palabra las palabras que no están en el diccionario. */
export function analyzeDescriptions(movements: Movement[], dict: Set<string>): MisspelledWord[] {
  const map = new Map<string, MisspelledWord>();
  for (const m of movements) {
    const tokens = new Set(tokenize(m.description));
    for (const t of tokens) {
      if (dict.has(t)) continue;
      let entry = map.get(t);
      if (!entry) {
        entry = { word: t, count: 0, records: [] };
        map.set(t, entry);
      }
      entry.count += 1;
      if (entry.records.length < 100) {
        entry.records.push({ id: m.id, description: m.description });
      }
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}

/** Divide un texto manteniendo los separadores, para poder resaltar una palabra. */
export function splitKeepingSeparators(text: string): string[] {
  return text.split(/([^\p{L}]+)/u).filter((s) => s.length > 0);
}

export function matchesWord(token: string, word: string): boolean {
  return token.toLowerCase() === word.toLowerCase();
}
