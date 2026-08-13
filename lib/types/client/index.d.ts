/**
 * Status-label plugin, browser half: registers the General Settings text row
 * and provides the optional `conversationStatus` service the conversation
 * chat view reads for its running-turn status text. All policy lives here —
 * the live snapshot store, the durable write-through, and the service face —
 * so composing this plugin out of cordis.yml removes both the settings row
 * and the provider, leaving ui-conversation's built-in label in place.
 */
import type { Context } from '@deepseek-ai/cordis';
import { type StatusLabelKey } from './locales.ts';
/**
 * Optional running-turn status provider the conversation chat view reads via
 * `ctx.get('conversationStatus')`. Declared here rather than imported from
 * ui-conversation so the plugin stays installable against releases that do
 * not yet ship the contract (service faces are structural at runtime).
 */
export interface ConversationStatus {
    /** Current running-turn status text. */
    label(): string;
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Running status text row copy. */
        'status-label': StatusLabelKey;
    }
}
/** Services required for the settings row registration and its dictionaries. */
export declare const inject: string[];
/**
 * Client plugin body: register the dictionaries, the settings row, and the
 * conversationStatus provider.
 * @param ctx - client root context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map