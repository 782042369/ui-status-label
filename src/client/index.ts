/**
 * Status-label plugin, browser half: registers the General Settings text row
 * and provides the optional `conversationStatus` service the conversation
 * chat view reads for its running-turn status text. All policy lives here —
 * the live snapshot store, the durable write-through, and the service face —
 * so composing this plugin out of cordis.yml removes both the settings row
 * and the provider, leaving ui-conversation's built-in label in place.
 */
import type { Context } from '@deepseek-ai/cordis'
// Type-only: the ctx.settingsScope Context merge. Cross-plugin collaboration
// goes through the service, never a value import (client bundle purity gate).
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import { StatusLabelRow } from './StatusLabelRow.tsx'
import { StatusLabelPolicy } from './status-label-policy.ts'
import { installStatusLabelInjector } from './status-label-injector.ts'
import { en, NS, zh, type StatusLabelKey } from './locales.ts'
import { STATUS_NAMESPACE, type StatusLabelSettings } from '../status-settings.ts'

/**
 * Optional running-turn status provider the conversation chat view reads via
 * `ctx.get('conversationStatus')`. Declared here rather than imported from
 * ui-conversation so the plugin stays installable against releases that do
 * not yet ship the contract (service faces are structural at runtime).
 */
export interface ConversationStatus {
  /** Current running-turn status text. */
  label(): string
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Running status text row copy. */
    'status-label': StatusLabelKey
  }
}

/** Services required for the settings row registration and its dictionaries. */
export const inject = ['slots', 'settingsScope', 'locale', 'connection', 'remote']

/**
 * Client plugin body: register the dictionaries, the settings row, and the
 * conversationStatus provider.
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  const scope = ctx.settingsScope.bind<StatusLabelSettings>({ namespace: STATUS_NAMESPACE })
  const policy = new StatusLabelPolicy(scope)
  ctx.effect(() => { return ctx.locale.register(NS, { zh, en }) }, 'ui-status-label: dictionaries')
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'status-label',
    order: 30,
    locale: NS,
    inject: () => ({
      hooks: { statusLabel: policy.statusLabel },
      setStatusLabel: (text: string) => { policy.setStatusLabel(text) },
    }),
  }, StatusLabelRow))
  // The chat view reaches this face via ctx.get, so its absence — this plugin
  // composed out — is the built-in label state.
  const status: ConversationStatus = {
    label: () => policy.statusLabel.getSnapshot(),
  }
  ctx.provide('conversationStatus', status)
  // DOM fallback for official releases that hard-code the status text and do
  // not read conversationStatus yet; inert once an upstream label renders.
  ctx.effect(() => installStatusLabelInjector(policy.statusLabel), 'ui-status-label: dom status injector')
}
