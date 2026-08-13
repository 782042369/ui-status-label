/**
 * DOM fallback injector for the running-turn status text. Official ui-conversation
 * releases hard-code `Deep diving...` in the chat view's TurnStatus with no
 * provider seam, so this plugin replaces that rendered text directly: a
 * MutationObserver rewrites the status element's text node whenever it shows
 * the official fallback. Once an upstream release renders the provider's label
 * itself (the conversationStatus contract), the text never matches the
 * official fallback and this injector stays inert — the two paths coexist.
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'

/** The official hard-coded status text this injector replaces. */
const OFFICIAL_FALLBACK_TEXT = 'Deep diving...'

/** Selector for the running-turn status element (official markup: `role="status" aria-live="polite"`). */
const STATUS_SELECTOR = '[role="status"]'

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
        if (node.nodeValue === OFFICIAL_FALLBACK_TEXT || injected.has(node)) {
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
