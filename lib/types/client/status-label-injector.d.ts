/**
 * DOM fallback injector for the running-turn status text. Official ui-conversation
 * releases hard-code `Deep diving...` in the chat view's TurnStatus with no
 * provider seam, so this plugin replaces that rendered text directly: a
 * MutationObserver rewrites the status element's text node whenever it shows
 * the official fallback. Once an upstream release renders the provider's label
 * itself (the conversationStatus contract), the text never matches the
 * official fallback and this injector stays inert — the two paths coexist.
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
/**
 * Install the DOM fallback injector.
 * @param label - reactive source of the user-configured status text.
 * @param fallback - text shown when the stored label is empty (cleared field).
 * @returns the disposer removing the observer and the subscription.
 */
export declare function installStatusLabelInjector(label: SnapshotStore<string>, fallback: string): () => void;
//# sourceMappingURL=status-label-injector.d.ts.map