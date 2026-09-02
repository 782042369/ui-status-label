/**
 * DOM fallback injector for the running-turn status text. Official chat-view
 * releases render a built-in running-turn label with no provider seam — older
 * releases (`<= 0.1.1-rc`) hard-code `Deep diving...` in the markup, newer
 * releases (`>= 0.1.2-alpha`) localize it through the `chat.deepDiving`
 * dictionary key (`Deep diving...` / `深度求索中...`). This plugin replaces that
 * rendered text directly: a MutationObserver rewrites the status element's
 * text node whenever it shows any known official fallback. Once an upstream
 * release renders the provider's label itself (the conversationStatus
 * contract), the text never matches a fallback and this injector stays inert —
 * the two paths coexist.
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'

/**
 * Official status texts this injector replaces, across dsh-client releases:
 * - `<= 0.1.1-rc`: the chat view hard-codes the English literal in markup.
 * - `>= 0.1.2-alpha`: the label is localized through the `chat.deepDiving`
 *   dictionary key, so each shipped locale contributes its own literal
 *   (currently `en` and `zh`). Keep this list in sync when new locales ship.
 */
const OFFICIAL_FALLBACK_TEXTS: readonly string[] = [
  'Deep diving...',
  '深度求索中...',
]

/** Selector for the running-turn status element (official markup: `role="status" aria-live="polite"`). */
const STATUS_SELECTOR = '[role="status"]'

/**
 * Normalize a rendered text for fallback comparison: collapse surrounding
 * whitespace and unify the Unicode ellipsis so punctuation drift between
 * releases (for example `…` vs `...`) cannot defeat the match.
 * @param value - the raw text-node value seen in the DOM.
 * @returns the comparable form.
 */
function normalizeText(value: string): string {
  return value.replaceAll('\u2026', '...').trim()
}

/**
 * Check whether a rendered text is an official running-turn fallback across
 * the supported dsh-client version range.
 * @param value - the raw text-node value seen in the DOM.
 * @returns true when the text is a known official fallback worth replacing.
 */
function isOfficialFallbackText(value: string): boolean {
  const normalized = normalizeText(value)
  return OFFICIAL_FALLBACK_TEXTS.some((official) => normalizeText(official) === normalized)
}

/**
 * Install the DOM fallback injector.
 * @param label - reactive source of the user-configured status text.
 * @param fallback - text shown when the stored label is empty (cleared field).
 * @returns the disposer removing the observer and the subscription.
 */
export function installStatusLabelInjector(label: SnapshotStore<string>, fallback: string): () => void {
  if (typeof document === 'undefined') return () => {}
  // Text nodes this injector wrote; live preference changes rewrite them, and
  // an upstream label (never injected) is left alone.
  const injected = new WeakSet<Text>()
  const replace = (): void => {
    const text = label.getSnapshot() || fallback
    for (const element of document.querySelectorAll<HTMLElement>(STATUS_SELECTOR)) {
      for (const node of element.childNodes) {
        if (!(node instanceof Text)) continue
        if (node.nodeValue === text) continue
        if (isOfficialFallbackText(node.nodeValue ?? '') || injected.has(node)) {
          node.nodeValue = text
          injected.add(node)
        }
      }
    }
  }
  replace()
  const observer = new MutationObserver(replace)
  observer.observe(document.body, { childList: true, characterData: true, subtree: true })
  // Follow live preference changes; rapid writes coalesce per store commit.
  const unsubscribe = label.subscribe(replace)
  return () => {
    observer.disconnect()
    unsubscribe()
  }
}
