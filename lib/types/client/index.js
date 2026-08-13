import { StatusLabelRow } from "./StatusLabelRow.js";
import { StatusLabelPolicy } from "./status-label-policy.js";
import { installStatusLabelInjector } from "./status-label-injector.js";
import { en, NS, zh } from "./locales.js";
import { STATUS_NAMESPACE } from "../status-settings.js";
/** Services required for the settings row registration and its dictionaries. */
export const inject = ['slots', 'settingsScope', 'locale', 'connection', 'remote'];
/**
 * Client plugin body: register the dictionaries, the settings row, and the
 * conversationStatus provider.
 * @param ctx - client root context.
 */
export function apply(ctx) {
    const scope = ctx.settingsScope.bind({ namespace: STATUS_NAMESPACE });
    const policy = new StatusLabelPolicy(scope);
    ctx.effect(() => { return ctx.locale.register(NS, { zh, en }); }, 'ui-status-label: dictionaries');
    ctx.slots.inject('settings.general.item', () => ctx.slots.register({
        name: 'settings.general.item',
        id: 'status-label',
        order: 30,
        locale: NS,
        inject: () => ({
            hooks: { statusLabel: policy.statusLabel },
            setStatusLabel: (text) => { policy.setStatusLabel(text); },
        }),
    }, StatusLabelRow));
    // The chat view reaches this face via ctx.get, so its absence — this plugin
    // composed out — is the built-in label state.
    const status = {
        label: () => policy.statusLabel.getSnapshot(),
    };
    ctx.provide('conversationStatus', status);
    // DOM fallback for official releases that hard-code the status text and do
    // not read conversationStatus yet; inert once an upstream label renders.
    ctx.effect(() => installStatusLabelInjector(policy.statusLabel), 'ui-status-label: dom status injector');
}
//# sourceMappingURL=index.js.map