/** General Settings row for the running-turn status text shown in the chat view. */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** Registration-side status-label face. */
export interface StatusLabelRowInjected {
    hooks: {
        /** Persisted running-turn status text bound as useStatusLabel. */
        statusLabel: SnapshotStore<string>;
    };
    /** Change the running-turn status text. */
    setStatusLabel: (text: string) => void;
}
/** Full Settings-row props. */
export type StatusLabelRowProps = PropsRuntime<'settings.general.item'> & PropsLocale<'status-label'> & InjectFace<StatusLabelRowInjected>;
/**
 * Render the running-turn status text editor.
 * @param props - composed Settings slot props.
 * @returns the preference row.
 */
export declare function StatusLabelRow({ useStatusLabel, setStatusLabel, t }: StatusLabelRowProps): import("react").JSX.Element;
//# sourceMappingURL=StatusLabelRow.d.ts.map