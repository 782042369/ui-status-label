import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import css from './StatusLabelRow.module.css';
/** Longest status text the row accepts; bounds the chat-view layout. */
const MAX_STATUS_LABEL_LENGTH = 40;
/**
 * Render the running-turn status text editor.
 * @param props - composed Settings slot props.
 * @returns the preference row.
 */
export function StatusLabelRow({ useStatusLabel, setStatusLabel, t }) {
    const label = useStatusLabel(value => value);
    return (_jsxs("div", { className: css.row, children: [_jsxs("div", { className: css.rowText, children: [_jsx("div", { className: css.title, children: t('settings.status.title') }), _jsx("div", { className: css.desc, children: t('settings.status.description') })] }), _jsx("input", { type: "text", className: css.input, value: label, maxLength: MAX_STATUS_LABEL_LENGTH, spellCheck: false, onChange: (event) => { setStatusLabel(event.target.value); } })] }));
}
//# sourceMappingURL=StatusLabelRow.js.map