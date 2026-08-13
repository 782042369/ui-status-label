/** The official hard-coded status text this injector replaces. */
const OFFICIAL_FALLBACK_TEXT = 'Deep diving...';
/** Selector for the running-turn status element (official markup: `role="status" aria-live="polite"`). */
const STATUS_SELECTOR = '[role="status"]';
/**
 * Install the DOM fallback injector.
 * @param label - reactive source of the user-configured status text.
 * @returns the disposer removing the observer and the subscription.
 */
export function installStatusLabelInjector(label) {
    if (typeof document === 'undefined')
        return () => { };
    // Text nodes this injector wrote; live preference changes rewrite them, and
    // an upstream label (never injected) is left alone.
    const injected = new WeakSet();
    const replace = () => {
        const text = label.getSnapshot();
        for (const element of document.querySelectorAll(STATUS_SELECTOR)) {
            for (const node of element.childNodes) {
                if (!(node instanceof Text))
                    continue;
                if (node.nodeValue === text)
                    continue;
                if (node.nodeValue === OFFICIAL_FALLBACK_TEXT || injected.has(node)) {
                    node.nodeValue = text;
                    injected.add(node);
                }
            }
        }
    };
    replace();
    const observer = new MutationObserver(replace);
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    // Follow live preference changes; rapid writes coalesce per store commit.
    const unsubscribe = label.subscribe(replace);
    return () => {
        observer.disconnect();
        unsubscribe();
    };
}
//# sourceMappingURL=status-label-injector.js.map