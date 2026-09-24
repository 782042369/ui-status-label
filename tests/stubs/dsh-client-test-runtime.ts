/**
 * Standalone vitest stub for the monorepo test runtime. The real package
 * pulls the whole client UI stack with it; this plugin's tests only need
 * `makeTranslate`, reproduced with its exact resolution semantics
 * (dictionaries in order, key fallback, `{param}` interpolation).
 */

/** Build a translate function resolving through `dicts` in order. */
export function makeTranslate(...dicts: Array<Record<string, string>>) {
  return (key: string, params?: Record<string, unknown>): string => {
    let template = key
    for (const dict of dicts) {
      const hit = dict[key]
      if (hit !== undefined) {
        template = hit
        break
      }
    }
    if (!params) return template
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match)
  }
}
